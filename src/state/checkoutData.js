import { createSlice } from '@reduxjs/toolkit';

const checkoutDataSlice = createSlice({
  name: 'checkoutData',
  initialState: {
    checkoutItem: null,
    checkoutResponse: null,
  },
  reducers: {
    addCheckoutData: (state, action) => {
      state.checkoutItem = { ...action.payload };
    },
    clearCheckoutData: (state) => {
      state.checkoutItem = null;
    },
    setCheckoutResponse: (state, action) => {
      state.checkoutResponse = action.payload;
    },
    clearCheckoutResponse: (state) => {
      state.checkoutResponse = null;
    },
  },
});

export const { 
  addCheckoutData, 
  clearCheckoutData, 
  setCheckoutResponse, 
  clearCheckoutResponse 
} = checkoutDataSlice.actions;

export const checkoutData = (state) => state.checkoutData.checkoutItem;
export const selectCheckoutResponse = (state) => state.checkoutData.checkoutResponse;

export default checkoutDataSlice.reducer;
