import { api } from "../../util/API";
import { LEDGER_MONTH_WISE } from '../../util/URL';

export const ledgerMonthWiseService = api.injectEndpoints({
    endpoints: build => ({
        ledgerMonthWise: build.mutation<any, any>({
            query: credentials => ({
                url: LEDGER_MONTH_WISE,
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useLedgerMonthWiseMutation } =
    ledgerMonthWiseService;
