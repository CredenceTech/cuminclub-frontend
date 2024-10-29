import { createSlice } from '@reduxjs/toolkit';

const draftOrderSlice = createSlice({
  name: 'draftOrder',
  initialState: {
    draftOrderItem: null,
    draftOrderResponse: null
  },
  reducers: {
    addDraftOrderData: (state, action) => {
        console.log(state)
        console.log(action.payload);
      state.draftOrderItem = { ...action.payload };
    },
    clearDraftOrderData: (state) => {
      state.draftOrderItem = null;
    },
    setDraftOrderResponse: (state, action) => {
      state.draftOrderResponse = action.payload;
    },
    clearDraftOrderResponse: (state) => {
      state.draftOrderResponse = null;
    }
  },
});

export const { addDraftOrderData, clearDraftOrderData, setDraftOrderResponse, clearDraftOrderResponse } = draftOrderSlice.actions;

export const draftOrderData = (state) => state?.draftOrder?.draftOrderItem;
export const selectDraftOrderResponse = (state) => state?.draftOrder?.draftOrderResponse;

export default draftOrderSlice.reducer;
