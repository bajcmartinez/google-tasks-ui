import {
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

        default:
            return state;
        
    }
}