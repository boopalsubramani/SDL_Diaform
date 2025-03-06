import { createSlice } from '@reduxjs/toolkit';
import { paymentGatewayService } from '../service/PatmentGatewayService';

const initialState = {
    paymentGatewayDetails: [],
};

export const paymentGatewaySlice = createSlice({
    name: 'paymentGateway',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            paymentGatewayService.endpoints.paymentGateway.matchFulfilled,
            (state, { payload }) => {
                console.log("payload", payload)
                if (payload.Code === 200) {
                    console.log('APISUCCESS--------paymentGateway--------------->', payload.Message);
                    state.paymentGatewayDetails = payload.Message;
                }
            },
        );
    },
});

export const { } = paymentGatewaySlice.actions;

export default paymentGatewaySlice.reducer;
