import { api } from "../../util/API";
import { INVOICE_DOWNLOAD } from '../../util/URL';

export const invoiceDownloadService = api.injectEndpoints({
    endpoints: build => ({
        invoiceDownload: build.mutation<any, any>({
            query: credentials => ({
                url: INVOICE_DOWNLOAD,
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useInvoiceDownloadMutation } =
    invoiceDownloadService;
