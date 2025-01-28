import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import Constants from '../util/Constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRefAppSettingMutation } from '../redux/service/AppSettingService';
import { useForgotPasswordMutation } from '../redux/service/ForgotPasswordService';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get("window").width;

const ForgetPasswordScreen = ({ navigation }: any) => {
    const [userName, setUserName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');

    const [appSettingsAPIReq, appSettingsAPIRes] =
        useRefAppSettingMutation();

    const [forgotPasswordAPIReq, forgotPasswordAPIRes] =
        useForgotPasswordMutation();


    //useeffect for Logo
    useEffect(() => {
        const appSettingsObj = {};
        appSettingsAPIReq(appSettingsObj);
    }, []);

    const toastStyle = {
        backgroundColor: 'red',
        color: 'white',
    };

    const showToast = (message) => {
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            toastStyle,
        );
    };

    const handleMobileNumberChange = (text) => {
        const numericRegex = /^[0-9]*$/;
        if (numericRegex.test(text)) {
            setMobileNumber(text);
        }
    };

   

    // const handleOTP = () => {
    //     console.log('Requesting OTP for user:', userName);

    //     forgotPasswordAPIReq({
    //         Username: userName,
    //     });
    // };

    // useEffect(() => {
    //     console.log("Forgot Password API Response:", forgotPasswordAPIRes);

    //     if (forgotPasswordAPIRes.isSuccess) {
    //         console.log('OTP sent successfully');

    //         showToast('Successfully OTP sent to your mobile number');
    //     } else if (forgotPasswordAPIRes.isError && forgotPasswordAPIRes?.data?.Message) {
    //         showToast(forgotPasswordAPIRes?.data?.Message[0]?.Message || 'An error occurred');
    //     }
    // }, [forgotPasswordAPIRes]);

    const handleOTP = () => {
        // Ensure userName is defined and not empty before sending the request
        if (!userName) {
            console.log('Error: userName is empty.');
            showToast('Please enter a valid username');
            return;
        }
        
        console.log('Requesting OTP for user:', userName);
        forgotPasswordAPIReq({
            Username: userName,
        });
    };
    
    useEffect(() => {
        console.log("Forgot Password API Response:", forgotPasswordAPIRes);
    
        if (forgotPasswordAPIRes.isSuccess) {
            console.log('OTP sent successfully');
            showToast('Successfully OTP sent to your mobile number');
        } else if (forgotPasswordAPIRes.isError) {
            const errorMessage = forgotPasswordAPIRes?.data?.Message?.[0]?.Message || 'An error occurred';
            console.log('Error in OTP request:', errorMessage);
            showToast(errorMessage);
        }
    }, [forgotPasswordAPIRes]);
    
    useEffect(() => {
        if (forgotPasswordAPIRes.isLoading) {
            console.log('Loading: OTP request in progress...');
        }
    }, [forgotPasswordAPIRes.isLoading]);
    

    const handleBack = () => {
        navigation.goBack('');
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <KeyboardAwareScrollView>
                <View style={styles.bodyContainerTop}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginVertical: 20 }}>
                        <TouchableOpacity onPress={handleBack}>
                            <Image
                                source={require('../images/black_cross.png')}
                                style={styles.ChevronImage}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                        <Text style={[styles.text, { marginLeft: 50 }]}>Reset Password</Text>
                    </View>
                </View>

                <View style={styles.bodyContainerBottom} >
                    <View style={styles.registerContainer}>
                        <View style={styles.registerInnerView}>
                            <Image
                                source={{ uri: appSettingsAPIRes?.data?.Message[0].Client_Logo }}
                                style={styles.cardImage}
                                resizeMode="contain"
                            />
                            <Text style={styles.inputLabel}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter the Mobile Number"
                                onChangeText={handleMobileNumberChange}
                                keyboardType="numeric"
                                value={mobileNumber}
                                maxLength={15}
                            />
                            <TouchableOpacity style={styles.loginButton} onPress={handleOTP}>
                                <Text style={styles.loginButtonText}>Get OTP</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.BackToText}>Back to Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
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
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1.0,
        elevation: 6,
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
        alignItems: "center",
        textAlign: "center"
    },
    BackToText: {
        fontSize: Constants.FONT_SIZE.SM,
        color: Constants.COLOR.BLACK_COLOR,
        textAlign: 'center',
        marginVertical: 10,
    },
});

export default ForgetPasswordScreen;


