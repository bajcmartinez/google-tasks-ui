import moment from 'moment';
import { Task } from "../../../types/google";
import { GoogleTasksWebService } from '../Web';

class Index extends GoogleTasksWebService {

  private _signedIn: boolean = false;
  private _subscription: ((status: boolean) => void) | undefined;

  load(callback: (isSignedIn: boolean) => void) {
    this.subscribeSigninStatus(callback);
    return Promise.resolve();
  }

  authorize() {
    return Promise.resolve(true);
  }

  signIn() {
    this._signedIn = true;
    this._subscription && this._subscription(this._signedIn);
  }

  signOut() {
    this._signedIn = false;
    this._subscription && this._subscription(this._signedIn);
  }

  isSignedIn() {
    return this._signedIn;
  }

  listTaskLists() {
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

  async listTasks(taskListId: string, pageToken: string = '') {
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

  async updateTaskCompletion(task: string, tasklist: string, completed: boolean) {
    return Promise.resolve();
  }

  async insertTask(task: Task) {
    return Promise.resolve({
      result: {
        id: 999
      }
    });
  }

  async deleteTask(task: string, tasklist: string) {
    return Promise.resolve();
  }

  async updateTask(task: Task) {
    return Promise.resolve();
  }

  subscribeSigninStatus (subscriber: (status: boolean) => void) {
    this._subscription = subscriber;
  }

  reset() {
    this._signedIn = false;
    // @ts-ignore
    this._subscription = null;
  }
}

const r = new Index();
export default r;