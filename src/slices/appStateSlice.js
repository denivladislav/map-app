import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appState: 'surfing',
};

const appStateSlice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    setAppState: (state, { payload }) => {
      state.appState = payload;
    }
  }
})

export const { setAppState } = appStateSlice.actions;

export default appStateSlice.reducer;
