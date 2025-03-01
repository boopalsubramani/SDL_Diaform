import { api } from "../../util/API";
import { COLLECTION_DETAILS } from '../../util/URL';

export const collectionDetailsService = api.injectEndpoints({
    endpoints: build => ({
        collectionDetails: build.mutation<any, any>({
            query: credentials => ({
                url: COLLECTION_DETAILS,
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useCollectionDetailsMutation} =
    collectionDetailsService;
