
import React, { useState, useRef, useEffect } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    KeyboardAvoidingView,
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



const deviceHeight = Dimensions.get('window').height;

// const LoginScreen = ({ navigation }: any) => {
//     const [isPasswordVisible, setPasswordVisible] = useState(false);
//     const passwordRef = useRef<TextInput>(null);
//     const [isModalVisible, setModalVisible] = useState(false);
//     const [selectedLanguage, setSelectedLanguage] = useState("Select Language");
//     const [isOtpModalVisible, setOtpModalVisible] = useState(false);
//     const [otp, setOtp] = useState(["", "", "", ""]);
//     const otpRefs = useRef<(TextInput | null)[]>([]);
//     const [userName, setUserName] = useState('');
//     const [password, setPassword] = useState('');
//     const [userNameError, setUserNameError] = useState('');
//     const [passwordError, setPasswordError] = useState('');
//     const [isError, setIsError] = useState(false);
//     const [userDetails, setUserDetails] = useState<any>(null);
//     const [loading, setLoading] = useState(false);
//     const { settings } = useAppSettings();
//     const { setUserData } = useUser();
//     const [loginAPIReq, LoginAPIRes] = useRefAppLoginMutation();

//     const passwordPolicyMessages = settings?.Message?.[0]?.Password_Policy_Message ?? [];
//     const language: { Code: string; Description: string }[] =
//         Array.isArray(settings?.Message?.[0]?.Languages)
//             ? settings?.Message?.[0]?.Languages.map(lang =>
//                 typeof lang === "object" && lang !== null ? lang : { Code: "", Description: "" })
//             : [];
//     const labels = settings?.Message?.[0]?.Labels || {};

//     const getLabel = (key: string) => {
//         return labels[key]?.defaultMessage || '';
//     };

//     // Handle login API response
//     useEffect(() => {
//         setLoading(LoginAPIRes.isLoading);

//         if (LoginAPIRes.isSuccess && LoginAPIRes.data.SuccessFlag === "true" && LoginAPIRes.data.Code === 200) {
//             const userData = LoginAPIRes.data.Message[0];
//             AsyncStorage.setItem('userData', JSON.stringify(userData));
//             // setUserDetails(userData);
//             setUserData(userData); 
//             navigation.navigate('Bottom');
//         } else if (LoginAPIRes.isError && LoginAPIRes?.data?.Message) {
//             const errorMessage = LoginAPIRes?.data?.Message[0]?.Message || 'An error occurred';
//             setIsError(true);
//             showAlert('Error', errorMessage);
//             console.log("Error", LoginAPIRes);
//         }
//     }, [LoginAPIRes, navigation]);

//     // Retrieve user data from AsyncStorage
//     useEffect(() => {
//         const retrieveUserData = async () => {
//             const userData = await AsyncStorage.getItem('userData');
//             if (userData) {
//                 // setUserDetails(JSON.parse(userData));
//                 setUserData(JSON.parse(userData)); 
//             }
//         };
//         retrieveUserData();
//     }, [setUserData]);

//     // Alert function
//     const showAlert = (title: string, message: string) => {
//         Alert.alert(title, message, [], { cancelable: false });
//     };

//     // Validate inputs for login
//     const validateInputs = async () => {
//         setUserNameError('');
//         setPasswordError('');
//         setIsError(false);
//         // Validate Username
//         if (!userName || userName.length === 0) {
//             setUserNameError('Mobile Number is required');
//         }
//         else if (userName.length < 9) {
//             setUserNameError('Mobile Number should not be empty and must contain minimum 10 characters');
//         }
//         // Validate Password
//         else if (!password || password.length === 0) {
//             setPasswordError(passwordPolicyMessages[0]);
//         }
//         else if (password.length < 8) {
//             setPasswordError(passwordPolicyMessages[1]);
//         }
//         else {
//             let loginReqObj = {
//                 UserName: userName,
//                 Password: password,
//             };
//             const response = await loginAPIReq(loginReqObj);
//             console.log("Login API Request:", loginReqObj);
//             console.log("Login API Response:", response);
//         }
//     };

//     const forgotPassword = () => {
//         navigation.navigate('ForgotPassword');
//     };

//     const navigateRegistrationScreen = () => {
//         Alert.alert('Registration', 'Navigate to registration screen');
//     };

//     // Handle language selection
//     const handleSelectLanguage = (language: { Code: string; Description: string }) => {
//         setSelectedLanguage(language.Description);
//         setModalVisible(false);
//     };

