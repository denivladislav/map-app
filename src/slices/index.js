import { configureStore } from '@reduxjs/toolkit';
import appStateReducer from './appStateSlice.js';
import featuresReducer from './featuresSlice.js';

const reducer = {
  appState: appStateReducer,
  features: featuresReducer,
}

const store = configureStore({
  reducer,
});

export default store;
