import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './slices/auth.js';
import linkReducer from './slices/links.js';
import analyticsReducer from './slices/analytics.js';

const rootReducer = combineReducers({
  auth: authReducer,
  links: linkReducer,
  analytics: analyticsReducer
});

export const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);
