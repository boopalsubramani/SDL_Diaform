import { createSlice } from '@reduxjs/toolkit';
import { serviceBookingService } from '../service/ServiceBookingService';

const initialState = {
    serviceBookingDetails: [],
};

export const serviceBookingSlice = createSlice({
    name: 'serviceBooking',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            serviceBookingService.endpoints.serviceBooking.matchFulfilled,
            (state, { payload }) => {
                console.log("payload", payload)
                if (payload.Code === 200) {
                    console.log('APISUCCESS------------serviceBooking----------->', payload.Message);
                    state.serviceBookingDetails = payload.Message;
                }
            },
        );
    },
});

export const { } = serviceBookingSlice.actions;

export default serviceBookingSlice.reducer;
