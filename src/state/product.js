// cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const productSlice = createSlice({
  name: 'product',
  initialState: {
    items: [],
    count: 0,
  },
  reducers: {
    addProduct: (state, action) => {
      const { merchandiseId, quantity } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.merchandiseId === merchandiseId
      );

      if (existingItemIndex !== -1) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        state.items.push({ merchandiseId, quantity });
      }

      state.count += quantity;
    },
    removeProduct: (state, action) => {
      const merchandiseId = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.merchandiseId === merchandiseId
      );

      if (existingItemIndex !== -1) {
        const currentQuantity = state.items[existingItemIndex].quantity;
        state.items[existingItemIndex].quantity = Math.max(0, currentQuantity - 1);
        state.count = Math.max(0, state.count - 1);

        if (state.items[existingItemIndex].quantity === 0) {
          state.items.splice(existingItemIndex, 1);
        }
      }
    },
    clearProduct: (state) => {
      state.items = [];
      state.count = 0;
    },
  },
});

export const { addProduct, clearProduct, removeProduct } = productSlice.actions;

export default productSlice.reducer;
