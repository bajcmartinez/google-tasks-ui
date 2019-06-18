import { createStore } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from '../reducers';
import middleware from '../middleware';

export const initStore = (initialState?: Object) => createStore(reducers, initialState, composeWithDevTools(middleware));