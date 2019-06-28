import { Task } from '../services/GoogleTasks'

export const RECEIVE_TASKS: string = 'RECEIVE_TASKS';
export const UPDATE_TASK: string = 'UPDATE_TASK'
export const UPDATE_TASK_COMPLETION: string = 'UPDATE_TASK_COMPLETION'

export type TasksAction = {
    type: string,
    payload: Task[]
}

export type UpdateTaskAction = {
    type: string,
    payload: Task
}

export type UpdateTaskCompletionAction = {
    type: string,
    task: string,
    tasklist: string,
    completed: boolean
}

export function receiveTasksAction(tasks: Task[]): TasksAction {
    return {
        type: RECEIVE_TASKS,
        payload: tasks
    }
}

export function updateTaskCompletionAction(task: string, tasklist: string, completed: boolean): UpdateTaskCompletionAction {
    return {
        type: UPDATE_TASK_COMPLETION,
        task,
        tasklist,
        completed
    }
}

export function updateTaskAction(task: Task): UpdateTaskAction {
    return {
        type: UPDATE_TASK,
        payload: task
    }
}