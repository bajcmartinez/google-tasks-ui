import { TaskList } from '../types/google'

export const RECEIVE_TASKLISTS = 'RECEIVE_TASKLISTS';
export const UPDATE_TASKLIST = 'UPDATE_TASKLIST';
export const INSERT_TASKLIST = 'INSERT_TASKLIST';

export type TaskListsAction = {
    type: string,
    payload: TaskList[]
}

export type TaskListAction = {
    type: string,
    payload: TaskList
}

export function receiveTaskLists(taskLists: TaskList[]): TaskListsAction {
    return {
        type: RECEIVE_TASKLISTS,
        payload: taskLists
    }
}

export function updateTaskListAction(taskList: TaskList): TaskListAction {
    return {
        type: UPDATE_TASKLIST,
        payload: taskList
    }
}

export function insertTaskListAction(taskList: TaskList): TaskListAction {
    return {
        type: INSERT_TASKLIST,
        payload: taskList
    }
}

export type Action = TaskListsAction | TaskListAction;