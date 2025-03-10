import { api } from "../../util/API";
import { SERVICE_BOOKING_CANCEL } from '../../util/URL';

export const serviceBookingCancelService = api.injectEndpoints({
    endpoints: build => ({
        serviceBookingCancel: build.mutation<any, any>({
            query: credentials => ({
                url: SERVICE_BOOKING_CANCEL,
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useServiceBookingCancelMutation } =
    serviceBookingCancelService;
