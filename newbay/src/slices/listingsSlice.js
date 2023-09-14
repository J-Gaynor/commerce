import { createSlice } from "@reduxjs/toolkit";

const listingsSlice = createSlice({
    name: 'listings',
    initialState: {
        data: [],
        loading: false,
        error: null,
    },
    reducers: {
        fetchListingsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchListingsSuccess: (state, action) => {
            state.data = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchListingsFailure: (state, action) => {
            state.data = [];
            state.loading = false;
            state.error = action.payload;
        },
        addListing: (state, action) => {
            state.data.push(action.payload);
        },
        removeListing: (state, action) => {
            const listingId = action.payload;
            state.data = state.data.filter(listing => listing.id !== listingId);
        },
    },
});

export const {
    fetchListingsRequest,
    fetchListingsSuccess,
    fetchListingsFailure,
    addListing,
    removeListing,
} = listingsSlice.actions;

export default listingsSlice.reducer;