//     // Handle OTP changes
//     const handleOtpChange = (value: string, index: number) => {
//         const updatedOtp = [...otp];
//         updatedOtp[index] = value;
//         setOtp(updatedOtp);

//         if (value.trim() && index < otp.length - 1) {
//             otpRefs.current[index + 1]?.focus();
//         } else if (!value.trim() && index > 0) {
//             otpRefs.current[index - 1]?.focus();
//         }
//     };

//     // Handle OTP submit
//     const handleSubmitOtp = () => {
//         if (otp.every((digit) => digit.trim())) {
//             Alert.alert("Success", `OTP entered: ${otp.join("")}`);
//             setOtpModalVisible(false);
//         } else {
//             Alert.alert("Error", "Please fill all the OTP fields.");
//         }
//     };

//     const handleLoginThroughOtp = () => {
//         setOtpModalVisible(true);
//     };

//     const togglePasswordVisibility = () => {
//         setPasswordVisible(!isPasswordVisible);
//     };

//     return (
//         <SafeAreaView style={styles.mainContainer}>
//             <KeyboardAwareScrollView>
//                 <View style={styles.bodyContainerTop}>
//                     <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-between", padding: 10 }}>
//                         <View style={styles.titleView}>
//                             <Text style={styles.title}>{getLabel('loginsrc_1')}</Text>
//                         </View>
//                         <View>
//                             <TouchableOpacity
//                                 style={[styles.dropdownButton, {}]}
//                                 onPress={() => setModalVisible(true)}
//                             >
//                                 <Text style={styles.dropdownButtonText}>{selectedLanguage}</Text>
//                                 <Image
//                                     style={styles.nextImage}
//                                     resizeMode="contain"
//                                     source={require('../images/arrowDown.png')}
//                                 />
//                             </TouchableOpacity>
//                             <Modal
//                                 transparent={true}
//                                 visible={isModalVisible}
//                                 animationType="fade"
//                                 onRequestClose={() => setModalVisible(false)}
//                             >
//                                 <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
//                                     <View style={styles.modalOverlay}>
//                                         <View style={styles.modalContainer}>
//                                             <FlatList
//                                                 data={language}
//                                                 renderItem={({ item }) => (
//                                                     <TouchableOpacity
//                                                         style={styles.modalItem}
//                                                         onPress={() => handleSelectLanguage(item)}
//                                                     >
//                                                         <Text style={styles.modalItemText}>{item.Description}</Text>
//                                                     </TouchableOpacity>
//                                                 )}
//                                                 keyExtractor={(item, index) => item.Code || index.toString()}
//                                             />
//                                         </View>
//                                     </View>
//                                 </TouchableWithoutFeedback>
//                             </Modal>

//                         </View>
//                     </View>
//                 </View>

//                 <View style={styles.bodyContainerBottom} />
//                 <View style={styles.registerContainer}>
//                     <View style={styles.registerInnerView}>
//                         <View style={{ marginHorizontal: 10 }}>
//                             <Image
//                                 resizeMode="contain"
//                                 source={{ uri: settings?.Message?.[0].Flash_Logo }}
//                                 style={styles.image}
//                             />
//                             <Text style={[styles.placeholder, {
//                                 textAlign: selectedLanguage === 'Arabic' ? 'right' : 'left'
//                             }]}
//                             >{getLabel('loginsrc_2')}</Text>
//                             <View style={styles.inputContainer}>
//                                 <TextInput
//                                     style={styles.inputs}
//                                     placeholder="Enter Username"
//                                     placeholderTextColor={Constants.COLOR.FONT_HINT}
//                                     value={userName}
//                                     editable={true}
//                                     maxLength={15}
//                                     underlineColorAndroid="transparent"
//                                     returnKeyType={'next'}
//                                     onSubmitEditing={() => passwordRef?.current?.focus()}
//                                     onChangeText={setUserName}
//                                 />
//                             </View>
//                             {userNameError ? (
//                                 <Text style={styles.errorText}>{userNameError}</Text>
//                             ) : null}

