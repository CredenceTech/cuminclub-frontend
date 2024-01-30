import { createSlice } from '@reduxjs/toolkit';

const mealSlice = createSlice({
  name: 'mealData',
  initialState: {
    selectedItems: {
      id: 2,
      noMeal: "10 Meals",
      price: "₹2110.12/meal",
      discountPrice: "₹2510.12/meal",
      no: 10
    },
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
