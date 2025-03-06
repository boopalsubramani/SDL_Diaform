import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
// import {setTokenDetails} from '../redux/slice/OauthSlice';
import { BASE_URL } from '../util/URL';
import { RootState, store } from "../redux/Store";



const NetworkError = {
    error: {
        status: 408,
        statusText: 'Bad Request',
        data: {
            code: 408,
            status: 'Network Error',
            message: 'Please check your internet connectivity',
        },
    },
};

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
        // headers.set('Content-Type', 'application/json');
        headers.set('cache-control', 'no-cache');
        const token = (getState() as RootState).appSettings.tokenDetails;

        // if token is available, include the token to the headers
        // console.log(
        //   'ACCESS_TOKEN&&&&&&&&&&&&&>>>>>>>>>>>>>>>>>>>>',
        //   token?.access_token,
        // );
        if (token?.access_token) {
            headers.set('Authorization', `${token?.access_token}`);
        }
        console.log(headers,"headers.....................>>>")
        return headers;
    },
});

// API Logic
const baseQueryWithInterceptor: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    // check if network connection is available or not
    // const isNetworkavailable = store.getState().device.isNetworkAvailable;
    // if (!isNetworkavailable) {
    //   Utility.showSnackBar('Please check your internet connectivity');
    //   return NetworkError;
    // }
    let result = await baseQuery(args, api, extraOptions);
    // .log("API <----> Result", result);
    // console.log("(((((((((arg))))))))",args)

    if (result.error && result.error.status === 401) {
        // try to get a new token for unauthorised access
        const refresh_token = store.getState().appSettings.tokenDetails?.refresh_token;
        const refreshResult: any = await baseQuery(
            {
                url: REFRESH_TOKEN,
                method: 'POST',
                body: { refresh_token },
            },
            api,
            extraOptions,
        );
        console.log('refreshResult', refreshResult);
        if (refreshResult.data && refreshResult?.data?.code === 0) {
            // store the new token
            store.dispatch(setTokenDetails(refreshResult.data));
            // store.dispatch(samyakService(refreshResult.data));

            // retry the initial query
            result = await baseQuery(args, api, extraOptions);
        } else if (refreshResult.data && refreshResult?.data?.code === 2) {
            console.log('Refresh-Token-Invalid');
            // navigation.navigate('Signin');
            // store.dispatch(logout());
        }
    } else if (result.error && result.error.status === 401) {
        // Utility.showSnackBar(result.error.data?.message);
        // store.dispatch(logout());
    } else if (result.error && result.error.status === 400) {
        // Utility.showSnackBar(result.error.data?.message);
    } else if (result.error && result.error.status === 404) {
        // Utility.showSnackBar(result.error.data?.message);
    } else if (result.error && result.error.status === 500) {
        // Utility.showSnackBar(result.error.data?.message);
    } else if (result.error && result.error.status === 'FETCH_ERROR') {
        return NetworkError;
    }
    return result;
};

export const api = createApi({
    baseQuery: baseQueryWithInterceptor,
    endpoints: () => ({}),
});
