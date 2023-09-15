import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
    name: 'login',
    initialState: {
        user: false,
        loading: false,
        error: false,
    },
    reducers: {
        loginRequest: (state) => {
            state.loading = true;
            state.error = null
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.error = null;
            state.user = action.payload;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.user = null
        },
    },
});

export const {
    loginRequest,
    loginSuccess,
    loginFailure
} = loginSlice.actions;

export default loginSlice.reducer;