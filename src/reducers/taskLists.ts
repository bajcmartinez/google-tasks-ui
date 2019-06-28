import { RECEIVE_TASKLISTS, TaskListsAction } from '../actions/taskLists';
import { TaskList } from '../services/GoogleTasks'

export type TaskListsState = {
    list: TaskList[]
}

export const initialTaskListsState: TaskListsState = {
    list: []
};

export function taskListsReducer(
    state: TaskListsState = initialTaskListsState,
    action: TaskListsAction
): TaskListsState {

    switch (action.type) {
        case RECEIVE_TASKLISTS:
            return {
                ...state,
                list: [...action.payload]
            };

        default:
            return state;
        
    }
}