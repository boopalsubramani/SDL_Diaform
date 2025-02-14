// import { createSlice } from '@reduxjs/toolkit';
// import { resetPasswordService } from '../service/ResetPasswordService';

// const initialState = {
//     resetPasswordDetails: [],
// };

// export const resetPasswordSlice = createSlice({
//     name: 'resetPassword',
//     initialState,
//     reducers: {},
//     extraReducers: builder => {
//         builder.addMatcher(
//             resetPasswordService.endpoints.resetPassword.matchFulfilled,
//             (state, { payload }) => {
//                 console.log("payload", payload)
//                 if (payload.Code === 200) {
//                     console.log('APISUCCESS--------resetPassword--------------->', payload.Message);
//                     state.resetPasswordDetails = payload.Message;
//                 }
//             },
//         );
//     },
// });

// export const { } = resetPasswordSlice.actions;

// export default resetPasswordSlice.reducer;



import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { resetPasswordService } from '../service/ResetPasswordService';

// Define the type for the objects in the array
interface ResetPasswordDetail {
    Message: string;
    scode: string;
}

// Define the initial state with a type for the array
const initialState = {
    resetPasswordDetails: [] as ResetPasswordDetail[],
};

export const resetPasswordSlice = createSlice({
    name: 'resetPassword',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            resetPasswordService.endpoints.resetPassword.matchFulfilled,
            (state, { payload }) => {
                console.log("payload", payload);
                if (payload.Code === 200) {
                    console.log('APISUCCESS--------resetPassword--------------->', payload.Message);
                    state.resetPasswordDetails = payload.Message;
                }
            },
        );
    },
});

export const {} = resetPasswordSlice.actions;

export default resetPasswordSlice.reducer;

