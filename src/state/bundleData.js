import { createSlice } from '@reduxjs/toolkit';

const bundleDataSlice = createSlice({
  name: 'bundleData',
  initialState: {
    bundleItem: null,
    bundleResponse: null,
  },
  reducers: {
    addBundleData: (state, action) => {
      state.bundleItem = { ...action.payload };
    },
    clearBundleData: (state) => {
      state.bundleItem = null;
    },
    setBundleResponse: (state, action) => {
      state.bundleResponse = action.payload;
    },
    clearBundleResponse: (state) => {
      state.bundleResponse = null;
    },
  },
});

export const { addBundleData, clearBundleData, setBundleResponse, clearBundleResponse } = bundleDataSlice.actions;

export const bundleData = (state) => state.bundleData.bundleItem;
export const selectBundleResponse = (state) => state.bundleData.bundleResponse;

export default bundleDataSlice.reducer;
