import { TaskList } from '../services/GoogleTasks'

export const RECEIVE_TASKLISTS = 'RECEIVE_TASKLISTS';

type TaskListsAction = {
    type: string,
    payload: TaskList[]
}

export function receiveTaskLists(taskLists: TaskList[]): TaskListsAction {
    return {
        type: RECEIVE_TASKLISTS,
        payload: taskLists
    }
}

export type Action = TaskListsAction