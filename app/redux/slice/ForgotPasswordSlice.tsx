// import { createSlice } from '@reduxjs/toolkit';
// import { forgotPasswordService } from '../service/ForgotPasswordService';

// const initialState = {
//     forgotPasswordDetails: [],
// };

// export const forgotPasswordSlice = createSlice({
//     name: 'forgotPassword',
//     initialState,
//     reducers: {},
//     extraReducers: builder => {
//         builder.addMatcher(
//             forgotPasswordService.endpoints.forgotPassword.matchFulfilled,
//             (state, { payload }) => {
//                 console.log("payload", payload)
//                 if (payload.Code === 200) {
//                     console.log('APISUCCESS--------forgotPassword--------------->', payload.Message);
//                     state.forgotPasswordDetails = payload.Message;
//                 }
//             },
//         );
//     },
// });

// export const { } = forgotPasswordSlice.actions;

// export default forgotPasswordSlice.reducer;



import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { forgotPasswordService } from '../service/ForgotPasswordService';

// Define the type for the objects in the array
interface ForgotPasswordDetail {
    UserCode: string;
    UserType: string;
    Branch_Code: string;
    Names: string;
    Web_Pass: string;
    Email: string;
    Mobile: string;
}

// Define the initial state with a type for the array
const initialState = {
    forgotPasswordDetails: [] as ForgotPasswordDetail[],
};

export const forgotPasswordSlice = createSlice({
    name: 'forgotPassword',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            forgotPasswordService.endpoints.forgotPassword.matchFulfilled,
            (state, { payload }) => {
                console.log("payload", payload);
                if (payload.Code === 200) {
                    console.log('APISUCCESS--------forgotPassword--------------->', payload.Message);
                    state.forgotPasswordDetails = payload.Message;
                }
            },
        );
    },
});

export const {} = forgotPasswordSlice.actions;

export default forgotPasswordSlice.reducer;
