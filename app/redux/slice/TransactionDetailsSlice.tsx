import { createSlice } from '@reduxjs/toolkit';
import { collectionDetailsService } from '../service/CollectionDetailsService';
import { transactionDetailsService } from '../service/TransactionDetailsService';

const initialState = {
    transactionDetails: [],
};

export const transactionDetailsSlice = createSlice({
    name: 'transactionDetails',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            transactionDetailsService.endpoints.transactionDetails.matchFulfilled,
            (state, { payload }) => {
                console.log("payload", payload)
                if (payload.Code === 200) {
                    console.log('APISUCCESS--------transactionDetails--------------->', payload.Message);
                    state.transactionDetails = payload.Message;
                }
            },
        );
    },
});

export const { } = transactionDetailsSlice.actions;

export default transactionDetailsSlice.reducer;
