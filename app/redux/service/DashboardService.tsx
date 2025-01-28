import { api } from "../../util/API";
import { DASHBOARD } from '../../util/URL';

export const dashboardService = api.injectEndpoints({
    endpoints: build => ({
        RefAppDashboard: build.mutation<any, any>({
            query: credentials => ({
                url: DASHBOARD,
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useRefAppDashboardMutation } =
dashboardService;
