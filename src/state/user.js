import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userId: null,
        customerAccessToken: null,
        userEmail: null
    },
    reducers: {
        addUserId: (state, action) => {
            state.userId = action.payload
        },
        addUserEmail: (state, action) => {
            state.userEmail = action.payload
        },
        addCustomerAccessToken: (state, action) => {
            state.customerAccessToken = action.payload
        },
        clearUserId: state => {
            state.userId = null;
        },
        clearCustomerAccessToken: state => {
            state.customerAccessToken = null;
            state.userEmail = null;
        }
    },
});

export const { addUserId, clearUserId, addCustomerAccessToken, clearCustomerAccessToken, addUserEmail } = userSlice.actions;

export const registerUserId = state => state.user.userId;
export const customerAccessTokenData = state => state.user.customerAccessToken;
export const userEmails = state => state.user.userEmail;

export default userSlice.reducer;
