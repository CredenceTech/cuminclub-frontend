import { createSlice } from '@reduxjs/toolkit';

const selectedCategorySlice = createSlice({
    name: 'selectedCategory',
    initialState: {
        categoryData: null,
    },
    reducers: {
        addCategoryData: (state, action) => {
            state.categoryData = action.payload
        },
        clearCatregoryData: state => {
            state.categoryData = null;
        },
    },
});

export const { addCategoryData, clearCatregoryData, } = selectedCategorySlice.actions;

export const categoryrData = state => state.selectedCategory.categoryData;


export default selectedCategorySlice.reducer;