//                             <Text style={[styles.placeholder, {
//                                 textAlign: selectedLanguage === 'Arabic' ? 'right' : 'left'
//                             }]}
//                             >{getLabel('loginsrc_3')}</Text>
//                             <View style={styles.inputContainer}>
//                                 <TextInput
//                                     ref={passwordRef}
//                                     style={[styles.inputs, {
//                                         textAlign: selectedLanguage === 'Arabic' ? 'right' : 'left'
//                                     }]}
//                                     value={password}
//                                     placeholder='Enter Password'
//                                     placeholderTextColor={Constants.COLOR.FONT_HINT}
//                                     keyboardType="default"
//                                     secureTextEntry={!isPasswordVisible}
//                                     underlineColorAndroid="transparent"
//                                     autoCapitalize="none"
//                                     returnKeyType="done"
//                                     onChangeText={setPassword}
//                                     onSubmitEditing={validateInputs}
//                                 />
//                                 <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
//                                     <Image
//                                         source={isPasswordVisible ? require('../images/EyeView.png') : require('../images/EyeHidden.png')}
//                                         style={styles.eyeIcon}
//                                     />
//                                 </TouchableOpacity>
//                             </View>
//                             {passwordError ? (
//                                 <Text style={styles.errorText}>{passwordError}</Text>
//                             ) : null}

//                             <TouchableOpacity
//                                 style={styles.linkView}
//                                 onPress={forgotPassword}>
//                                 <Text style={styles.link}>{getLabel('loginsrc_4')}</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity onPress={validateInputs}>
//                                 <Text style={styles.button}>{getLabel('loginsrc_5')}</Text>
//                             </TouchableOpacity>

//                             {isError ? (
//                                 <Text style={styles.errorText}>Invalid username or password</Text>
//                             ) : null}

//                             <TouchableOpacity onPress={handleLoginThroughOtp}>
//                                 <Text style={styles.OTPbutton}>Login With OTP</Text>
//                             </TouchableOpacity>

//                             <Modal
//                                 transparent={true}
//                                 visible={isOtpModalVisible}
//                                 animationType="slide"
//                                 onRequestClose={() => setOtpModalVisible(false)}
//                             >
//                                 <TouchableWithoutFeedback onPress={() => setOtpModalVisible(false)}>
//                                     <View style={styles.modalOverlay}>
//                                         <View style={styles.otpModalContainer}>
//                                             <Text style={styles.otpHeading}>Enter OTP</Text>
//                                             <View style={styles.otpInputContainer}>
//                                                 {otp.map((digit, index) => (
//                                                     <TextInput
//                                                         key={index}
//                                                         style={styles.otpInput}
//                                                         keyboardType="numeric"
//                                                         maxLength={1}
//                                                         value={digit}
//                                                         onChangeText={(value) => handleOtpChange(value, index)}
//                                                         ref={(ref) => (otpRefs.current[index] = ref)}
//                                                         onKeyPress={({ nativeEvent }) => {
//                                                             if (nativeEvent.key === "Backspace" && !digit && index > 0) {
//                                                                 otpRefs.current[index - 1]?.focus();
//                                                             }
//                                                         }}
//                                                     />
//                                                 ))}
//                                             </View>
//                                             <TouchableOpacity onPress={handleSubmitOtp}>
//                                                 <Text style={styles.button}>Submit OTP</Text>
//                                             </TouchableOpacity>
//                                         </View>
//                                     </View>
//                                 </TouchableWithoutFeedback>
//                             </Modal>
//                             <View
//                                 style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//                                 <Text style={styles.version}>
//                                     {getLabel('loginsrc_6').replace('{version}', DeviceInfo.getVersion() || '1.0.0')}
//                                 </Text>

//                                 <Text style={styles.version}>{getLabel('loginsrc_7')}</Text>
//                             </View>
//                             <TouchableOpacity onPress={navigateRegistrationScreen}>
//                                 <Text style={styles.linkRegister}>
//                                     {getLabel('loginsrc_8')}
//                                 </Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </KeyboardAwareScrollView>
//         </SafeAreaView>
//     );
// };

// export default LoginScreen;



// const LoginScreen = ({ navigation }: any) => {
//     const [isPasswordVisible, setPasswordVisible] = useState(false);
//     const passwordRef = useRef<TextInput>(null);
//     const [isModalVisible, setModalVisible] = useState(false);
//     const [selectedLanguage, setSelectedLanguage] = useState("Select Language");
//     const [isOtpLogin, setOtpLogin] = useState(false);
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [otp, setOtp] = useState('');
//     const [otpRequested, setOtpRequested] = useState(false);
//     const [userName, setUserName] = useState('');
//     const [password, setPassword] = useState('');
//     const [userNameError, setUserNameError] = useState('');
//     const [passwordError, setPasswordError] = useState('');
//     const [isError, setIsError] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [alertVisible, setAlertVisible] = useState(false);
//     const [alertTitle, setAlertTitle] = useState('');
//     const [alertMessage, setAlertMessage] = useState('');
//     const { settings } = useAppSettings();
//     const { setUserData } = useUser();
//     const [loginAPIReq, LoginAPIRes] = useRefAppLoginMutation();

