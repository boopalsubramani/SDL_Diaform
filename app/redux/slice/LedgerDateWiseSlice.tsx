import { createSlice } from '@reduxjs/toolkit';
import { ledgerDateWiseService } from '../service/LedgerDateWiseService';

const initialState = {
    ledgerDateWiseDetails: [],
};

export const ledgerDateWiseSlice = createSlice({
    name: 'ledgerDateWise',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            ledgerDateWiseService.endpoints.ledgerDateWise.matchFulfilled,
            (state, { payload }) => {
                console.log("payload", payload)
                if (payload.Code === 200) {
                    console.log('APISUCCESS--------ledgerDateWise--------------->', payload.Message);
                    state.ledgerDateWiseDetails = payload.Message;
                }
            },
        );
    },
});

export const { } = ledgerDateWiseSlice.actions;

export default ledgerDateWiseSlice.reducer;
