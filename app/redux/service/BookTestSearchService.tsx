import { api } from "../../util/API";
import { BOOK_TEST_PACKAGE } from '../../util/URL';

export const bookTestSearchService = api.injectEndpoints({
    endpoints: build => ({
        bookTestSearch: build.mutation<any, any>({
            query: credentials => ({
                url: BOOK_TEST_PACKAGE,
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useBookTestSearchMutation } =
    bookTestSearchService;
