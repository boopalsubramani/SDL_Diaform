
import React, { useState, useRef, useEffect } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constants from '../util/Constants';
import DeviceInfo from 'react-native-device-info';
import { useAppSettings } from '../common/AppSettingContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../common/UserContext';
import { useRefAppLoginMutation } from '../redux/service/LoginService';
import { useOtpSendMutation } from '../redux/service/OtpSendService';
import { useDispatch } from 'react-redux';
import { loadSelectedLanguage } from '../redux/slice/AppSettingSlice';

const deviceHeight = Dimensions.get('window').height;


const LoginScreen = ({ navigation }: any) => {
    const dispatch = useDispatch();
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const passwordRef = useRef(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState({ Code: '', Description: '', Alignment: '', Labels_Url: '' });
    const { settings, changeLanguage } = useAppSettings();
    const [isOtpLogin, setOtpLogin] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpRequested, setOtpRequested] = useState(false);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [userNameError, setUserNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isError, setIsError] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const { userData, setUserData } = useUser();
    const [labels, setLabels] = useState({});
    const [loginAPIReq, LoginAPIRes] = useRefAppLoginMutation();
    const [otpSendAPIReq] = useOtpSendMutation();

    const language = settings?.Message?.[0]?.Languages ?? [];

    const getLabel = (key: string) => {
        return labels[key]?.defaultMessage || '';
    };

    const initializeLanguage = () => {
        const defaultLanguageCode = settings?.Message?.[0]?.Mobile_App_Default_Language;
        const defaultLanguage = language.find(lang => lang.Code === defaultLanguageCode) || { Code: '', Description: '', Alignment: '', Labels_Url: '' };
        setSelectedLanguage(defaultLanguage);
        fetchLabels(defaultLanguage.Labels_Url);
    };

    useEffect(() => {
        initializeLanguage();
    }, [settings]);

    useEffect(() => {
        if (LoginAPIRes && LoginAPIRes.isSuccess && LoginAPIRes.data?.SuccessFlag === "true" && LoginAPIRes.data?.Code === 200) {
            const userData = LoginAPIRes.data.Message[0];
            AsyncStorage.setItem('userData', JSON.stringify(userData));
            AsyncStorage.removeItem('patientData');
            setUserData(userData);
            navigation.navigate('Bottom');
        } else if (LoginAPIRes && LoginAPIRes.isError) {
            const errorMessage = LoginAPIRes.error?.data?.Message[0]?.Message;
            setIsError(true);
            showAlert('Error', errorMessage);
        }
    }, [LoginAPIRes]);


    useEffect(() => {
        const retrieveUserData = async () => {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                setUserData(JSON.parse(userData));
            }
        };
        retrieveUserData();
    }, [setUserData]);

    const fetchLabels = async (url: string) => {
        if (!url) return;
        try {
            const response = await fetch(url);
            const data = await response.json();
            setLabels(data);
        } catch (error) {
            console.error('Failed to fetch labels:', error);
        }
    };


    const showAlert = (title: string, message: string) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const closeAlert = () => {
        setAlertVisible(false);
    };

    useEffect(() => {
        dispatch(loadSelectedLanguage());
    }, []);


    const validateInputs = async () => {
        setUserNameError('');
        setPasswordError('');
        setIsError(false);
        if (isOtpLogin) {
            if (!otpRequested) {
                if (!phoneNumber) {
                    setUserNameError('Phone Number is required');
                    return;
                }
                try {
                    const response = await otpSendAPIReq({
                        UserCode: userData?.UserCode || '',
                        UserType: userData?.UserType || '',
                        Send_Type: 'M',
                        Mobile_No: phoneNumber,
                        Email_Id: userData?.Email || '',
                    }).unwrap();
                    console.log("console1", response);
                    if (response?.Code === 200) {
                        console.log("console2");
                        setOtpRequested(true);
                        Alert.alert('OTP Sent', 'OTP has been sent to your phone number.');
                    }
                } catch (error) {
                    console.log("console3", error);
                    showAlert('Error', 'An error occurred while sending OTP');
                }
            } else {
                if (!otp) {
                    setUserNameError('OTP is required');
                    return;
                }
                else {
                    let loginReqObj = {
                        PhoneNumber: phoneNumber,
                        OTP: otp,
                    };
                    const response = await loginAPIReq(loginReqObj).unwrap();
                    console.log("Login API RequestOTP:", loginReqObj);
                    console.log("Login API ResponseOTP:", response);
                }
            }
        } else {
            let hasError = false;
            if (!userName) {
                setUserNameError('UserName is required');
                hasError = true;
            }
            if (!password) {
                setPasswordError('Password is required');
                hasError = true;
            }
            if (hasError) return;
            let loginReqObj = {
                UserName: userName,
                Password: password,
            };
            const response = await loginAPIReq(loginReqObj);
            console.log("Login API RequestUSERNAME:", loginReqObj);
            console.log("Login API ResponsePASSWORD:", response);
        }
    };

    const handleForgotPasswordOrResendOtp = () => {
        if (isOtpLogin && otpRequested) {
            handleResendOTP();
        } else {
            navigation.navigate('ForgotPassword');
        }
    };

    const handleResendOTP = async () => {
        if (!userData) {
            Alert.alert('Please validate the user first');
            return;
        }
        try {
            const response = await otpSendAPIReq({
                UserCode: userData.UserCode,
                UserType: userData.UserType,
                Send_Type: 'M',
                Mobile_No: phoneNumber,
                Email_Id: userData.Email,
            }).unwrap();

            if (response.Code === 200) {
                Alert.alert('OTP resent successfully');
            } else {
                Alert.alert('Failed to resend OTP');
            }
        } catch (error) {
            Alert.alert('Failed to resend OTP');
        }
    };

    const navigateTermsAndConditionScreen = () => {
        Alert.alert('Registration', 'Navigate to registration screen');
    };

    const handleSelectLanguage = (language: any) => {
        console.log("🌍 Selected Language:", language);
        AsyncStorage.setItem("selectedLanguage", language)
        if (!language || !language.Code) {
            console.error("❌ Error: Language Code is missing!");
            return;
        }
        console.log("🌍 Changing to Language Code:", language.Code);
        setSelectedLanguage(language);
        changeLanguage(language.Code);
        fetchLabels(language.Labels_Url);
        setModalVisible(false);
    };


    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <KeyboardAwareScrollView>
                <View style={styles.bodyContainerTop}>
                    <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-between", padding: 10 }}>
                        <View style={styles.titleView}>
                            <Text style={styles.title}>{getLabel('loginsrc_1')}</Text>
                        </View>
                        <View>
                            <TouchableOpacity
                                style={[styles.dropdownButton, {}]}
                                onPress={() => setModalVisible(true)}
                            >
                                <Text style={styles.dropdownButtonText}>{selectedLanguage.Description}</Text>
                                <Image
                                    style={styles.downImage}
                                    resizeMode="contain"
                                    source={require('../images/arrowDown.png')}
                                />
                            </TouchableOpacity>
                            <Modal
                                transparent={true}
                                visible={isModalVisible}
                                animationType="fade"
                                onRequestClose={() => setModalVisible(false)}
                            >
                                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                                    <View style={styles.modalOverlay}>
                                        <View style={styles.modalContainer}>
                                            <FlatList
                                                data={language}
                                                renderItem={({ item }) => (
                                                    <TouchableOpacity
                                                        style={styles.modalItem}
                                                        onPress={() => handleSelectLanguage(item)}
                                                    >
                                                        <Text style={styles.modalItemText}>{item.Description}</Text>
                                                    </TouchableOpacity>
                                                )}
                                                keyExtractor={(item) => item.Code}
                                            />
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </Modal>
                        </View>
                    </View>
                </View>

                <View style={styles.bodyContainerBottom} />
                <View style={styles.registerContainer}>
                    <View style={styles.registerInnerView}>
                        <View style={{ marginHorizontal: 10 }}>
                            <Image
                                resizeMode="contain"
                                source={{ uri: settings?.Message?.[0].Flash_Logo }}
                                style={styles.image}
                            />

                            <Text style={[styles.placeholder, {
                                textAlign: selectedLanguage.Alignment === 'rtl' ? 'right' : 'left'
                            }]}
                            >
                                {isOtpLogin ? getLabel('verifysrc_1') : getLabel('loginsrc_2')}
                            </Text>

                            {isOtpLogin ? (
                                <>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={[styles.inputs, {
                                                textAlign: selectedLanguage.Alignment === 'rtl' ? 'right' : 'left'
                                            }]}
                                            placeholder={getLabel('verifysrc_1')}
                                            placeholderTextColor={Constants.COLOR.FONT_HINT}
                                            value={phoneNumber}
                                            editable={true}
                                            maxLength={15}
                                            keyboardType="numeric"
                                            underlineColorAndroid="transparent"
                                            returnKeyType={'next'}
                                            onChangeText={setPhoneNumber}
                                        />
                                    </View>
                                    {userNameError ? (
                                        <Text style={styles.errorText}>{userNameError}</Text>
                                    ) : null}

                                    {otpRequested && (
                                        <>
                                            <Text style={[styles.placeholder, {
                                                textAlign: selectedLanguage.Alignment === 'rtl' ? 'right' : 'left'
                                            }]}
                                            >{getLabel('verifysrc_4')}</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={[styles.inputs, {
                                                        textAlign: selectedLanguage.Alignment === 'rtl' ? 'right' : 'left'
                                                    }]}
                                                    placeholder={getLabel('verifysrc_4')}
                                                    placeholderTextColor={Constants.COLOR.FONT_HINT}
                                                    value={otp}
                                                    editable={true}
                                                    maxLength={6}
                                                    underlineColorAndroid="transparent"
                                                    keyboardType="numeric"
                                                    returnKeyType={'done'}
                                                    onChangeText={setOtp}
                                                />
                                            </View>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={[styles.inputs, {
                                                textAlign: selectedLanguage.Alignment === 'rtl' ? 'right' : 'left'
                                            }]}
                                            placeholder={getLabel('loginsrc_2')}
                                            placeholderTextColor={Constants.COLOR.FONT_HINT}
                                            value={userName}
                                            editable={true}
                                            maxLength={15}
                                            underlineColorAndroid="transparent"
                                            returnKeyType={'next'}
                                            onSubmitEditing={() => passwordRef?.current?.focus()}
                                            onChangeText={setUserName}
                                        />
                                    </View>
                                    {userNameError ? (
                                        <Text style={styles.errorText}>{userNameError}</Text>
                                    ) : null}

                                    <Text style={[styles.placeholder, {
                                        textAlign: selectedLanguage.Alignment === 'rtl' ? 'right' : 'left'
                                    }]}
                                    >{getLabel('loginsrc_3')}</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            ref={passwordRef}
                                            style={[styles.inputs, {
                                                textAlign: selectedLanguage.Alignment === 'rtl' ? 'right' : 'left'
                                            }]}
                                            value={password}
                                            placeholder={getLabel('loginsrc_3')}
                                            placeholderTextColor={Constants.COLOR.FONT_HINT}
                                            keyboardType="default"
                                            secureTextEntry={!isPasswordVisible}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="none"
                                            returnKeyType="done"
                                            onChangeText={setPassword}
                                            onSubmitEditing={validateInputs}
                                        />
                                        <TouchableOpacity onPress={togglePasswordVisibility} style={[styles.eyeIconContainer, {
                                            position: 'absolute',
                                            right: selectedLanguage.Alignment === 'ltr' ? 10 : undefined,
                                            left: selectedLanguage.Alignment === 'ltr' ? undefined : 10,
                                        }]}>
                                            <Image
                                                source={isPasswordVisible ? require('../images/EyeView.png') : require('../images/EyeHidden.png')}
                                                style={styles.eyeIcon}
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    {passwordError ? (
                                        <Text style={styles.errorText}>{passwordError}</Text>
                                    ) : null}
                                </>
                            )}

                            {isOtpLogin ? (
                                otpRequested && (
                                    <TouchableOpacity
                                        style={styles.linkView}
                                        onPress={handleForgotPasswordOrResendOtp}>
                                        <Text style={styles.link}>
                                            {getLabel('verifysrc_5')}
                                        </Text>
                                    </TouchableOpacity>
                                )
                            ) : (
                                <TouchableOpacity
                                    style={styles.linkView}
                                    onPress={handleForgotPasswordOrResendOtp}>
                                    <Text style={styles.link}>
                                        {getLabel('loginsrc_4')}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity onPress={validateInputs}>
                                <Text style={styles.button}>
                                    {isOtpLogin
                                        ? otpRequested
                                            ? getLabel('loginsrc_1')
                                            : getLabel('verifysrc_7')
                                        : getLabel('loginsrc_1') || getLabel('loginsrc_1')}</Text>
                            </TouchableOpacity>

                            {/* {isError ? (
                                <Text style={styles.errorText}>Invalid username or password</Text>
                            ) : null} */}

                            <TouchableOpacity onPress={() => setOtpLogin(!isOtpLogin)}>
                                <Text style={styles.OTPbutton}>
                                    {isOtpLogin ? 'Login With Password' : 'Login With OTP'}
                                </Text>
                            </TouchableOpacity>

                            <View
                                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={styles.version}>
                                    {getLabel('loginsrc_6').replace('{version}', DeviceInfo.getVersion() || '1.0.0')}
                                </Text>

                                <Text style={styles.version}>{getLabel('loginsrc_7')}</Text>
                            </View>
                            <TouchableOpacity onPress={navigateTermsAndConditionScreen}>
                                <Text style={styles.linkRegister}>
                                    {getLabel('loginsrc_8')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>

            {/* Custom Alert Modal */}
            <Modal
                transparent={true}
                visible={alertVisible}
                animationType="fade"
                onRequestClose={closeAlert}
            >
                <TouchableWithoutFeedback onPress={closeAlert}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.alertContainer}>
                            <Text style={styles.alertTitle}>{alertTitle}</Text>
                            <Text style={styles.alertMessage}>{alertMessage}</Text>
                            <TouchableOpacity style={styles.alertButton} onPress={closeAlert}>
                                <Text style={styles.alertButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </SafeAreaView>
    );
};

export default LoginScreen;





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
    bodyContainerBottom: {
        height: 450,
    },
    registerContainer: {
        position: 'absolute',
        backgroundColor: Constants.COLOR.WHITE_COLOR,
        top: 80,
        left: 20,
        right: 20,
        bottom: 20,
        borderRadius: 10,
        shadowColor: Constants.COLOR.THEME_COLOR,
        elevation: 3,
    },
    registerInnerView: {
        paddingLeft: 25,
        paddingRight: 25,
        marginTop: 20,
    },
    titleView: {
        flexDirection: "row",
    },
    title: {
        fontSize: Constants.FONT_SIZE.XL,
        color: Constants.COLOR.WHITE_COLOR,
        fontFamily: Constants.FONT_FAMILY.fontFamilyMedium
    },
    placeholder: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: Constants.FONT_SIZE.SM,
        fontFamily: Constants.FONT_FAMILY.fontFamilyMedium,
        color: '#404040',
        textAlign: 'left',
    },
    button: {
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
        fontSize: Constants.FONT_SIZE.L,
        fontFamily: Constants.FONT_FAMILY.fontFamilyMedium,
        color: Constants.COLOR.WHITE_COLOR,
        backgroundColor: Constants.COLOR.THEME_COLOR,
        borderColor: Constants.COLOR.THEME_COLOR,
        width: '100%',
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 13,
        paddingBottom: 13,
        borderRadius: 16,
        alignSelf: 'center',
        overflow: 'hidden',
    },
    OTPbutton: {
        marginTop: 10,
        marginBottom: 10,
        borderWidth: 0.5,
        textAlign: 'center',
        fontSize: Constants.FONT_SIZE.L,
        fontFamily: Constants.FONT_FAMILY.fontFamilyMedium,
        paddingTop: 13,
        paddingBottom: 13,
        borderRadius: 16,
    },
    image: {
        marginTop: 0,
        marginBottom: 10,
        alignSelf: 'center',
        width: deviceHeight * (5 / 10),
        height: deviceHeight * (3 / 28),
        resizeMode: "contain"
    },
    linkView: {
        alignSelf: 'flex-end',

    },
    link: {
        fontSize: Constants.FONT_SIZE.S,
        color: Constants.COLOR.BLACK_COLOR,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
        textAlign: 'center',
        marginVertical: 5,
    },
    linkRegister: {
        fontSize: Constants.FONT_SIZE.S,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
        color: "#130FA8",
        textAlign: 'center',
        marginVertical: 10,
        textDecorationLine: 'underline',
    },
    version: {
        fontSize: Constants.FONT_SIZE.S,
        fontFamily: Constants.FONT_FAMILY.fontFamilyMedium,
        textAlign: 'center',
        marginVertical: 5,
    },
    termsAndCondition: {
        marginTop: 5,
        marginBottom: 10,
        fontSize: Constants.FONT_SIZE.S,
        color: 'blue',
        textAlign: 'left',
        textDecorationLine: 'underline',
        alignSelf: 'center',
    },
    dropdownButton: {
        flex: 1,
        backgroundColor: Constants.COLOR.WHITE_COLOR,
        alignItems: 'center',
        borderRadius: 4,
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    dropdownButtonText: {
        color: "#000000",
        fontSize: Constants.FONT_SIZE.SM,
        alignItems: 'center',
        fontFamily: Constants.FONT_FAMILY.fontFamilyMedium
    },
    downImage: {
        width: deviceHeight / 35,
        height: deviceHeight / 55,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxHeight: deviceHeight * 0.7,
    },
    modalItem: {
        padding: 10,
    },
    modalItemText: {
        fontSize: 18,
        color: "#333",
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputs: {
        flex: 1,
        height: 50,
        marginLeft: 0,
        marginRight: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        backgroundColor: '#E0E0E0',
        borderRadius: 25,
        paddingEnd: 10,
        paddingStart: 10,
        color: Constants.COLOR.BLACK_COLOR,
        fontSize: Constants.FONT_SIZE.SM,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
        flexDirection: 'row',
        alignItems: 'center',
    },
    eyeIconContainer: {
        position: 'absolute',
        right: 10,
    },
    eyeIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        tintColor: '#000000'
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
        paddingLeft: 10,
        fontSize: Constants.FONT_SIZE.S,
    },
    alertContainer: {
        backgroundColor: Constants.COLOR.WHITE_COLOR,
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxWidth: 400,
        alignItems: 'center',
        elevation: 3,
        shadowColor: Constants.COLOR.THEME_COLOR,
    },
    alertTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    alertMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#555',
    },
    alertButton: {
        backgroundColor: Constants.COLOR.THEME_COLOR,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    alertButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});


