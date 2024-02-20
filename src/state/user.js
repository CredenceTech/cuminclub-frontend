import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userId: null,
        customerAccessToken: null
    },
    reducers: {
        addUserId: (state, action) => {
            state.userId = action.payload
        },
        addCustomerAccessToken: (state, action) => {
            state.customerAccessToken = action.payload
        },
        clearUserId: state => {
            state.userId = null;
        },
        clearCustomerAccessToken: state => {
            state.customerAccessToken = null
        }
    },
});

export const { addUserId, clearUserId, addCustomerAccessToken, clearCustomerAccessToken } = userSlice.actions;

export const registerUserId = state => state.user.userId;
export const customerAccessTokenData = state => state.user.customerAccessToken;

export default userSlice.reducer;
