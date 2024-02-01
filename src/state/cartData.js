import { createSlice } from '@reduxjs/toolkit';

const cartDataSlice = createSlice({
  name: 'cartData',
  initialState: {
    cartItem: null,
    cartResponse: null
  },
  reducers: {
    addCartData: (state, action) => {
        state.cartItem = { ...action.payload };
      },
    clearCartData: state => {
        state.cartItem = null;
      },
    setCartResponse: (state, action) => {
        state.cartResponse = action.payload;
      },  
  },
});

export const { addCartData, clearCartData, setCartResponse } = cartDataSlice.actions;

export const cartData = state => state.cartData.cartItem;
export const selectCartResponse = (state) => state.cartData.cartResponse;

export default cartDataSlice.reducer;
