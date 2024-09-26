import { createSlice } from '@reduxjs/toolkit';

const mealSlice = createSlice({
  name: 'mealData',
  initialState: {
    selectedItems: {
      id: 2,
      noMeal: "12 Meals",
      price: "1020",
      discountPrice: "2510.12/meal",
      no: 12,
      subscriptionType: [
        {
          id: 1,
          type: "oneTime",
          noMeal: "One Time",
          price: "2110.12/meal",
          discountPrice: "2510.12/meal",
        },
        {
          id: 2,
          type: "subscription",
          noMeal: "Subscription",
          price: "2110.12/meal",
          discountPrice: "2000.12/meal",
        }
      ]
    }
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
