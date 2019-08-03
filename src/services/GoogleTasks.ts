/* istanbul ignore file */
import moment, { Moment } from 'moment';

// @ts-ignore
let google = window.gapi;

export type TaskList = {
  id: string,
  title: string,
  updatedAt: Moment,
  status: string
}

export type Task = {
  id: string,
  title: string,
  notes?: string,
  completed: boolean,
  completedAt?: Moment,
  dueAt?: Moment,
  parent: string,
  updatedAt: Moment,
  status: string,
  listId: string,
  subtasks: Task[],
  isDirty: boolean
}

class GoogleTasksService {
  private static clientId: string = "721709625729-0jp536rce8pn3i5ie0pg213d2t55mu55.apps.googleusercontent.com";
  private static scopes: string = 'https://www.googleapis.com/auth/tasks';
  private static isLoaded: boolean = false;
  private static auth: any;

  /**
   * Loads the client library and gets all the api required information from google servers
   *
   */
  static load() {
    if (this.isLoaded) return Promise.resolve();

    const self = this;

    return new Promise(resolve => {

      // To load first we need to inject the scripts
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      // @ts-ignore
      script.onload = () => {
        // @ts-ignore
        google = window.gapi;

        // Then we load the API
        google.load('client', () => {
          google.client.load('tasks', 'v1', () => {
            // @ts-ignore
            google = window.gapi;

            self.isLoaded = true;
            resolve();
          });
        });
      };

      document.body.appendChild(script);
    });
  }

  /**
   * Gets the client authorization to query google's API
   *
   */
  static authorize() {
    return new Promise(async (resolve) => {
      await this.load();

      this.auth = await google.auth2.init({
        client_id: this.clientId,
        scope: this.scopes
      });

      resolve();
    });
  }

  /**
   * Returns whether the current session is signed in or not
   *
   */
  static isSignedIn () {
    if (!this.auth) return false;
    return this.auth.isSignedIn.get();
  }

  /**
   * Event listener for sign in status
   *
   * @param subscriber
   */
  static subscribeSigninStatus (subscriber: (status: boolean) => void) {
    if (!this.auth) return false;
    return this.auth.isSignedIn.listen(subscriber);
  }

  /**
   * Starts the sign in process against your Google Account
   *
   */
  static signIn() {
    this.auth.signIn();
  }

  /**
   * Starts the sign out process against your Google Account
   *
   */
  static signOut() {
    this.auth.signOut();
  }

  /**
   * Lists all tasks lists
   *
   * @returns TaskList[]
   */
  static async listTaskLists() {
    const response = await google.client.tasks.tasklists.list();

    return response.result.items.map((item: any): TaskList => ({
      id: item["id"],
      title: item["title"],
      updatedAt: moment(item["updated"])
    }) as TaskList);
  }

  /**
   * Lists all tasks for a given task list
   *
   * @returns Task[]
   */
  static async listTasks(taskListId: string, pageToken: string = '') {
    const response = await google.client.tasks.tasks.list({
      tasklist: taskListId,
      showCompleted: false,
      showHidden: true,
      pageToken: pageToken
    });

    const items = response.result.items;
    const nextPageToken = response.result.nextPageToken as string;

    let result: Task[] = [];

    const mapItems = (tasks: any[]): Task[] => {
      return tasks.map((item: any): Task => ({
        id: item["id"],
        title: item["title"] ? item['title'] : '',
        notes: item["notes"] ? item["notes"] : '',
        dueAt: item["due"] ? moment(item["due"]) : undefined,
        parent: item["parent"],
        completed: item["status"] === "completed",
        completedAt: item["completed"] ? moment(item["completed"]) : undefined,
        updatedAt: moment(item["updated"]),
        listId: taskListId,
        status: item["status"],
        isDirty: false,
        subtasks: mapItems(items.filter((subitem: any) => subitem["parent"] === item["id"]))
      }) as Task);
    };

    result = result.concat(mapItems(items.filter((subitem: any) => !subitem["parent"])));

    if (nextPageToken) {
      result = result.concat(await this.listTasks(taskListId, nextPageToken));
    }

    return result;
  }

  /**
   * Sets the completion status of a task
   *
   * @param task: string
   * @param tasklist: string
   * @param completed: boolean
   */
  static async updateTaskCompletion(task: string, tasklist: string, completed: boolean) {
    await google.client.tasks.tasks.update({
      tasklist,
      task,
      id: task,
      status: completed ? 'completed' : 'needsAction'
    });
  }

  /**
   * Creates a task
   *
   * @param task: Task
   */
  static async insertTask(task: Task) {
    return await google.client.tasks.tasks.insert({
      tasklist: task.listId,
      task: task.id,
      id: task.id,
      title: task.title ? task.title : '',
      notes: task.notes ? task.notes : '',
      due: task.dueAt ? task.dueAt.format() : null,
      status: task.completed ? 'completed' : 'needsAction',
      parent: task.parent
    });
  }

  /**
   * Updates a task
   *
   * @param task: Task
   */
  static async updateTask(task: Task) {
    await google.client.tasks.tasks.update({
      tasklist: task.listId,
      task: task.id,
      id: task.id,
      title: task.title,
      notes: task.notes,
      due: task.dueAt ? task.dueAt.format() : null,
      status: task.completed ? 'completed' : 'needsAction'
    });
  }

  /**
   * Deletes a task
   *
   * @param task: string
   * @param tasklist: string
   */
  static async deleteTask(task: string, tasklist: string) {
    await google.client.tasks.tasks.delete({
      tasklist,
      task
    });
  }

  /**
   * Only used for testing purposes, view mock file
   */
  static reset() {

  }
}

export default GoogleTasksService;