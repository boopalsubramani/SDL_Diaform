import { createSlice } from '@reduxjs/toolkit';
import { bookingListService } from '../service/BookingListService';

const initialState = {
    bookingListDetails: [],
};

export const bookingListSlice = createSlice({
    name: 'bookingList',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            bookingListService.endpoints.bookingList.matchFulfilled,
            (state, { payload }) => {
                console.log("payload", payload)
                if (payload.Code === 200) {
                    console.log('APISUCCESS--------bookingList--------------->', payload.Message);
                    state.bookingListDetails = payload.Message;
                }
            },
        );
    },
});

export const { } = bookingListSlice.actions;

export default bookingListSlice.reducer;
