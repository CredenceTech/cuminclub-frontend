import { createSlice } from '@reduxjs/toolkit';

const mealSlice = createSlice({
  name: 'mealData',
  initialState: {
    selectedItems: null,
  },
  reducers: {
    addMeal: (state, action) => {
      state.selectedItems = action.payload
    },
    clearMeal: state => {
      state.selectedItems = null;
    },
  },
});

export const { addMeal, clearMeal } = mealSlice.actions;

export const selectMealItems = state => state.mealData.selectedItems;

export default mealSlice.reducer;
