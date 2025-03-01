import { api } from "../../util/API";
import { PAYMENT } from '../../util/URL';

export const paymentService = api.injectEndpoints({
    endpoints: build => ({
        payment: build.mutation<any, any>({
            query: credentials => ({
                url: PAYMENT,
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
    overrideExisting: true,
});

export const { usePaymentMutation } =
    paymentService;
