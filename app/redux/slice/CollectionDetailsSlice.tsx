import { createSlice } from '@reduxjs/toolkit';
import { collectionDetailsService } from '../service/CollectionDetailsService';

const initialState = {
    collectionDetails: [],
};

export const collectionDetailsSlice = createSlice({
    name: 'collectionDetails',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            collectionDetailsService.endpoints.collectionDetails.matchFulfilled,
            (state, { payload }) => {
                console.log("payload", payload)
                if (payload.Code === 200) {
                    console.log('APISUCCESS--------collectionDetails--------------->', payload.Message);
                    state.collectionDetails = payload.Message;
                }
            },
        );
    },
});

export const { } = collectionDetailsSlice.actions;

export default collectionDetailsSlice.reducer;
