/* istanbul ignore file */
import { GoogleTasksWebService } from './Web';
import { google, tasks_v1 } from 'googleapis'
import moment  from 'moment';
import { Task, TaskList } from '../../types/google';
import { APIEndpoint, OAuth2Client } from 'googleapis-common';
import { ipcRenderer } from 'electron';

const scopes: Array<string> = ['https://www.googleapis.com/auth/tasks'];
const tokenStorageId = "gatt-v1";

export class GoogleTasksElectronService extends GoogleTasksWebService {
  private tasksAPI: APIEndpoint | undefined;
  private taskListsAPI: APIEndpoint | undefined;
  private oAuth2Client: OAuth2Client | undefined;
  private signedInCallback: (isSignedIn: boolean) => void = () => {};

  /**
   * Gets the client authorization to query google's API
   *
   */
  load(callback: (isSignedIn: boolean) => void) {
    this.oAuth2Client = new google.auth.OAuth2(
      "721709625729-0jp536rce8pn3i5ie0pg213d2t55mu55.apps.googleusercontent.com", // Client Id
      "SoEHofyXw1fuGgdYBa1IXuAT", // Client Secret Id
      "https://googletasksui.com"
    );

    this.oAuth2Client.on('tokens', (tokens) => {
      this.oAuth2Client && this.oAuth2Client.setCredentials(tokens);
      localStorage.setItem(tokenStorageId, JSON.stringify(tokens));
    });

    const { tasks: tasksAPI, tasklists: taskListsAPI } = google.tasks({
      version: 'v1',
      auth: this.oAuth2Client
    });

    this.tasksAPI = tasksAPI;
    this.taskListsAPI = taskListsAPI;
    this.signedInCallback = callback;

    ipcRenderer.on('google-auth-reply', async (event:any, access_token: string) => {
      await this.getTokenAPI(access_token);
      if (this.signedInCallback)
        this.signedInCallback(true);
    });

    return Promise.resolve();
  }

  async getTokenAPI(code: string) {
    if (this.oAuth2Client) {
      try {
        const { tokens } = await this.oAuth2Client.getToken(code);
        this.oAuth2Client.setCredentials(tokens);
        localStorage.setItem(tokenStorageId, JSON.stringify(tokens));
        return tokens;
      } catch (err) {
        return Promise.reject(err);
      }
    } else {
      return Promise.reject();
    }
  }

  /**
   * Returns whether the current session is signed in or not
   *
   */
  isSignedIn () {
    return false;
    // if (!this.auth) return false;
    // return this.auth.isSignedIn.get();
  }

  /**
   * Starts the sign in process against your Google Account
   *
   */
  signIn() {
    if (this.oAuth2Client) {
      const authorizeUrl = this.oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
      });

      const token = localStorage.getItem(tokenStorageId);
      if (!token) {
        ipcRenderer.send('google-auth-start', authorizeUrl);
        return Promise.resolve();
      } else {
        this.oAuth2Client.setCredentials(JSON.parse(token));
        this.signedInCallback(true);
        return Promise.resolve();
      }
    }

    return Promise.reject();
  }

  /**
   * Starts the sign out process against your Google Account
   *
   */
  signOut() {
    // this.auth.signOut();
  }

  /**
   * Lists all tasks lists
   *
   * @returns TaskList[]
   */
  async listTaskLists() {
    const response = this.taskListsAPI && await this.taskListsAPI.list();

    if (!response.data || !response.data.items)
      return [];

    return response.data.items.map((item: any): TaskList => ({
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
    const response = this.tasksAPI && await this.tasksAPI.list({
      tasklist: taskListId,
      showCompleted: false,
      showHidden: true,
      pageToken: pageToken
    });

    let result: Task[] = [];


    if (!response.data || !response.data.items)
      return result;

    const items = response.data.items;

    const nextPageToken = response.data.nextPageToken as string;

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
    const requestBody: tasks_v1.Schema$Task = {
      id: task,
      status: completed ? 'completed' : 'needsAction'
    }

    this.tasksAPI && await this.tasksAPI.update({
      tasklist,
      task,
      requestBody
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