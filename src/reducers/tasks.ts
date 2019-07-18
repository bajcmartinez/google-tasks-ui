import {
    DELETE_TASK, INSERT_TASK,
    RECEIVE_TASKS,
    UPDATE_TASK,
    UPDATE_TASK_COMPLETION,
    Action, TasksAction, TaskAction, UpdateTaskCompletionAction, DeleteTaskAction
} from '../actions/tasks'
import { Task } from '../services/GoogleTasks/GoogleTasks'

export type TasksState = {
    list: Task[]
}

export const initialTasksState: TasksState = {
    list: []
};

export function tasksReducer(
    state: TasksState = initialTasksState,
    action: Action
): TasksState {

    switch (action.type) {
        case RECEIVE_TASKS:

            return {
                ...state,
                list: [...(action as TasksAction).payload]
            };

        case UPDATE_TASK:
            const updated = (action as TaskAction).payload as Task;
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
                    if (task.id === (action as UpdateTaskCompletionAction).task) {
                        return { ...task, completed: (action as UpdateTaskCompletionAction).completed };
                    }

                    return task;
                })
            };

        case DELETE_TASK:
            const deleteAction = action as DeleteTaskAction;
            if (deleteAction.parent) {
                // We are deleting a sub task

                const updatedParent = state.list.find((parent: Task) => parent.id === deleteAction.parent);
                if (!updatedParent) {
                    return state;
                }

                return {
                    ...state,
                    list: state.list.map((task: Task): Task => {
                        if (task.id === updatedParent.id) {
                            updatedParent.subtasks = updatedParent.subtasks.filter((subtask: Task) => (subtask.id !== deleteAction.task || subtask.listId !== deleteAction.taskList));

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
                    list: state.list.filter((task: Task) => (task.id !== deleteAction.task || task.listId !== deleteAction.taskList))
                };
            }

        case INSERT_TASK:
            return {
                ...state,
                list: [...state.list, { ...(action as TaskAction).payload }]
            };

        default:
            return state;
        
    }
}