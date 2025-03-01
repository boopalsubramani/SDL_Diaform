import { api } from "../../util/API";
import { LEDGER_DATE_WISE } from '../../util/URL';

export const ledgerDateWiseService = api.injectEndpoints({
    endpoints: build => ({
        ledgerDateWise: build.mutation<any, any>({
            query: credentials => ({
                url: LEDGER_DATE_WISE,
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useLedgerDateWiseMutation } =
    ledgerDateWiseService;
