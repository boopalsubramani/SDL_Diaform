import { createSlice } from '@reduxjs/toolkit';
import { forgotPasswordService } from '../service/ForgotPasswordService';

const initialState = {
    forgotPasswordDetails: [],
};

export const forgotPasswordSlice = createSlice({
    name: 'forgotPassword',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            forgotPasswordService.endpoints.forgotPassword.matchFulfilled,
            (state, { payload }) => {
                console.log("payload", payload)
                if (payload.Code === 200) {
                    console.log('APISUCCESS--------forgotPassword--------------->', payload.Message);
                    state.forgotPasswordDetails = payload.Message;
                }
            },
        );
    },
});

export const { } = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;
