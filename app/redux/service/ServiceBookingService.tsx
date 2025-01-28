import { api } from "../../util/API";
import { SERVICE_BOOKING } from '../../util/URL';

export const serviceBookingService = api.injectEndpoints({
    endpoints: build => ({
        serviceBooking: build.mutation<any, any>({
            query: credentials => ({
                url: SERVICE_BOOKING,
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useServiceBookingMutation } =
    serviceBookingService;
