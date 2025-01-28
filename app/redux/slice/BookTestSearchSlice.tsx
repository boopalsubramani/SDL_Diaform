import { createSlice } from '@reduxjs/toolkit';
import { bookTestSearchService } from '../service/BookTestSearchService';

const initialState = {
    bookTestSearchDetails: [],
};

export const bookTestSearchSlice = createSlice({
    name: 'bookTestSearch',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            bookTestSearchService.endpoints.bookTestSearch.matchFulfilled,
            (state, { payload }) => {
                console.log("payload", payload)
                if (payload.Code === 200) {
                    console.log('APISUCCESS---------bookTestSearch-------------->', payload.Message);
                    state.bookTestSearchDetails = payload.Message;
                }
            },
        );
    },
});

export const { } = bookTestSearchSlice.actions;

export default bookTestSearchSlice.reducer;
