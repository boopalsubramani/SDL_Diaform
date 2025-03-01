import { createSlice } from '@reduxjs/toolkit';
import { paymentService } from '../service/PaymentService';

const initialState = {
    paymentDetails: [],
};

export const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            paymentService.endpoints.payment.matchFulfilled,
            (state, { payload }) => {
                console.log("payload", payload)
                if (payload.Code === 200) {
                    console.log('APISUCCESS--------payment--------------->', payload.Message);
                    state.paymentDetails = payload.Message;
                }
            },
        );
    },
});

export const { } = paymentSlice.actions;

export default paymentSlice.reducer;
