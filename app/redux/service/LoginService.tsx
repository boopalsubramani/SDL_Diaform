import { api } from "../../util/API";
import { LOGIN } from '../../util/URL';

export const LoginService = api.injectEndpoints({
    endpoints: build => ({
        RefAppLogin: build.mutation<any, any>({
            query: credentials => ({
                url: LOGIN,
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useRefAppLoginMutation } =
    LoginService;
