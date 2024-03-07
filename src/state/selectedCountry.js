import { createSlice } from '@reduxjs/toolkit';

const selectedCountrySlice = createSlice({
    name: 'selectedCountry',
    initialState: {
        filterData: null,
        innerFilterData :null
    },
    reducers: {
        addFilterData: (state, action) => {
            state.filterData = action.payload
        },

        addInnerFilterData: (state, action) => {
            state.innerFilterData = action.payload
        },

        clearFilterData: state => {
            state.filterData = null;
        },

    },
});

export const { addFilterData, clearFilterData, addInnerFilterData } = selectedCountrySlice.actions;

export const filterData = state => state.selectedCountry.filterData;
export const innerFilterData = state => state.selectedCountry.innerFilterData;


export default selectedCountrySlice.reducer;