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
            return {
                ...state,
                list: state.list.map((task: Task): Task => {
                    const updated = action.payload as Task;
                    if (task.id === updated.id) {
                        return { ...task, ...updated };
                    }

                    return task;
                })
            };

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