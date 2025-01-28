import { createSlice } from '@reduxjs/toolkit';
import { FetchApiService } from '../service/FetchApiService';

const initialState = {
    FetchDataDetails: [],
};

export const FetchApiSlice = createSlice({
    name: 'fetchapi',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            FetchApiService.endpoints.FetchApi.matchFulfilled,
            (state, { payload }) => {
                if (payload.Code === 200) {
                    console.log('APISUCCESS-------fetchapi---------------->', payload);
                    state.FetchDataDetails = payload;
                }
            },
        );
    },
});

export const { } = FetchApiSlice.actions;

export default FetchApiSlice.reducer;
