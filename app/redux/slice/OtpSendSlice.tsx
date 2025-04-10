import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { otpSendService } from '../service/OtpSendService';

// Define the type for the objects in the array
interface OtpSendDetail {
    Otp_Message: string;
    Valid_Time: string;
    Success: string;
    OTP_Code: string;
    Send_Type: string;
}

// Define the initial state with a type for the array
const initialState = {
    otpSendDetails: [] as OtpSendDetail[],
};

export const otpSendSlice = createSlice({
    name: 'otpSend',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            otpSendService.endpoints.otpSend.matchFulfilled,
            (state, { payload }) => {
                console.log("payload", payload);
                if (payload.Code === 200) {
                    console.log('APISUCCESS--------otpSend--------------->', payload.Message);
                    state.otpSendDetails = payload.Message;
                }
            },
        );
    },
});

export const {} = otpSendSlice.actions;

export default otpSendSlice.reducer;

