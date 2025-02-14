import { FORGOT_PASSWORD } from '../../util/URL';
import { api } from '../../util/API';


interface ForgotPasswordResponse {
    Code: number;
    Message: {
        UserCode: string;
        UserType: string;
        Branch_Code: string;
        Names: string;
        Web_Pass: string;
        Email: string;
        Mobile: string;
    }[];
}


export const forgotPasswordService = api.injectEndpoints({
    endpoints: build => ({
        forgotPassword: build.mutation<ForgotPasswordResponse, { Username: string }>({
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
