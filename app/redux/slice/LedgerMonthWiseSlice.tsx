import { createSlice } from '@reduxjs/toolkit';
import { ledgerMonthWiseService } from '../service/LedgerMonthWiseService';

const initialState = {
    ledgerMonthWiseDetails: [],
};

export const ledgerMonthWiseSlice = createSlice({
    name: 'ledgerMonthWise',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            ledgerMonthWiseService.endpoints.ledgerMonthWise.matchFulfilled,
            (state, { payload }) => {
                console.log("payload", payload)
                if (payload.Code === 200) {
                    console.log('APISUCCESS--------ledgerMonthWise--------------->', payload.Message);
                    state.ledgerMonthWiseDetails = payload.Message;
                }
            },
        );
    },
});

export const { } = ledgerMonthWiseSlice.actions;

export default ledgerMonthWiseSlice.reducer;
