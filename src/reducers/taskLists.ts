import { RECEIVE_TASKLISTS } from '../actions/taskLists';
import { TaskList } from '../services/GoogleTasks'
import { AnyAction } from 'redux'

export type TaskListsState = {
    list: TaskList[]
}

export const initialTaskListsState: TaskListsState = {
    list: []
};

export function taskListsReducer(
    state: TaskListsState = initialTaskListsState,
    action: AnyAction
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