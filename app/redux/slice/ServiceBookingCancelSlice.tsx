import { createSlice } from '@reduxjs/toolkit';
import { serviceBookingCancelService } from '../service/ServiceBookingCancelService';

const initialState = {
    serviceBookingCancelDetails: [],
};

export const serviceBookingCancelSlice = createSlice({
    name: 'serviceBookingCancel',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            serviceBookingCancelService.endpoints.serviceBookingCancel.matchFulfilled,
            (state, { payload }) => {
                console.log("payload", payload)
                if (payload.Code === 200) {
                    console.log('APISUCCESS------------serviceBookingCancel----------->', payload.Message);
                    state.serviceBookingCancelDetails = payload.Message;
                }
            },
        );
    },
});

export const { } = serviceBookingCancelSlice.actions;

export default serviceBookingCancelSlice.reducer;
