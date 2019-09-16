/* istanbul ignore file */
import moment  from 'moment';
import { Task, TaskList } from '../../types/google';

// @ts-ignore
let google = window.gapi;

export class GoogleTasksWebService {
  private readonly clientId: string = "721709625729-0jp536rce8pn3i5ie0pg213d2t55mu55.apps.googleusercontent.com";
  private readonly scopes: string = 'https://www.googleapis.com/auth/tasks';
  private readonly discoveryDocs = ["https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest"];
  private isLoaded: boolean = false;
  private auth: any;

  /**
   * Loads the client library and gets all the api required information from google servers
   *
   */
  loadScript() {
    if (this.isLoaded) return Promise.resolve();

    const self = this;

    return new Promise(resolve => {

      // To load first we need to inject the scripts
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.async = true;
      script.defer = true;
      // @ts-ignore
      script.onload = () => {
        // Then we load the API
        // @ts-ignore
        // eslint-disable-next-line no-undef
        gapi.load('client:auth2', async () => {
          const gapiInit = async () => {
            // @ts-ignore
            // eslint-disable-next-line no-undef
            await gapi.client.init({
              clientId: this.clientId,
              discoveryDocs: this.discoveryDocs,
              scope: this.scopes
            }).then(() => {
              // @ts-ignore
              // eslint-disable-next-line no-undef
              google = gapi;

              self.isLoaded = true;
              resolve();
            });
          };

          try {
            await gapiInit();
          }catch (e) {
            console.log("Error initializing GAPI");
            console.error(e);
            setTimeout(gapiInit, 2000);
          }
        });
      };

      document.body.appendChild(script);
    });
  }

  /**
   * Gets the client authorization to query google's API
   *
   */
  load(callback: (isSignedIn: boolean) => void) {
    return new Promise(async (resolve) => {
      await this.loadScript();
      this.auth = google.auth2.getAuthInstance();

      this.subscribeSigninStatus(callback);
      resolve();
    });
  }

  /**
   * Returns whether the current session is signed in or not
   *
   */
  isSignedIn () {
    if (!this.auth) return false;
    return this.auth.isSignedIn.get();
  }

  /**
   * Event listener for sign in status
   *
   * @param subscriber
   */
    subscribeSigninStatus (subscriber: (status: boolean) => void) {
    if (!this.auth) return false;
    subscriber(this.isSignedIn());
    return this.auth.isSignedIn.listen(subscriber);
  }

  /**
   * Starts the sign in process against your Google Account
   *
   */
  signIn() {
    this.auth.signIn();
  }

  /**
   * Starts the sign out process against your Google Account
   *
   */
  signOut() {
    this.auth.signOut();
  }

  /**
   * Lists all tasks lists
   *
   * @returns TaskList[]
   */
  async listTaskLists() {
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
  async listTasks(taskListId: string, pageToken: string = '') {
    const response = await google.client.tasks.tasks.list({
      tasklist: taskListId,
      showCompleted: false,
      showHidden: true,
      pageToken: pageToken
    });

    let result: Task[] = [];

    const items = response.result.items;
    if (!items)
      return result;

    const nextPageToken = response.result.nextPageToken as string;

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
  async updateTaskCompletion(task: string, tasklist: string, completed: boolean) {
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
  async insertTask(task: Task) {
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
  async updateTask(task: Task) {
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
  async deleteTask(task: string, tasklist: string) {
    await google.client.tasks.tasks.delete({
      tasklist,
      task
    });
  }

  /**
   * Only used for testing purposes, view mock file
   */
  reset() {

  }
}