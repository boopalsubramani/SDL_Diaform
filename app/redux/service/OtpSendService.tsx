import { OTP_SEND } from '../../util/URL';
import { api } from '../../util/API';


interface OtpSendResponse {
    Code: number;
    Message: {
        Otp_Message: string;
        Valid_Time: string;
        Success: string;
        OTP_Code: string;
        Send_Type: string;
    }[];
}

export const otpSendService = api.injectEndpoints({
    endpoints: build => ({
        otpSend: build.mutation<OtpSendResponse, any>({
            query: credentials => ({
                url: OTP_SEND,
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
    overrideExisting: true,
});

export const { useOtpSendMutation } = otpSendService;
