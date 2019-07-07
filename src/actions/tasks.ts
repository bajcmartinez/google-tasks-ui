import { Task } from '../services/GoogleTasks'

export const RECEIVE_TASKS: string = 'RECEIVE_TASKS';
export const UPDATE_TASK: string = 'UPDATE_TASK';
export const DELETE_TASK: string = 'DELETE_TASK';
export const INSERT_TASK: string = 'INSERT_TASK';
export const UPDATE_TASK_COMPLETION: string = 'UPDATE_TASK_COMPLETION';

export type TasksAction = {
    type: string,
    payload: Task[]
}

export type TaskAction = {
    type: string,
    payload: Task
}

export type UpdateTaskCompletionAction = {
    type: string,
    task: string,
    taskList: string,
    completed: boolean
}

export type DeleteTaskAction = {
    type: string,
    task: string,
    taskList: string,
    parent: string
}

export function receiveTasksAction(tasks: Task[]): TasksAction {
    return {
        type: RECEIVE_TASKS,
        payload: tasks
    }
}

export function updateTaskCompletionAction(task: string, taskList: string, completed: boolean): UpdateTaskCompletionAction {
    return {
        type: UPDATE_TASK_COMPLETION,
        task,
        taskList,
        completed
    }
}

export function updateTaskAction(task: Task): TaskAction {
    return {
        type: UPDATE_TASK,
        payload: task
    }
}

export function insertTaskAction(task: Task): TaskAction {
    return {
        type: INSERT_TASK,
        payload: task
    }
}

export function deleteTaskAction(task: string, taskList: string, parent: string): DeleteTaskAction {
    return {
        type: DELETE_TASK,
        task,
        taskList,
        parent
    }
}