//     const passwordPolicyMessages = settings?.Message?.[0]?.Password_Policy_Message ?? [];
//     const language: { Code: string; Description: string }[] =
//         Array.isArray(settings?.Message?.[0]?.Languages)
//             ? settings?.Message?.[0]?.Languages.map(lang =>
//                 typeof lang === "object" && lang !== null ? lang : { Code: "", Description: "" })
//             : [];
//     const labels = settings?.Message?.[0]?.Labels || {};

//     const getLabel = (key: string) => {
//         return labels[key]?.defaultMessage || '';
//     };

//     useEffect(() => {
//         setLoading(LoginAPIRes.isLoading);

//         if (LoginAPIRes.isSuccess && LoginAPIRes.data.SuccessFlag === "true" && LoginAPIRes.data.Code === 200) {
//             const userData = LoginAPIRes.data.Message[0];
//             AsyncStorage.setItem('userData', JSON.stringify(userData));
//             setUserData(userData);
//             navigation.navigate('Bottom');
//         } else if (LoginAPIRes.isError && LoginAPIRes?.data?.Message) {
//             const errorMessage = LoginAPIRes?.data?.Message[0]?.Message || 'An error occurred';
//             setIsError(true);
//             showAlert('Error', errorMessage);
//         }
//     }, [LoginAPIRes, navigation]);

//     useEffect(() => {
//         const retrieveUserData = async () => {
//             const userData = await AsyncStorage.getItem('userData');
//             if (userData) {
//                 setUserData(JSON.parse(userData));
//             }
//         };
//         retrieveUserData();
//     }, [setUserData]);

//     const showAlert = (title: string, message: string) => {
//         setAlertTitle(title);
//         setAlertMessage(message);
//         setAlertVisible(true);
//     };

//     const closeAlert = () => {
//         setAlertVisible(false);
//     };

//     const validateInputs = async () => {
//         setUserNameError('');
//         setPasswordError('');
//         setIsError(false);
//         if (isOtpLogin) {
//             if (!otpRequested) {
//                 if (!phoneNumber || phoneNumber.length === 0) {
//                     setUserNameError('Phone Number is required');
//                 } else if (phoneNumber.length < 10) {
//                     setUserNameError('Phone Number should not be empty and must contain minimum 10 characters');
//                 } else {
//                     setOtpRequested(true);
//                     Alert.alert('OTP Sent', 'OTP has been sent to your phone number.');
//                 }
//             } else {
//                 if (!otp || otp.length === 0) {
//                     setUserNameError('OTP is required');
//                 } else {
//                     let loginReqObj = {
//                         PhoneNumber: phoneNumber,
//                         OTP: otp,
//                     };
//                     const response = await loginAPIReq(loginReqObj);
//                     console.log("Login API Request:", loginReqObj);
//                     console.log("Login API Response:", response);
//                 }
//             }
//         } else {
//             if (!userName || userName.length === 0) {
//                 setUserNameError('Mobile Number is required');
//             } else if (userName.length < 9) {
//                 setUserNameError('Mobile Number should not be empty and must contain minimum 10 characters');
//             } else if (!password || password.length === 0) {
//                 setPasswordError(passwordPolicyMessages[0]);
//             } else if (password.length < 8) {
//                 setPasswordError(passwordPolicyMessages[1]);
//             } else {
//                 let loginReqObj = {
//                     UserName: userName,
//                     Password: password,
//                 };
//                 const response = await loginAPIReq(loginReqObj);
//                 console.log("Login API Request:", loginReqObj);
//                 console.log("Login API Response:", response);
//             }
//         }
//     };

//     const handleForgotPasswordOrResendOtp = () => {
//         if (isOtpLogin && otpRequested) {
//             Alert.alert('Resend OTP', 'OTP has been resent.');
//         } else {
//             navigation.navigate('ForgotPassword');
//         }
//     };

//     const navigateTermsAndConditionScreen = () => {
//         Alert.alert('Registration', 'Navigate to registration screen');
//     };

//     const handleSelectLanguage = (language: { Code: string; Description: string }) => {
//         setSelectedLanguage(language.Description);
//         setModalVisible(false);
//     };

//     const togglePasswordVisibility = () => {
//         setPasswordVisible(!isPasswordVisible);
//     };

