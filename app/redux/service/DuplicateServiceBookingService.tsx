import { api } from "../../util/API";
import { CHECK_SERVICE_BOOKING } from '../../util/URL';

export const duplicateServiceBookingService = api.injectEndpoints({
    endpoints: build => ({
        duplicateServiceBooking: build.mutation<any, any>({
            query: credentials => ({
                url: CHECK_SERVICE_BOOKING,
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
    overrideExisting: true,
});

export const {useDuplicateServiceBookingMutation } =
    duplicateServiceBookingService;
