import { api } from "../../util/API";
import { RESET_PASSWORD } from '../../util/URL';

export const resetPasswordService = api.injectEndpoints({
    endpoints: build => ({
        resetPassword: build.mutation<any, any>({
            query: credentials => ({
                url: RESET_PASSWORD,
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useResetPasswordMutation } =
    resetPasswordService;

