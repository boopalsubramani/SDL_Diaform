import { RESET_PASSWORD } from '../../util/URL';
import { api } from '../../util/API';


interface ResetPasswordResponse {
    Code: number;
    Message: {
        Message: string;
        scode: string;
    }[];
}

export const resetPasswordService = api.injectEndpoints({
    endpoints: build => ({
        resetPassword: build.mutation<ResetPasswordResponse, any>({
            query: credentials => ({
                url: RESET_PASSWORD,
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useResetPasswordMutation } = resetPasswordService;
