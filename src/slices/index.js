import { configureStore } from '@reduxjs/toolkit';
import appStateReducer from './appStateSlice.js';

const reducer = {
  appState: appStateReducer,
}

const store = configureStore({
  reducer,
});

export default store;
