import { Task } from '../services/GoogleTasks'

export const RECEIVE_TASKS = 'RECEIVE_TASKS';

export type TasksAction = {
    type: string,
    payload: Task[]
}

export function receiveTasks(tasks: Task[]): TasksAction {
    return {
        type: RECEIVE_TASKS,
        payload: tasks
    }
}