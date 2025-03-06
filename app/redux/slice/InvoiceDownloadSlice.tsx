import { createSlice } from '@reduxjs/toolkit';
import { invoiceDownloadService } from '../service/InvoiceDownloadService';

const initialState = {
    invoiceDownloadDetails: [],
};

export const invoiceDownloadSlice = createSlice({
    name: 'invoiceDownload',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            invoiceDownloadService.endpoints.invoiceDownload.matchFulfilled,
            (state, { payload }) => {
                console.log("payload", payload)
                if (payload.Code === 200) {
                    console.log('APISUCCESS--------invoiceDownload--------------->', payload.Message);
                    state.invoiceDownloadDetails = payload.Message;
                }
            },
        );
    },
});

export const { } = invoiceDownloadSlice.actions;

export default invoiceDownloadSlice.reducer;
