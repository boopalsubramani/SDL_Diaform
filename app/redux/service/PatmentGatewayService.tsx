import { api } from "../../util/API";
import { PAYMENT_GATEWAY } from '../../util/URL';

export const paymentGatewayService = api.injectEndpoints({
    endpoints: build => ({
        paymentGateway: build.mutation<any, any>({
            query: credentials => ({
                url: PAYMENT_GATEWAY,
                method: 'POST',
                body: credentials,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },

            }),
        }),
    }),
    overrideExisting: true,
});

export const { usePaymentGatewayMutation } =
    paymentGatewayService;
