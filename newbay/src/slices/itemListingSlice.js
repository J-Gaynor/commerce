import { createSlice } from "@reduxjs/toolkit";

const itemListingSlice = createSlice({
    name: 'item',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {
        fetchListingRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchListingSuccess: (state, action) => {
            state.data = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchListingFailure: (state, action) => {
            state.data = [];
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchListingRequest,
    fetchListingSuccess,
    fetchListingFailure,
} = itemListingSlice.actions;

export default itemListingSlice.reducer;