import { api } from "../../util/API";
import { ORDER_BOOKING_LIST } from '../../util/URL';

export const bookingListService = api.injectEndpoints({
    endpoints: build => ({
        bookingList: build.mutation<any, any>({
            query: credentials => ({
                url: ORDER_BOOKING_LIST,
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
    overrideExisting: true,
});

export const {useBookingListMutation } =
    bookingListService;
