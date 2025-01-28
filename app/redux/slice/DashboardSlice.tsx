import { createSlice } from '@reduxjs/toolkit';
import { dashboardService } from '../service/DashboardService';

const initialState = {
    dashboardDetails: [],
};

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addMatcher(
            dashboardService.endpoints.RefAppDashboard.matchFulfilled,
            (state, { payload }) => {
                console.log("payload", payload)
                if (payload.Code === 200) {
                    console.log('APISUCCESS--------dashboard--------------->', payload.Message);
                    state.dashboardDetails = payload.Message;
                }
            },
        );
    },
});

export const { } = dashboardSlice.actions;

export default dashboardSlice.reducer;
