import { createSlice } from '@reduxjs/toolkit';
import { bookTestSearchService } from '../service/BookTestSearchService';

const initialState = {
    bookTestSearchDetails: [],
    updatedCartData: [],
};

export const bookTestSearchSlice = createSlice({
    name: 'bookTestSearch',
    initialState,
    reducers: {
        updateSelectedTest: (state, action) => {
            state.updatedCartData = action.payload;
        }
    },
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

export const { updateSelectedTest } = bookTestSearchSlice.actions;

export default bookTestSearchSlice.reducer;
