import { api } from "../../util/API";
import { BOOKING_DETAIL } from '../../util/URL';

export const bookingDetailService = api.injectEndpoints({
    endpoints: build => ({
        bookingDetail: build.mutation<any, any>({
            query: credentials => ({
                url: BOOKING_DETAIL,
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useBookingDetailMutation } =
bookingDetailService;
