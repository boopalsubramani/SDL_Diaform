import { createSlice } from '@reduxjs/toolkit';
import { AppSettingService } from '../service/AppSettingService';

const initialState = {
    AppSettingDetails: [],
};

export const AppSettingSlice = createSlice({
    name: 'appSettings',
    initialState,
    reducers: {
        
    },
    extraReducers: builder => {
        builder.addMatcher(
            AppSettingService.endpoints.RefAppSetting.matchFulfilled,
            (state, { payload }) => {
                console.log("payload",payload)
                if (payload.Code === 200) {

                    console.log('APISUCCESS----------appSettings------------->', payload.Message);
                    state.AppSettingDetails = payload.Message;
                }
            },
        );
    },
});

export const { } = AppSettingSlice.actions;

export default AppSettingSlice.reducer;
