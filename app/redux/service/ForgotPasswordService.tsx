import { FORGOT_PASSWORD } from '../../util/URL';
import { api } from '../../util/API';

export const forgotPasswordService = api.injectEndpoints({
    endpoints: build => ({
        forgotPassword: build.mutation<any, any>({
            query: credentials => ({
                url: FORGOT_PASSWORD,
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useForgotPasswordMutation } = forgotPasswordService;
