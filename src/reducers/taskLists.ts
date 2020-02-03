import { RECEIVE_TASKLISTS, INSERT_TASKLIST, Action, TaskListAction, TaskListsAction } from '../actions/taskLists';
import { TaskList } from '../types/google';

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
                list: [...(action as TaskListsAction).payload]
            };

        case INSERT_TASKLIST:
            return {
                ...state,
                list: [...state.list, { ...(action as TaskListAction).payload }]
            }

        default:
            return state;
        
    }
}