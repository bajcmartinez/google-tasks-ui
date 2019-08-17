import moment from 'moment';
import {Task} from "../GoogleTasks";

class GoogleTasksService {

  static _signedIn: boolean = false;
  static _subscription: (status: boolean) => void | undefined;

  static authorize() {
    return Promise.resolve(true);
  }

  static signIn() {
    this._signedIn = true;
    this._subscription && this._subscription(this._signedIn);
  }

  static signOut() {
    this._signedIn = false;
    this._subscription && this._subscription(this._signedIn);
  }

  static isSignedIn() {
    return this._signedIn;
  }

  static listTaskLists() {
    return Promise.resolve([
      {
        id: "1",
        status: "active",
        title: "Task List 1",
        updatedAt: moment()
      },
      {
        id: "2",
        status: "active",
        title: "Task List 2",
        updatedAt: moment()
      }
    ]);
  }

  static async listTasks(taskListId: string, pageToken: string = '') {
    return Promise.resolve([
      {
        id: `${taskListId.toString()}_1`,
        title: 'Task 1',
        notes: 'notes 1',
        subtasks: [],
        listId: taskListId,
        isDirty: false,
        dueAt: moment().add(7, 'days'),
        completed: false,
        status: "needsAction",
        updatedAt: moment(),
        parent: ""
      },
      {
        id: `${taskListId.toString()}_2`,
        title: 'Task 2',
        notes: 'notes 2',
        subtasks: [],
        listId: taskListId,
        isDirty: false,
        completed: false,
        status: "needsAction",
        updatedAt: moment(),
        parent: ""
      },
      {
        id: `${taskListId.toString()}_3`,
        title: 'Task 3',
        notes: 'notes 3',
        subtasks: [],
        listId: taskListId,
        isDirty: false,
        dueAt: moment().add(-3, 'days'),
        completed: false,
        status: "needsAction",
        updatedAt: moment(),
        parent: ""
      },
      {
        id: `${taskListId.toString()}_4`,
        title: 'Task 4',
        notes: 'notes 4',
        subtasks: [],
        listId: taskListId,
        isDirty: false,
        dueAt: moment().add(1, 'days'),
        completed: false,
        status: "needsAction",
        updatedAt: moment(),
        parent: ""
      },
      {
        id: `${taskListId.toString()}_5`,
        title: 'Task 4',
        notes: 'notes 4',
        subtasks: [],
        listId: taskListId,
        isDirty: false,
        dueAt: moment().add(1, 'days'),
        completed: false,
        status: "completed",
        updatedAt: moment(),
        parent: `${taskListId.toString()}_4`
      }
    ]);
  }

  static async updateTaskCompletion(task: string, tasklist: string, completed: boolean) {
    return Promise.resolve();
  }

  static async insertTask(task: Task) {
    return Promise.resolve({
      result: {
        id: 999
      }
    });
  }

  static async deleteTask(task: string, tasklist: string) {
    return Promise.resolve();
  }

  static async updateTask(task: Task) {
    return Promise.resolve();
  }

  static subscribeSigninStatus (subscriber: (status: boolean) => void) {
    this._subscription = subscriber;
  }

  /**
   * Only used for testing purposes
   */
  static reset() {
    this._signedIn = false;
    // @ts-ignore
    this._subscription = null;
  }
}

export default GoogleTasksService;