//     return (
//         <SafeAreaView style={styles.mainContainer}>
//             <KeyboardAwareScrollView>
//                 <View style={styles.bodyContainerTop}>
//                     <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-between", padding: 10 }}>
//                         <View style={styles.titleView}>
//                             <Text style={styles.title}>{getLabel('loginsrc_1')}</Text>
//                         </View>
//                         <View>
//                             <TouchableOpacity
//                                 style={[styles.dropdownButton, {}]}
//                                 onPress={() => setModalVisible(true)}
//                             >
//                                 <Text style={styles.dropdownButtonText}>{selectedLanguage}</Text>
//                                 <Image
//                                     style={styles.nextImage}
//                                     resizeMode="contain"
//                                     source={require('../images/arrowDown.png')}
//                                 />
//                             </TouchableOpacity>
//                             <Modal
//                                 transparent={true}
//                                 visible={isModalVisible}
//                                 animationType="fade"
//                                 onRequestClose={() => setModalVisible(false)}
//                             >
//                                 <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
//                                     <View style={styles.modalOverlay}>
//                                         <View style={styles.modalContainer}>
//                                             <FlatList
//                                                 data={language}
//                                                 renderItem={({ item }) => (
//                                                     <TouchableOpacity
//                                                         style={styles.modalItem}
//                                                         onPress={() => handleSelectLanguage(item)}
//                                                     >
//                                                         <Text style={styles.modalItemText}>{item.Description}</Text>
//                                                     </TouchableOpacity>
//                                                 )}
//                                                 keyExtractor={(item, index) => item.Code || index.toString()}
//                                             />
//                                         </View>
//                                     </View>
//                                 </TouchableWithoutFeedback>
//                             </Modal>
//                         </View>
//                     </View>
//                 </View>

//                 <View style={styles.bodyContainerBottom} />
//                 <View style={styles.registerContainer}>
//                     <View style={styles.registerInnerView}>
//                         <View style={{ marginHorizontal: 10 }}>
//                             <Image
//                                 resizeMode="contain"
//                                 source={{ uri: settings?.Message?.[0].Flash_Logo }}
//                                 style={styles.image}
//                             />

//                             <Text style={[styles.placeholder, {
//                                 textAlign: selectedLanguage === 'Arabic' ? 'right' : 'left'
//                             }]}
//                             >
//                                 {isOtpLogin ? getLabel('verifysrc_1') : getLabel('loginsrc_2')}
//                             </Text>

//                             {isOtpLogin ? (
//                                 <>
//                                     <View style={styles.inputContainer}>
//                                         <TextInput
//                                             style={styles.inputs}
//                                             placeholder="Enter Phone Number"
//                                             placeholderTextColor={Constants.COLOR.FONT_HINT}
//                                             value={phoneNumber}
//                                             editable={true}
//                                             maxLength={15}
//                                             keyboardType="numeric"
//                                             underlineColorAndroid="transparent"
//                                             returnKeyType={'next'}
//                                             onChangeText={setPhoneNumber}
//                                         />
//                                     </View>
//                                     {userNameError ? (
//                                         <Text style={styles.errorText}>{userNameError}</Text>
//                                     ) : null}

//                                     {otpRequested && (
//                                         <>
//                                             <Text style={[styles.placeholder, {
//                                                 textAlign: selectedLanguage === 'Arabic' ? 'right' : 'left'
//                                             }]}
//                                             >{getLabel('verifysrc_4')}</Text>
//                                             <View style={styles.inputContainer}>
//                                                 <TextInput
//                                                     style={styles.inputs}
//                                                     placeholder="Enter OTP"
//                                                     placeholderTextColor={Constants.COLOR.FONT_HINT}
//                                                     value={otp}
//                                                     editable={true}
//                                                     maxLength={6}
//                                                     underlineColorAndroid="transparent"
//                                                     keyboardType="numeric"
//                                                     returnKeyType={'done'}
//                                                     onChangeText={setOtp}
//                                                 />
//                                             </View>
//                                         </>
//                                     )}
//                                 </>
//                             ) : (
//                                 <>
//                                     <View style={styles.inputContainer}>
//                                         <TextInput
//                                             style={styles.inputs}
//                                             placeholder="Enter Username"
//                                             placeholderTextColor={Constants.COLOR.FONT_HINT}
//                                             value={userName}
//                                             editable={true}
//                                             maxLength={15}
//                                             underlineColorAndroid="transparent"
//                                             returnKeyType={'next'}
//                                             onSubmitEditing={() => passwordRef?.current?.focus()}
//                                             onChangeText={setUserName}
//                                         />
//                                     </View>
//                                     {userNameError ? (
//                                         <Text style={styles.errorText}>{userNameError}</Text>
//                                     ) : null}

