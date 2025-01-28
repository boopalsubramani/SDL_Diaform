import { createSlice } from '@reduxjs/toolkit';
import { LoginService } from '../service/LoginService';

const initialState = {
    loginDetails: [],
};

export const LoginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            LoginService.endpoints.RefAppLogin.matchFulfilled,
            (state, { payload }) => {
                console.log("payload", payload)
                if (payload.Code === 200) {
                    console.log('APISUCCESS--------login--------------->', payload.Message);
                    state.loginDetails = payload.Message;
                }
            },
        );
    },
});

export const { } = LoginSlice.actions;

export default LoginSlice.reducer;
