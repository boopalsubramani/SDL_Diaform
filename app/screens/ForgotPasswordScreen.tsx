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

const deviceHeight = Dimensions.get('window').height;

const ForgetPasswordScreen = ({ navigation }: any) => {
    const [userName, setUserName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { userData, setUserData } = useUser();
    const [isUsernameValidated, setIsUsernameValidated] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpValidated, setIsOtpValidated] = useState(false);
    const [isResendOtpVisible, setIsResendOtpVisible] = useState(false);
    const { settings, labels } = useAppSettings();
    const [forgotPasswordAPIReq] = useForgotPasswordMutation();
    const [otpSendAPIReq] = useOtpSendMutation();
    const [resetPasswordAPIReq] = useResetPasswordMutation();
    const [isMounted, setIsMounted] = useState(true);
    const selectedLanguage = useSelector(state => state.appSettings.selectedLanguage);

    useEffect(() => {
        setIsMounted(true);
        return () => {
            setIsMounted(false);
        };
    }, []);

    useEffect(() => {
        I18nManager.forceRTL(selectedLanguage.Alignment === 'rtl');
    }, [selectedLanguage]);


    const getLabel = (key: string) => {
        return labels[key]?.defaultMessage || '';
    };

    const showToast = (message: string) => {
        if (isMounted) {
            ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.TOP);
        }
    };

    const handleMobileNumberChange = (text: string) => {
        const numericRegex = /^[0-9]*$/;
        if (numericRegex.test(text) && text.length <= 15) {
            setMobileNumber(text);
        }
    };

    const handleValidateUser = async () => {
        if (!userName.trim()) {
            showToast('Username cannot be empty');
            return;
        }

        try {
            const response = await forgotPasswordAPIReq({ Username: userName.trim() }).unwrap();
            if (response.Code === 200) {
                setUserData(response.Message[0]);
                setIsUsernameValidated(true);
                showToast('User validated successfully');
            } else {
                showToast('User validation failed');
            }
        } catch (error) {
            showToast('User validation failed');
        }
    };

    const handleSendOTP = async () => {
        if (!userData) {
            showToast('Please validate the user first');
            return;
        }

        try {
            const response = await otpSendAPIReq({
                UserCode: userData.UserCode,
                UserType: userData.UserType,
                Send_Type: 'M',
                Mobile_No: mobileNumber,
                Email_Id: userData.Email,
            }).unwrap();

            if (response.Code === 200) {
                setIsOtpSent(true);
                setIsResendOtpVisible(true);
                showToast('OTP sent successfully');
            } else {
                showToast('Failed to send OTP');
            }
        } catch (error) {
            showToast('Failed to send OTP');
        }
    };

    const handleResendOTP = async () => {
        if (!userData) {
            showToast('Please validate the user first');
            return;
        }

        try {
            const response = await otpSendAPIReq({
                UserCode: userData.UserCode,
                UserType: userData.UserType,
                Send_Type: 'M',
                Mobile_No: mobileNumber,
                Email_Id: userData.Email,
            }).unwrap();

            if (response.Code === 200) {
                showToast('OTP resent successfully');
            } else {
                showToast('Failed to resend OTP');
            }
        } catch (error) {
            showToast('Failed to resend OTP');
        }
    };

    // const handleSendOrResendOTP = async (isResend = false) => {
    //     if (!userData) {
    //         showToast('Please validate the user first');
    //         return;
    //     }

    //     try {
    //         const response = await otpSendAPIReq({
    //             UserCode: userData.UserCode,
    //             UserType: userData.UserType,
    //             Send_Type: 'M',
    //             Mobile_No: mobileNumber,
    //             Email_Id: userData.Email,
    //         }).unwrap();

    //         if (response.Code === 200) {
    //             setIsOtpSent(true);
    //             setIsResendOtpVisible(true);
    //             showToast(isResend ? 'OTP resent successfully' : 'OTP sent successfully');
    //         } else {
    //             showToast('Failed to send OTP');
    //         }
    //     } catch (error) {
    //         showToast('Failed to send OTP');
    //     }
    // };

    const handleValidateOTP = async () => {
        if (!otp.trim()) {
            showToast('Please enter the OTP');
            return;
        }
        showToast('OTP verified successfully');

        setTimeout(() => {
            setIsOtpValidated(true);
        }, 1000);
    };

    // const handleValidateOTP = async () => {
    //     if (!otp.trim()) {
    //         showToast('Please enter the OTP');
    //         return;
    //     }

    //     try {
    //         const response = await validateOtpAPIReq({ UserCode: userData.UserCode, Otp_Code: otp }).unwrap();
    //         if (response.Code === 200) {
    //             setIsOtpValidated(true);
    //             showToast('OTP verified successfully');
    //         } else {
    //             showToast('Invalid OTP');
    //         }
    //     } catch (error) {
    //         showToast('OTP validation failed');
    //     }
    // };


    const handleResetPassword = async () => {
        if (!userData || !newPassword) {
            showToast('Please enter all required fields');
            return;
        }

        try {
            const response = await resetPasswordAPIReq({
                UserCode: userData.UserCode,
                UserType: userData.UserType,
                Send_Type: 'M',
                Otp_Code: otp,
                Password: newPassword,
            }).unwrap();

            if (response.Code === 200) {
                showToast('Password reset successfully');
                navigation.navigate('Login');
            } else {
                showToast('Password reset failed');
            }
        } catch (error) {
            showToast('Password reset failed');
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollViewContainer}
                    enableOnAndroid={true}
                    enableAutomaticScroll={Platform.OS === 'ios'}
                >
                    <View style={styles.bodyContainerTop}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginVertical: 20 }}>
                            <TouchableOpacity onPress={handleBack}>
                                <Image
                                    source={require('../images/black_cross.png')}
                                    style={styles.ChevronImage}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <Text style={[styles.text, { marginLeft: 50 }]}>{getLabel('verifysrc_2')}</Text>
                        </View>
                    </View>

                    <View style={styles.bodyContainerBottom}>
                        <View style={styles.registerContainer}>
                            <View style={styles.registerInnerView}>
                                {settings?.Message?.[0]?.Flash_Logo && (
                                    <Image
                                        source={{ uri: settings.Message[0].Flash_Logo }}
                                        style={styles.cardImage}
                                        resizeMode="contain"
                                    />
                                )}

                                {!isUsernameValidated && (
                                    <>
                                        <Text style={styles.inputLabel}>{getLabel('loginsrc_2')}</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder={getLabel('loginsrc_2')}
                                            onChangeText={setUserName}
                                            value={userName}
                                        />
                                        <TouchableOpacity style={styles.loginButton} onPress={handleValidateUser}>
                                            <Text style={styles.loginButtonText}>Validate User</Text>
                                        </TouchableOpacity>
                                    </>
                                )}

                                {isUsernameValidated && !isOtpSent && (
                                    <>
                                        <Text style={styles.inputLabel}>{getLabel('verifysrc_1')}</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder={getLabel('verifysrc_1')}
                                            onChangeText={handleMobileNumberChange}
                                            keyboardType="numeric"
                                            value={mobileNumber}
                                            maxLength={15}
                                        />
                                        <TouchableOpacity style={styles.loginButton} onPress={handleSendOTP}>
                                            <Text style={styles.loginButtonText}>{getLabel('verifysrc_7')}</Text>
                                        </TouchableOpacity>
                                    </>
                                )}

                                {isOtpSent && !isOtpValidated && (
                                    <>
                                        <Text style={styles.inputLabel}>OTP</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter the OTP"
                                            onChangeText={setOtp}
                                            keyboardType="numeric"
                                            value={otp}
                                            maxLength={4}
                                        />
                                        <TouchableOpacity style={styles.loginButton} onPress={handleValidateOTP}>
                                            <Text style={styles.loginButtonText}>Validate OTP</Text>
                                        </TouchableOpacity>
                                        {isResendOtpVisible && (
                                            <TouchableOpacity style={styles.resendButton} onPress={handleResendOTP}>
                                                <Text style={styles.resendButtonText}>Resend OTP</Text>
                                            </TouchableOpacity>
                                        )}
                                    </>
                                )}

                                {isOtpValidated && (
                                    <>
                                        <Text style={styles.inputLabel}>New Password</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Enter new password"
                                            onChangeText={setNewPassword}
                                            secureTextEntry
                                            value={newPassword}
                                        />
                                        <TouchableOpacity style={styles.loginButton} onPress={handleResetPassword}>
                                            <Text style={styles.loginButtonText}>Reset Password</Text>
                                        </TouchableOpacity>
                                    </>
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
        fontWeight: 'bold',
        color: Constants.COLOR.WHITE_COLOR,
    },
    bodyContainerBottom: {
        backgroundColor: '#fefefe',
        height: 450,
        position: 'absolute',
        top: deviceHeight / 5 - 50,
        left: 20,
        right: 20,
        borderRadius: 10,
        paddingTop: 10,
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
});

export default ForgetPasswordScreen;

