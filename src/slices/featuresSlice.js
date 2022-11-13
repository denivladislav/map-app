import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  features: [],
};

const featuresSlice = createSlice({
  name: 'features',
  initialState,
  reducers: {
    addFeature: (state, { payload }) => {
      state.features = [...state.features, payload];
    },
  }
})

export const { addFeature } = featuresSlice.actions;

export default featuresSlice.reducer;
