import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Image,
    TouchableOpacity,
    ToastAndroid,
    Dimensions,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    I18nManager,
    ActivityIndicator,
} from 'react-native';
import Constants from '../util/Constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppSettings } from '../common/AppSettingContext';
import { useForgotPasswordMutation } from '../redux/service/ForgotPasswordService';
import { useOtpSendMutation } from '../redux/service/OtpSendService';
import { useResetPasswordMutation } from '../redux/service/ResetPasswordService';
import { useUser } from '../common/UserContext';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { Alert } from 'react-native';

const deviceHeight = Dimensions.get('window').height;

interface Language {
    Alignment: 'ltr' | 'rtl';
}

const ForgetPasswordScreen = ({ navigation }: any) => {
    const [userName, setUserName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [receivedOtp, setReceivedOtp] = useState('');
    const [isUsernameValidated, setIsUsernameValidated] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpValidated, setIsOtpValidated] = useState(false);
    const [isResendOtpVisible, setIsResendOtpVisible] = useState(false);
    const [sendOtpTo, setSendOtpTo] = useState<'mobile' | 'email'>('mobile');

    const { userData, setUserData } = useUser();
    const { settings, labels } = useAppSettings();
    const selectedLanguage = useSelector((state: RootState) => state.appSettings.selectedLanguage) as Language | null;

    const [forgotPasswordAPIReq] = useForgotPasswordMutation();
    const [otpSendAPIReq] = useOtpSendMutation();
    const [resetPasswordAPIReq] = useResetPasswordMutation();

    useEffect(() => {
        I18nManager.forceRTL(selectedLanguage?.Alignment === 'rtl');
    }, [selectedLanguage]);

    const getLabel = (key: string): string => labels[key]?.defaultMessage || '';

    const handleInputChange =
        (setState: React.Dispatch<React.SetStateAction<string>>) => (text: string) => {
            setState(text);
        };

    const handleValidateUser = async () => {
        if (!userName.trim()) {
            Alert.alert('Error', 'Username cannot be empty');
            return;
        }
        try {
            const response = await forgotPasswordAPIReq({ Username: userName.trim() }).unwrap();
            if (response.Code === 200) {
                setUserData(response.Message[0]);
                setIsUsernameValidated(true);
                Alert.alert('Success', 'User validated successfully');
            } else {
                Alert.alert('Error', 'User validation failed');
            }
        } catch (error) {
            Alert.alert('Error', 'User validation failed');
        }
    };

    const handleSendOTP = async (isResend = false) => {
        if (!userData) {
            Alert.alert('Error', 'Please validate the user first');
            return;
        }

        try {
            const response = await otpSendAPIReq({
                UserCode: userData.UserCode,
                UserType: userData.UserType,
                Send_Type: sendOtpTo === 'mobile' ? 'M' : 'E',
                Mobile_No: sendOtpTo === 'mobile' ? mobileNumber : '',
                Email_Id: sendOtpTo === 'email' ? email : '',
            }).unwrap();

            if (response.Code === 200 && response.Message && response.Message.length > 0) {
                const otpData = response.Message[0];
                setReceivedOtp(otpData.OTP_Code);
                setIsOtpSent(true);
                setIsResendOtpVisible(false);
                Alert.alert('OTP Sent', otpData.Otp_Message || (isResend ? 'OTP Resent successfully' : 'OTP sent successfully'));

                const [datePart, timePart] = otpData.Valid_Time.split(' ');
                const [year, month, day] = datePart.split('/').map(Number);
                const [hours, minutes] = timePart.split(':').map(Number);
                const validTime = new Date(year, month - 1, day, hours, minutes);
                const timeDifference = validTime.getTime() - new Date().getTime();

                if (!isNaN(timeDifference) && timeDifference > 0) {
                    setTimeout(() => {
                        setIsResendOtpVisible(true);
                    }, timeDifference);
                }
            } else {
                Alert.alert('Error', `Failed to ${isResend ? 'resend' : 'send'} OTP. Please try again.`);
            }
        } catch (error) {
            Alert.alert('Error', `Something went wrong. Please try again.`);
        }
    };

    const handleValidateOTP = () => {
        if (!otp.trim()) {
            Alert.alert('Error', 'Please enter the OTP');
            return;
        }
        if (otp.trim() === receivedOtp.trim()) {
            Alert.alert('Success', 'OTP verified successfully');
            setTimeout(() => {
                setIsOtpValidated(true);
            }, 1000);
        } else {
            Alert.alert('Error', 'Invalid OTP');
        }
    };

    const handleResetPassword = async () => {
        if (!userData || !newPassword) {
            Alert.alert('Error', 'Enter New Password');
            return;
        }

        try {
            const response = await resetPasswordAPIReq({
                UserCode: userData.UserCode,
                UserType: userData.UserType,
                Send_Type: sendOtpTo === 'mobile' ? 'M' : 'E',
                Otp_Code: otp,
                Password: newPassword,
            }).unwrap();

            if (response.Code === 200) {
                Alert.alert('Success', response.Message[0].Message);
                navigation.navigate('Login');
            } else {
                Alert.alert('Error', response.Message[0].Message || 'Password reset failed');
            }
        } catch (error: any) {
            Alert.alert('Error', error?.data?.Message?.[0]?.Message || 'Password reset failed');
        }
    };

    const renderInputField = (
        label: string,
        value: string,
        onChangeText: (text: string) => void,
        keyboardType: 'default' | 'numeric' | 'email-address' = 'default',
        maxLength?: number
    ) => (
        <>
            <Text style={styles.inputLabel}>{label}</Text>
            <TextInput
                style={styles.input}
                placeholder={label}
                placeholderTextColor={Constants.COLOR.FONT_HINT}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                value={value}
                maxLength={maxLength}
                secureTextEntry={label.toLowerCase().includes('password')}
            />
        </>
    );

    const renderToggleButton = (label: string, onPress: () => void) => (
        <TouchableOpacity style={styles.toggleButton} onPress={onPress}>
            <Text style={styles.toggleButtonText}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.mainContainer}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardAvoidingView}>
                <KeyboardAwareScrollView contentContainerStyle={styles.scrollViewContainer} enableOnAndroid enableAutomaticScroll={Platform.OS === 'ios'}>
                    <View style={styles.bodyContainerTop}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginVertical: 20 }}>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Image source={require('../images/black_cross.png')} style={styles.ChevronImage} resizeMode="contain" />
                            </TouchableOpacity>
                            <Text style={[styles.text, { marginLeft: 50 }]}>{getLabel('verifysrc_2')}</Text>
                        </View>
                    </View>

                    <View style={styles.bodyContainerBottom}>
                        <View style={styles.registerContainer}>
                            <View style={styles.registerInnerView}>
                                {settings?.Message?.[0]?.Flash_Logo && (
                                    <Image source={{ uri: settings.Message[0].Flash_Logo }} style={styles.cardImage} resizeMode="contain" />
                                )}

                                {!isUsernameValidated && renderInputField(getLabel('loginsrc_2'), userName, handleInputChange(setUserName))}
                                {!isUsernameValidated && (
                                    <TouchableOpacity style={styles.loginButton} onPress={handleValidateUser}>
                                        <Text style={styles.loginButtonText}>Validate User</Text>
                                    </TouchableOpacity>
                                )}

                                {isUsernameValidated && !isOtpSent && (
                                    <>
                                        {sendOtpTo === 'mobile' && renderInputField(getLabel('verifysrc_1'), mobileNumber, handleInputChange(setMobileNumber), 'numeric', 15)}
                                        {sendOtpTo === 'email' && renderInputField('Email', email, handleInputChange(setEmail), 'email-address')}
                                        <Text style={styles.orText}>or</Text>
                                        {sendOtpTo === 'mobile' && renderToggleButton('Send to Email', () => setSendOtpTo('email'))}
                                        {sendOtpTo === 'email' && renderToggleButton('Send to Mobile', () => setSendOtpTo('mobile'))}
                                        <TouchableOpacity style={styles.loginButton} onPress={handleSendOTP}>
                                            <Text style={styles.loginButtonText}>{getLabel('verifysrc_7')}</Text>
                                        </TouchableOpacity>
                                    </>
                                )}

                                {isOtpSent && !isOtpValidated && (
                                    <>
                                        {renderInputField('OTP', otp, handleInputChange(setOtp), 'numeric', 4)}
                                        <TouchableOpacity style={styles.loginButton} onPress={handleValidateOTP}>
                                            <Text style={styles.loginButtonText}>Validate OTP</Text>
                                        </TouchableOpacity>
                                        {isResendOtpVisible && (
                                            <TouchableOpacity style={styles.resendButton} onPress={() => handleSendOTP(true)}>
                                                <Text style={styles.resendButtonText}>Resend OTP</Text>
                                            </TouchableOpacity>
                                        )}
                                    </>
                                )}

                                {isOtpValidated && renderInputField('New Password', newPassword, handleInputChange(setNewPassword))}
                                {isOtpValidated && (
                                    <TouchableOpacity style={styles.loginButton} onPress={handleResetPassword}>
                                        <Text style={styles.loginButtonText}>Reset Password</Text>
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                    <Text style={styles.BackToText}>{getLabel('verifysrc_9')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ForgetPasswordScreen;



const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollViewContainer: {
        flexGrow: 1,
    },
    bodyContainerTop: {
        height: deviceHeight / 3,
        backgroundColor: Constants.COLOR.THEME_COLOR,
        borderBottomEndRadius: 15,
        borderBottomStartRadius: 15,
    },
    ChevronImage: {
        width: deviceHeight / 35,
        height: deviceHeight / 35,
        tintColor: Constants.COLOR.WHITE_COLOR,
    },
    text: {
        fontSize: Constants.FONT_SIZE.XXL,
        fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
        color: Constants.COLOR.WHITE_COLOR,
    },
    bodyContainerBottom: {
        position: 'absolute',
        top: deviceHeight / 5 - 50,
        left: 20,
        right: 20,
        borderRadius: 10,
    },
    registerContainer: {
        backgroundColor: Constants.COLOR.WHITE_COLOR,
        borderRadius: 10,
        shadowColor: Constants.COLOR.THEME_COLOR,
        shadowOpacity: 1.0,
        elevation: 3,
    },
    registerInnerView: {
        paddingLeft: 25,
        paddingRight: 25,
        marginTop: 20,
    },
    inputLabel: {
        marginTop: 10,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 10,
        fontSize: Constants.FONT_SIZE.SM,
        color: '#404040',
        textAlign: 'left',
        fontWeight: 'bold',
    },
    input: {
        height: 50,
        marginLeft: 0,
        marginRight: 0,
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#e0e0e0',
        borderRadius: 25,
        overflow: 'hidden',
        borderBottomWidth: 1,
        marginBottom: 20,
        paddingLeft: 10,
        paddingEnd: 10,
        color: 'black',
        fontSize: Constants.FONT_SIZE.SM,
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardImage: {
        marginTop: 0,
        marginBottom: 20,
        alignSelf: 'center',
        width: deviceHeight * (5 / 10),
        height: deviceHeight * (3 / 28),
    },
    loginButton: {
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
        fontSize: Constants.FONT_SIZE.L,
        fontWeight: 'bold',
        backgroundColor: Constants.COLOR.THEME_COLOR,
        borderColor: Constants.COLOR.THEME_COLOR,
        width: '100%',
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 13,
        paddingBottom: 13,
        borderRadius: 15,
        alignSelf: 'center',
        overflow: 'hidden',
    },
    loginButtonText: {
        color: Constants.COLOR.WHITE_COLOR,
        fontSize: 18,
        fontWeight: 'bold',
        alignItems: 'center',
        textAlign: 'center',
    },
    resendButton: {
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
        fontSize: Constants.FONT_SIZE.L,
        fontWeight: 'bold',
        backgroundColor: Constants.COLOR.THEME_COLOR,
        borderColor: Constants.COLOR.THEME_COLOR,
        width: '100%',
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 13,
        paddingBottom: 13,
        borderRadius: 15,
        alignSelf: 'center',
        overflow: 'hidden',
    },
    resendButtonText: {
        color: Constants.COLOR.WHITE_COLOR,
        fontSize: 18,
        fontWeight: 'bold',
        alignItems: 'center',
        textAlign: 'center',
    },
    BackToText: {
        fontSize: Constants.FONT_SIZE.SM,
        color: Constants.COLOR.BLACK_COLOR,
        textAlign: 'center',
        marginVertical: 10,
    },
    toggleButton: {
        padding: 6,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        marginHorizontal: 5,
        backgroundColor: Constants.COLOR.THEME_COLOR,
        color: Constants.COLOR.WHITE_COLOR
    },
    toggleButtonText: {
        color: Constants.COLOR.WHITE_COLOR,
        fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
        textAlign: 'center'
    },
});


