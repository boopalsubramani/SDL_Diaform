import { createSlice } from '@reduxjs/toolkit';
import { duplicateServiceBookingService } from '../service/DuplicateServiceBookingService';

const initialState = {
    duplicateServiceBookingDetails: [],
};

export const duplicateServiceBookingSlice = createSlice({
    name: 'duplicateServiceBooking',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            duplicateServiceBookingService.endpoints.duplicateServiceBooking.matchFulfilled,
            (state, { payload }) => {
                console.log("payload", payload)
                if (payload.Code === 200) {
                    console.log('APISUCCESS--------duplicateServiceBooking--------------->', payload.Message);
                    state.duplicateServiceBookingDetails = payload.Message;
                }
            },
        );
    },
});

export const { } = duplicateServiceBookingSlice.actions;

export default duplicateServiceBookingSlice.reducer;
