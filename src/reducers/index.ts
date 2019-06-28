import { combineReducers } from 'redux';
import { taskListsReducer } from './taskLists'

const rootReducer = combineReducers({
  taskLists: taskListsReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;