import { combineReducers } from 'redux';
import { taskListsReducer } from './taskLists'
import { tasksReducer } from './tasks'

const rootReducer = combineReducers({
  taskLists: taskListsReducer,
  tasks: tasksReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;