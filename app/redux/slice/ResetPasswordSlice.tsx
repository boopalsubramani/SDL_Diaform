import { createSlice } from '@reduxjs/toolkit';
import { resetPasswordService } from '../service/ResetPasswordService';

const initialState = {
    resetPasswordDetails: [],
};

export const resetPasswordSlice = createSlice({
    name: 'resetPassword',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            resetPasswordService.endpoints.resetPassword.matchFulfilled,
            (state, { payload }) => {
                console.log("payload", payload)
                if (payload.Code === 200) {
                    console.log('APISUCCESS--------resetPassword--------------->', payload.Message);
                    state.resetPasswordDetails = payload.Message;
                }
            },
        );
    },
});

export const { } = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;

