import { RECEIVE_TASKS, TasksAction } from '../actions/tasks';
import { Task } from '../services/GoogleTasks'

export type TasksState = {
    list: Task[]
}

export const initialTasksState: TasksState = {
    list: []
};

export function tasksReducer(
    state: TasksState = initialTasksState,
    action: TasksAction
): TasksState {

    switch (action.type) {
        case RECEIVE_TASKS:
            return {
                ...state,
                list: [...action.payload]
            };

        default:
            return state;
        
    }
}