import { createSlice } from '@reduxjs/toolkit';

const cartDataSlice = createSlice({
  name: 'cartData',
  initialState: {
    cartItem: null,
  },
  reducers: {
    addCartData: (state, action) => {
        state.cartItem = { ...action.payload };
      },
    clearCartData: state => {
        state.cartItem = null;
      },
  },
});

export const { addCartData, clearCartData } = cartDataSlice.actions;

export const cartData = state => state.cartData.cartItem;

export default cartDataSlice.reducer;