//                                     <Text style={[styles.placeholder, {
//                                         textAlign: selectedLanguage === 'Arabic' ? 'right' : 'left'
//                                     }]}
//                                     >{getLabel('loginsrc_3')}</Text>
//                                     <View style={styles.inputContainer}>
//                                         <TextInput
//                                             ref={passwordRef}
//                                             style={[styles.inputs, {
//                                                 textAlign: selectedLanguage === 'Arabic' ? 'right' : 'left'
//                                             }]}
//                                             value={password}
//                                             placeholder='Enter Password'
//                                             placeholderTextColor={Constants.COLOR.FONT_HINT}
//                                             keyboardType="default"
//                                             secureTextEntry={!isPasswordVisible}
//                                             underlineColorAndroid="transparent"
//                                             autoCapitalize="none"
//                                             returnKeyType="done"
//                                             onChangeText={setPassword}
//                                             onSubmitEditing={validateInputs}
//                                         />
//                                         <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
//                                             <Image
//                                                 source={isPasswordVisible ? require('../images/EyeView.png') : require('../images/EyeHidden.png')}
//                                                 style={styles.eyeIcon}
//                                             />
//                                         </TouchableOpacity>
//                                     </View>
//                                     {passwordError ? (
//                                         <Text style={styles.errorText}>{passwordError}</Text>
//                                     ) : null}
//                                 </>
//                             )}

//                             {isOtpLogin ? (
//                                 otpRequested && (
//                                     <TouchableOpacity
//                                         style={styles.linkView}
//                                         onPress={handleForgotPasswordOrResendOtp}>
//                                         <Text style={styles.link}>
//                                             {getLabel('verifysrc_5')}
//                                         </Text>
//                                     </TouchableOpacity>
//                                 )
//                             ) : (
//                                 <TouchableOpacity
//                                     style={styles.linkView}
//                                     onPress={handleForgotPasswordOrResendOtp}>
//                                     <Text style={styles.link}>
//                                         {getLabel('loginsrc_4')}
//                                     </Text>
//                                 </TouchableOpacity>
//                             )}


//                             <TouchableOpacity onPress={validateInputs}>
//                                 <Text style={styles.button}>
//                                     {isOtpLogin ? (otpRequested ? 'Login' : 'Get OTP') : 'Login'}
//                                 </Text>
//                             </TouchableOpacity>

//                             {isError ? (
//                                 <Text style={styles.errorText}>Invalid username or password</Text>
//                             ) : null}

//                             <TouchableOpacity onPress={() => setOtpLogin(!isOtpLogin)}>
//                                 <Text style={styles.OTPbutton}>
//                                     {isOtpLogin ? 'Login With Password' : 'Login With OTP'}
//                                 </Text>
//                             </TouchableOpacity>

//                             <View
//                                 style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//                                 <Text style={styles.version}>
//                                     {getLabel('loginsrc_6').replace('{version}', DeviceInfo.getVersion() || '1.0.0')}
//                                 </Text>

//                                 <Text style={styles.version}>{getLabel('loginsrc_7')}</Text>
//                             </View>
//                             <TouchableOpacity onPress={navigateTermsAndConditionScreen}>
//                                 <Text style={styles.linkRegister}>
//                                     {getLabel('loginsrc_8')}
//                                 </Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </KeyboardAwareScrollView>

//             {/* Custom Alert Modal */}
//             <Modal
//                 transparent={true}
//                 visible={alertVisible}
//                 animationType="fade"
//                 onRequestClose={closeAlert}
//             >
//                 <TouchableWithoutFeedback onPress={closeAlert}>
//                     <View style={styles.modalOverlay}>
//                         <View style={styles.alertContainer}>
//                             <Text style={styles.alertTitle}>{alertTitle}</Text>
//                             <Text style={styles.alertMessage}>{alertMessage}</Text>
//                             <TouchableOpacity style={styles.alertButton} onPress={closeAlert}>
//                                 <Text style={styles.alertButtonText}>OK</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </TouchableWithoutFeedback>
//             </Modal>
//         </SafeAreaView>
//     );
// };

// export default LoginScreen;



