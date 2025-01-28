import { createSlice } from '@reduxjs/toolkit';
import { bookingDetailService } from '../service/BookingDetailService';

const initialState = {
    bookingDetail: [],
};

export const bookingDetailSlice = createSlice({
    name: 'bookingDetail',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            bookingDetailService.endpoints.bookingDetail.matchFulfilled,
            (state, { payload }) => {
                console.log("payload", payload)
                if (payload.Code === 200) {
                    console.log('APISUCCESS-------bookingDetail---------------->', payload.Message);
                    state.bookingDetail = payload.Message;
                }
            },
        );
    },
});

export const { } = bookingDetailSlice.actions;

export default bookingDetailSlice.reducer;
