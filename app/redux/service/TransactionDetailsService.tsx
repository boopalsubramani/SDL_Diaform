import { api } from "../../util/API";
import { TRANSACTION_DETAILS } from '../../util/URL';

export const transactionDetailsService = api.injectEndpoints({
    endpoints: build => ({
        transactionDetails: build.mutation<any, any>({
            query: credentials => ({
                url: TRANSACTION_DETAILS,
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useTransactionDetailsMutation } =
    transactionDetailsService;