const LoginScreen = ({ navigation }: any) => {
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const passwordRef = useRef<TextInput>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("Select Language");
    const [isOtpLogin, setOtpLogin] = useState(false);
    const [receivedOtp, setReceivedOtp] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [otpRequested, setOtpRequested] = useState(false);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [userNameError, setUserNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const { settings } = useAppSettings();
    const { userData, setUserData } = useUser();
    const [loginAPIReq, LoginAPIRes] = useRefAppLoginMutation();
    const [otpSendAPIReq] = useOtpSendMutation();

    const passwordPolicyMessages = settings?.Message?.[0]?.Password_Policy_Message ?? [];
    const language: { Code: string; Description: string }[] =
        Array.isArray(settings?.Message?.[0]?.Languages)
            ? settings?.Message?.[0]?.Languages.map(lang =>
                typeof lang === "object" && lang !== null ? lang : { Code: "", Description: "" })
            : [];
    const labels = settings?.Message?.[0]?.Labels || {};

    const getLabel = (key: string) => {
        return labels[key]?.defaultMessage || '';
    };

    useEffect(() => {
        setLoading(LoginAPIRes.isLoading);

        if (LoginAPIRes.isSuccess && LoginAPIRes.data.SuccessFlag === "true" && LoginAPIRes.data.Code === 200) {
            const userData = LoginAPIRes.data.Message[0];
            AsyncStorage.setItem('userData', JSON.stringify(userData));
            setUserData(userData);
            navigation.navigate('Bottom');
        } else if (LoginAPIRes.isError && LoginAPIRes?.data?.Message) {
            const errorMessage = LoginAPIRes?.data?.Message[0]?.Message || 'An error occurred';
            setIsError(true);
            showAlert('Error', errorMessage);
        }
    }, [LoginAPIRes, navigation]);

    useEffect(() => {
        const retrieveUserData = async () => {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                setUserData(JSON.parse(userData));
            }
        };
        retrieveUserData();
    }, [setUserData]);

    const showAlert = (title: string, message: string) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const closeAlert = () => {
        setAlertVisible(false);
    };

    const validateInputs = async () => {
        setUserNameError('');
        setPasswordError('');
        setIsError(false);
    
        if (isOtpLogin) {
            if (!otpRequested) {
                if (!phoneNumber || phoneNumber.length === 0) {
                    setUserNameError('Phone Number is required');
                } else if (phoneNumber.length < 10) {
                    setUserNameError('Phone Number should not be empty and must contain minimum 10 characters');
                } else {
                    try {
                        const response = await otpSendAPIReq({
                            UserCode: userData?.UserCode || '', 
                            UserType: userData?.UserType || '', 
                            Send_Type: 'M',
                            Mobile_No: phoneNumber,
                            Email_Id: userData?.Email || '', 
                        }).unwrap();
    
                        if (response.Code === 200) {
                            setOtpRequested(true);
                            Alert.alert('OTP Sent', 'OTP has been sent to your phone number.');
                        } else {
                            // showAlert('Error', response.Message || 'Failed to send OTP');
                        }
                    } catch (error) {
                        showAlert('Error', 'An error occurred while sending OTP');
                    }
                }
            } else {
                // Validate OTP
                if (!otp || otp.length === 0) {
                    setUserNameError('OTP is required');
                } else {
                    let loginReqObj = {
                        PhoneNumber: phoneNumber,
                        OTP: otp,
                    };
                    const response = await loginAPIReq(loginReqObj);
                    console.log("Login API Request:", loginReqObj);
                    console.log("Login API Response:", response);
                }
            }
        } else {
            // Validate username and password
            if (!userName || userName.length === 0) {
                setUserNameError('Mobile Number is required');
            } else if (userName.length < 9) {
                setUserNameError('Mobile Number should not be empty and must contain minimum 10 characters');
            } else if (!password || password.length === 0) {
                setPasswordError(passwordPolicyMessages[0]);
            } else if (password.length < 8) {
                setPasswordError(passwordPolicyMessages[1]);
            } else {
                let loginReqObj = {
                    UserName: userName,
                    Password: password,
                };
                const response = await loginAPIReq(loginReqObj);
                console.log("Login API Request:", loginReqObj);
                console.log("Login API Response:", response);
            }
        }
    };
    

   
    const handleForgotPasswordOrResendOtp = () => {
        if (isOtpLogin && otpRequested) {
            // Resend OTP
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

    const handleSelectLanguage = (language: { Code: string; Description: string }) => {
        setSelectedLanguage(language.Description);
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
                                <Text style={styles.dropdownButtonText}>{selectedLanguage}</Text>
                                <Image
                                    style={styles.nextImage}
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
                                                keyExtractor={(item, index) => item.Code || index.toString()}
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
                                textAlign: selectedLanguage === 'Arabic' ? 'right' : 'left'
                            }]}
                            >
                                {isOtpLogin ? getLabel('verifysrc_1') : getLabel('loginsrc_2')}
                            </Text>

                            {isOtpLogin ? (
                                <>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            style={styles.inputs}
                                            placeholder="Enter Phone Number"
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
                                                textAlign: selectedLanguage === 'Arabic' ? 'right' : 'left'
                                            }]}
                                            >{getLabel('verifysrc_4')}</Text>
                                            <View style={styles.inputContainer}>
                                                <TextInput
                                                    style={styles.inputs}
                                                    placeholder="Enter OTP"
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
                                            style={styles.inputs}
                                            placeholder="Enter Username"
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
                                        textAlign: selectedLanguage === 'Arabic' ? 'right' : 'left'
                                    }]}
                                    >{getLabel('loginsrc_3')}</Text>
                                    <View style={styles.inputContainer}>
                                        <TextInput
                                            ref={passwordRef}
                                            style={[styles.inputs, {
                                                textAlign: selectedLanguage === 'Arabic' ? 'right' : 'left'
                                            }]}
                                            value={password}
                                            placeholder='Enter Password'
                                            placeholderTextColor={Constants.COLOR.FONT_HINT}
                                            keyboardType="default"
                                            secureTextEntry={!isPasswordVisible}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="none"
                                            returnKeyType="done"
                                            onChangeText={setPassword}
                                            onSubmitEditing={validateInputs}
                                        />
                                        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIconContainer}>
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
                                    {isOtpLogin ? (otpRequested ? 'Login' : 'Get OTP') : 'Login'}
                                </Text>
                            </TouchableOpacity>

                            {isError ? (
                                <Text style={styles.errorText}>Invalid username or password</Text>
                            ) : null}

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
        backgroundColor: '#fefefe',
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
    titleView: {
        flexDirection: "row",
    },
    title: {
        fontSize: Constants.FONT_SIZE.XXL,
        fontWeight: 'bold',
        color: Constants.COLOR.WHITE_COLOR,
    },
    placeholder: {
        marginTop: 10,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 10,
        fontSize: Constants.FONT_SIZE.SM,
        color: '#404040',
        textAlign: 'left',
        fontWeight: 'bold',
    },
    button: {
        marginTop: 10,
        marginBottom: 10,
        textAlign: 'center',
        fontSize: Constants.FONT_SIZE.L,
        color: Constants.COLOR.WHITE_COLOR,
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
    OTPbutton: {
        marginTop: 10,
        marginBottom: 10,
        borderWidth: 0.5,
        textAlign: 'center',
        fontSize: Constants.FONT_SIZE.L,
        color: 'black',
        fontWeight: 'bold',
        borderColor: 'black',
        width: '100%',
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 13,
        paddingBottom: 13,
        borderRadius: 15,
        alignSelf: 'center',
        overflow: 'hidden',
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
        textAlign: 'center',
        marginVertical: 5,
    },
    linkRegister: {
        fontSize: Constants.FONT_SIZE.SM,
        color: "blue",
        textAlign: 'center',
        marginVertical: 10,
        textDecorationLine: 'underline',
    },
    version: {
        fontSize: Constants.FONT_SIZE.S,
        color: Constants.COLOR.BLACK_COLOR,
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
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 8,
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    dropdownButtonText: {
        color: "#333",
        marginRight: 10
    },
    nextImage: {
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

    otpModalContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        width: "80%",
    },
    otpHeading: {
        fontSize: 20,
        marginBottom: 20,
        textAlign: "center",
    },
    otpInputContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    otpInput: {
        width: 50,
        height: 50,
        borderBottomWidth: 2,
        textAlign: "center",
        fontSize: 24,
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
        borderBottomColor: '#e0e0e0',
        backgroundColor: '#e0e0e0',
        borderRadius: 25,
        paddingLeft: 10,
        color: 'black',
        fontSize: Constants.FONT_SIZE.SM,
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
    },
    errorText: {
        color: 'red',
        marginTop: 5,
        fontSize: Constants.FONT_SIZE.S,
    },
    alertContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        maxWidth: 400,
        alignItems: 'center',
        elevation: 5, // Add shadow on Android
        shadowColor: '#000', // Add shadow on iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
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
        backgroundColor: '#007BFF',
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


