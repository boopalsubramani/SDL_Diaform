import { api } from "../../util/API";
import { FETCH } from "../../util/URL";

export const FetchApiService = api.injectEndpoints({
  endpoints: build => ({
    FetchApi: build.mutation<any, any>({
      query: credentials => ({
        url: FETCH,
        method: 'POST',
        body: credentials,
        headers:credentials,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useFetchApiMutation } =
  FetchApiService;