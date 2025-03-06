import { api } from "../../util/API";
import { SERVICE_BOOKING } from '../../util/URL';

export const serviceBookingService = api.injectEndpoints({
    endpoints: build => ({
        serviceBooking: build.mutation<any, FormData>({
            query: (formData) => ({
                url: SERVICE_BOOKING,
                method: 'POST',
                body: formData,
                formData: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useServiceBookingMutation } = serviceBookingService;
