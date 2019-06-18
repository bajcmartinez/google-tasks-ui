import { combineReducers } from 'redux';

const rootReducer = combineReducers({

});

export type AppState = ReturnType<typeof rootReducer>;

export default rootReducer;