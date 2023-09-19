import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
    name: 'login',
    initialState: {
        user: null,
        loading: false,
        error: false,
    },
    reducers: {
        loginRequest: (state) => {
            state.loading = true;
            state.error = false;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.error = false;
            state.user = action.payload;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.user = null;
        },
        logoutUser: (state) => {
            state.user = null;
        },
    },
});

export const {
    loginRequest,
    loginSuccess,
    loginFailure,
    logoutUser,
} = loginSlice.actions;

export default loginSlice.reducer;