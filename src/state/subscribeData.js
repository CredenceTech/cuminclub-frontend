import { createSlice } from '@reduxjs/toolkit';

const subscribeSlice = createSlice({
    name: 'subscribe',
    initialState: {
        isSubscribe: false,
    },
    reducers: {
        subscribeOpen: (state) => {
            state.isSubscribe = true;
        },
        subscribeClose: (state) => {
            state.isSubscribe = false;
        },
        toggleSubscribe: (state) => {
            state.isSubscribe = !state.isSubscribe;
        },
    },
});

export const { subscribeOpen, subscribeClose, toggleSubscribe } = subscribeSlice.actions;
export const isSubscribe = state => state.subscribe.isSubscribe;
export default subscribeSlice.reducer;
