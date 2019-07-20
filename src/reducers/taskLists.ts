import { RECEIVE_TASKLISTS, Action } from '../actions/taskLists';
import { TaskList } from '../services/GoogleTasks';

export type TaskListsState = {
    list: TaskList[]
}

export const initialTaskListsState: TaskListsState = {
    list: []
};

export function taskListsReducer(
    state: TaskListsState = initialTaskListsState,
    action: Action
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