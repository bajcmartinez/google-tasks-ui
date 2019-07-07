import {
    DELETE_TASK, INSERT_TASK,
    RECEIVE_TASKS,
    UPDATE_TASK,
    UPDATE_TASK_COMPLETION,
} from '../actions/tasks'
import { Task } from '../services/GoogleTasks'
import { AnyAction } from 'redux'

export type TasksState = {
    list: Task[]
}

export const initialTasksState: TasksState = {
    list: []
};

export function tasksReducer(
    state: TasksState = initialTasksState,
    action: AnyAction
): TasksState {

    switch (action.type) {
        case RECEIVE_TASKS:
            return {
                ...state,
                list: [...action.payload]
            };

        case UPDATE_TASK:
            const updated = action.payload as Task;
            if (updated.parent) {
                // We are updating a subtask
                const updatedParent = state.list.find((parent: Task) => parent.id === updated.parent);
                if (!updatedParent) {
                    return state;
                }

                return {
                    ...state,
                    list: state.list.map((task: Task): Task => {
                        if (task.id === updatedParent.id) {
                            updatedParent.subtasks = updatedParent.subtasks.map((subtask: Task): Task => {
                                if (subtask.id === updated.id) {
                                    return {...subtask, ...updated};
                                }

                                return subtask;
                            });

                            return {
                                ...updatedParent
                            }
                        }

                        return task;
                    })
                };
            } else {
                return {
                    ...state,
                    list: state.list.map((task: Task): Task => {
                        if (task.id === updated.id) {
                            return {...task, ...updated};
                        }

                        return task;
                    })
                };
            }

        case UPDATE_TASK_COMPLETION:
            return {
                ...state,
                list: state.list.map((task: Task): Task => {
                    if (task.id === action.task) {
                        return { ...task, completed: action.completed };
                    }

                    return task;
                })
            };

        case DELETE_TASK:
            if (action.parent) {
                // We are deleting a sub task

                const updatedParent = state.list.find((parent: Task) => parent.id === action.parent);
                debugger;
                if (!updatedParent) {
                    return state;
                }

                return {
                    ...state,
                    list: state.list.map((task: Task): Task => {
                        if (task.id === updatedParent.id) {
                            updatedParent.subtasks = updatedParent.subtasks.filter((subtask: Task) => (subtask.id !== action.task || subtask.listId !== action.taskList));

                            return {
                                ...updatedParent
                            }
                        }

                        return task;
                    })
                };
            } else {
                // We are deleting a parent task
                return {
                    ...state,
                    list: state.list.filter((task: Task) => (task.id !== action.task || task.listId !== action.taskList))
                };
            }

        case INSERT_TASK:
            return {
                ...state,
                list: [...state.list, { ...action.payload }]
            };

        default:
            return state;
        
    }
}