import { RECEIVE_TASKLISTS, TaskListsAction } from '../actions/taskLists';
import { TaskList } from '../services/GoogleTasks'

export type TaskListsState = {
    list: TaskList[]
}

const initialState: TaskListsState = {
    list: []
};

export function taskListsReducer(
    state: TaskListsState = initialState,
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