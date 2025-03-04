// import React, { useState, useEffect } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     TextInput,
//     TouchableOpacity,
//     Dimensions,
//     ScrollView,
//     Alert,
// } from 'react-native';
// import NavigationBar from '../common/NavigationBar';
// import BookTestHeader from './BookTestHeader';
// import Constants from '../util/Constants';
// import NetInfo from '@react-native-community/netinfo';
// import ButtonBack from '../common/BackButton';
// import ButtonNext from '../common/NextButton';
// import { useServiceBookingMutation } from '../redux/service/ServiceBookingService';
// import { useUser } from '../common/UserContext';
// import { useAppSettings } from '../common/AppSettingContext';
// import { useBookingDetailMutation } from '../redux/service/BookingDetailService';

// const deviceHeight = Dimensions.get('window').height;

// interface Test {
//     Service_Name: string;
//     Amount: string;
//     TestType?: string;
//     TestCode?: string;
//     Service_Amount?: string;
//     Service_Discount?: string;
//     Primary_Share?: string;
//     Patient_Share?: string;
//     Test_VAT?: string;
//     Patient_VAT?: string;
//     Discount?: string;
//     VAT_Amount?: string;
//     Patient_Amount?: string;
// }

// interface BookingDetails {
//     Booking_No: string;
//     Pt_Code: string;
//     Visit_Date_Desc: string;
//     Pt_Name: string;
//     First_Age: string;
//     First_Age_Period: string;
//     Gender_Code: string;
//     Pt_Mobile_No: string;
//     Report_Status_Desc: string;
//     Booking_Status_Desc: string;
//     Service_Detail: ServiceDetail[];
// }

// interface ServiceDetail {
//     Service_Name: string;
//     Service_Amount: string;
// }

// const PaymentDetailScreen = ({ navigation, route, showHeader = true }: any) => {
//     const { userData } = useUser();
//     const {
//         selectedTests = [],
//         selectedDate,
//         selectedTime,
//         selectedPatientDetails,
//         testData,
//         booking,
//         selectedTestDetails,
//         showCancel = false,
//         fromBookingScreen = false
//     } = route?.params || {};
//     const { settings } = useAppSettings();
//     const [paymentMethod, setPaymentMethod] = useState('');
//     const [bookingResponse, setBookingResponse] = useState(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [isChecked, setIsChecked] = useState(false);
//     const [remark, setRemark] = useState('');
//     const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
//     const [bookingDetailAPIReq] = useBookingDetailMutation();

//     const labels = settings?.Message?.[0]?.Labels || {};

//     const getLabel = (key: string) => {
//         return labels[key]?.defaultMessage || '';
//     };

//     useEffect(() => {
//         const fetchBookingDetails = async () => {
//             if (fromBookingScreen) {
//                 const requestBody = {
//                     App_Type: "R",
//                     Username: userData?.UserCode,
//                     Booking_Type: "R",
//                     Firm_No: "01",
//                     Booking_Date: booking.Booking_Date,
//                     Booking_No: booking.Booking_No
//                 };

//                 const response = await bookingDetailAPIReq(requestBody);
//                 if (response.data && response.data.SuccessFlag === "true") {
//                     setBookingDetails(response.data.Message[0]);
//                 }
//             }
//         };

//         fetchBookingDetails();
//     }, [fromBookingScreen, booking, bookingDetailAPIReq, userData]);

//     const toggleCheckbox = () => {
//         setIsChecked(!isChecked);
//     };

//     const [serviceBookingAPIReq] = useServiceBookingMutation();

//     const handleUpdate = async () => {
//         setIsLoading(true);
//         const selectedTestDetails = selectedTests.map((test: Test) => {
//             const correspondingTestData = testData.find(
//                 (data: any) => data.Service_Name === test.Service_Name
//             );
//             return {
//                 TestType: correspondingTestData?.Service_Type,
//                 TestCode: correspondingTestData?.Service_Code,
//                 Service_Amount: correspondingTestData?.Amount,
//                 Service_Discount: correspondingTestData?.Discount_Amount,
//                 Primary_Share: correspondingTestData?.Primary_Share,
//                 Patient_Share: correspondingTestData?.Patient_Share,
//                 Test_VAT: correspondingTestData?.Test_VAT,
//                 Patient_VAT: correspondingTestData?.Patient_VAT,
//                 Aid_VAT: correspondingTestData?.Aid_VAT,
//                 T_Round_Off: correspondingTestData?.T_Round_off,
//                 Prof_Code: "",
//             };
//         });

//         const payload = {
//             Ref_Code: userData?.UserCode,
//             Ref_Type: userData?.UserType,
//             Pt_Code: selectedPatientDetails?.PtCode,
//             Firm_No: "01",
//             Name: selectedPatientDetails?.PtName,
//             Dob: selectedPatientDetails?.DOB,
//             Age: selectedPatientDetails?.Age,
//             Gender: selectedPatientDetails?.Gender,
//             Title_Code: selectedPatientDetails?.Title_Code,
//             Title_Desc: selectedPatientDetails?.Title_Desc,
//             Street: selectedPatientDetails?.Street,
//             Place: selectedPatientDetails?.Street,
//             City: selectedPatientDetails?.Street,
//             Email: selectedPatientDetails?.Email_Id,
//             Phone: selectedPatientDetails?.Mobile_No,
//             User_Id: "",
//             Paid_Amount: "0",
//             Bill_Amount: selectedTests?.Amount,
//             DiscountAmount: selectedTests?.Discount_Amount,
//             DueAmount: selectedTests?.T_Patient_Due,
//             Pay_No: "",
//             Pay_Status: "P",
//             Pay_Mode: paymentMethod === 'online' ? "O" : "C",
//             Zero_Payment: 0,
//             Promo_Code: "",
//             Medical_Aid_No: selectedPatientDetails?.Medical_Aid_No,
//             Coverage: "",
//             Package_Code: "",
//             Sponsor_Paid: "",
//             NationalityCode: selectedPatientDetails?.Nationality,
//             Prescription_File1: "2024-01-17010001.jpg",
//             Prescription_File2: null,
//             File_Extension1: "jpeg",
//             File_Extension2: "",
//             Sample_Collection_Date: selectedDate,
//             Sample_Collection_Time: selectedTime,
//             Services: selectedTestDetails,
//         };

//         console.log("payloaddddddddddddddd", payload);
//         console.log("selectedTestDetails", selectedTestDetails);
//         console.log("selectedTests", selectedTests);

//         try {
//             const response = await serviceBookingAPIReq(payload).unwrap();
//             if (response?.Code === 200 && response?.SuccessFlag === "true") {
//                 const message = response.Message[0]?.Description || 'Booking Successful';
//                 Alert.alert(message);
//                 setBookingResponse(response);
//                 console.log("---------response-------", response)
//                 navigation.navigate('Bottom', { bookingNo: response.Message[0]?.Booking_No, bookingResponse: response });
//             } else {
//                 Alert.alert('Error: Something went wrong.');
//             }
//         } catch (err) {
//             console.error(err);
//             Alert.alert('Error: Something went wrong.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleBack = async () => {
//         const state = await NetInfo.fetch();
//         if (!state.isConnected) {
//             Alert.alert(
//                 Constants.ALERT.TITLE.ERROR,
//                 Constants.VALIDATION_MSG.NO_INTERNET,
//             );
//             return;
//         }
//         navigation.goBack();
//     };

//     const handleNext = async () => {
//         const state = await NetInfo.fetch();
//         if (!state.isConnected) {
//             Alert.alert(
//                 Constants.ALERT.TITLE.ERROR,
//                 Constants.VALIDATION_MSG.NO_INTERNET,
//             );
//             return;
//         }
//         if (isChecked) {
//             Alert.alert(
//                 'Booking Cancelled',
//                 'Your booking has been cancelled.',
//                 [
//                     {
//                         text: 'OK',
//                         onPress: () => {
//                             navigation.navigate('Bottom');
//                         },
//                     },
//                 ],
//                 { cancelable: false }
//             );
//             return;
//         }
//         if (!paymentMethod) {
//             Alert.alert(
//                 Constants.ALERT.TITLE.INFO,
//                 Constants.VALIDATION_MSG.NO_PAYMENT_MSG,
//             ); return;
//         }
//         await handleUpdate();
//         navigation.navigate('FinalPayment', { selectedTests, selectedDate, selectedTime, selectedPatientDetails, testData, bookingResponse, selectedTestDetails });
//     };


//     const handleAddTest = () => {
//         const serviceDetails = bookingDetails?.Service_Detail.map(service => ({
//             Service_Name: service.Service_Name,
//             Service_Amount: service.Service_Amount,
//         }));

//         navigation.navigate('BookTestSearch', {
//             selectedTests,
//             selectedDate,
//             selectedTime,
//             selectedPatientDetails,
//             testData,
//             bookingResponse,
//             selectedTestDetails,
//             fromBookingScreen,
//             serviceDetails, // Pass the service details here
//         });
//     };

//     const calculateTotal = () => {
//         if (fromBookingScreen && bookingDetails) {
//             // Calculate totals using bookingDetails when coming from the booking screen
//             const serviceDetails = bookingDetails.Service_Detail;
//             const subTotal = serviceDetails.reduce((sum, service) => sum + parseFloat(service.Service_Amount), 0);
//             const discount = parseFloat(bookingDetails.Discount_Amount);
//             const vatAmount = parseFloat(bookingDetails.VAT_Amount);
//             const netAmount = parseFloat(bookingDetails.Net_Amount);
//             const patientAmount = parseFloat(bookingDetails.Patient_Due);

//             const netPayable = subTotal + vatAmount - discount;
//             return { subTotal, discount, vatAmount, netAmount, patientAmount, netPayable };
//         } else {
//             // Calculate totals using selectedTests when not coming from the booking screen
//             const amountDataDetails = selectedTests.map((test: any) => {
//                 const amountData = testData.find(
//                     (data: any) => data.Service_Name === test.Service_Name
//                 );

//                 if (!amountData) {
//                     console.warn(`No matching data found for ${test.Service_Name}`);
//                     return { subTotal: 0, discount: 0, vatAmount: 0, netAmount: 0, patientAmount: 0 };
//                 }

//                 return {
//                     subTotal: parseFloat(amountData?.T_Sub_Total) || 0,
//                     discount: parseFloat(amountData?.T_Discount_Amount) || 0,
//                     vatAmount: parseFloat(amountData?.T_VAT_Amount) || 0,
//                     netAmount: parseFloat(amountData?.T_Net_Amount) || 0,
//                     patientAmount: parseFloat(amountData?.T_Patient_Due) || 0,
//                 };
//             });

//             const totals = amountDataDetails.reduce((acc: any, item: any) => ({
//                 subTotal: acc.subTotal + item.subTotal,
//                 discount: acc.discount + item.discount,
//                 vatAmount: acc.vatAmount + item.vatAmount,
//                 netAmount: acc.netAmount + item.netAmount,
//                 patientAmount: acc.patientAmount + item.patientAmount,
//             }), { subTotal: 0, discount: 0, vatAmount: 0, netAmount: 0, patientAmount: 0 });

//             const netPayable = totals.subTotal + totals.vatAmount - totals.discount;
//             return { ...totals, netPayable };
//         }
//     };
//     // Usage in your component
//     const { subTotal, discount, vatAmount, netAmount, patientAmount, netPayable } = calculateTotal();

//     return (
//         <View style={styles.mainContainer}>
//             {showHeader && (
//                 <>
//                     <NavigationBar title="Payment" />
//                     <BookTestHeader selectValue={3} />
//                 </>
//             )}
//             <ScrollView style={{ paddingHorizontal: 10 }}>
//                 <View style={styles.cartSection}>
//                     <View style={styles.headerRow}>
//                         <Text style={styles.cartTitle}>{getLabel('labtpaydtls_1')}</Text>
//                         {fromBookingScreen && !isChecked && (
//                             <TouchableOpacity onPress={handleAddTest}>
//                                 <Text style={{ color: Constants.COLOR.THEME_COLOR }}>{getLabel('labtpaydtls_9')}</Text>
//                             </TouchableOpacity>
//                         )}
//                     </View>
//                     {fromBookingScreen && bookingDetails?.Service_Detail
//                         ? bookingDetails.Service_Detail.map((service: any, index: number) => (
//                             <View key={index} style={styles.cartItem}>
//                                 <Text style={styles.cartItemName} numberOfLines={2}>
//                                     {service.Service_Name}
//                                 </Text>
//                                 <Text style={styles.cartItemPrice}>
//                                     P {service.Service_Amount}
//                                 </Text>
//                             </View>
//                         ))
//                         : selectedTests.map((test: any, index: any) => (
//                             <View key={index} style={styles.cartItem}>
//                                 <Text style={styles.cartItemName} numberOfLines={2}>
//                                     {test.Service_Name}
//                                 </Text>
//                                 <Text style={styles.cartItemPrice}>
//                                     P {test.Amount}
//                                 </Text>
//                             </View>
//                         ))}
//                     <View style={styles.cartBreakdown}>
//                         <View style={styles.breakdownRow}>
//                             <Text style={styles.breakdownLabel}>{getLabel('labtsummary_6')}:</Text>
//                             <Text style={styles.breakdownValue}>P {subTotal.toFixed(2)}</Text>
//                         </View>
//                         <View style={styles.breakdownRow}>
//                             <Text style={styles.breakdownLabel}>{getLabel('bksumcol_3')}:</Text>
//                             <Text style={styles.breakdownValue}>- P {discount.toFixed(2)}</Text>
//                         </View>
//                         <View style={styles.breakdownRow}>
//                             <Text style={styles.breakdownLabel}>{getLabel('bksumcol_7')}:</Text>
//                             <Text style={styles.breakdownValue}>P {vatAmount.toFixed(2)}</Text>
//                         </View>
//                         <View style={styles.breakdownRow}>
//                             <Text style={styles.breakdownLabel}>{getLabel('bksumcol_5')}:</Text>
//                             <Text style={styles.breakdownValue}>P {netAmount.toFixed(2)}</Text>
//                         </View>
//                         <View style={styles.breakdownRow}>
//                             <Text style={styles.breakdownLabel}>{getLabel('sumbtn_11')}:</Text>
//                             <Text style={styles.breakdownValue}>- P {patientAmount}</Text>
//                         </View>
//                         <View style={[styles.breakdownRow, styles.netPayableRow]}>
//                             <Text style={styles.breakdownLabel}>{getLabel('sumbtn_17')}:</Text>
//                             <Text style={[styles.breakdownValue, styles.netPayableValue]}>P {netPayable.toFixed(2)}</Text>
//                         </View>
//                     </View>
//                 </View>

//                 {showCancel && (
//                     <>
//                         <View style={styles.CancelContainer}>
//                             <TouchableOpacity onPress={toggleCheckbox} style={styles.CancelCheckbox}>
//                                 {isChecked && <View style={styles.CancelChecked} />}
//                             </TouchableOpacity>
//                             <Text style={styles.CancelText}>Cancel</Text>
//                         </View>
//                         {isChecked && (
//                             <TextInput
//                                 style={styles.remarkInput}
//                                 placeholder="Enter remark"
//                                 value={remark}
//                                 onChangeText={setRemark}
//                             />
//                         )}
//                     </>
//                 )}
//                 {!showCancel && (
//                     <>
//                         <Text style={styles.paymentHeader}>Payment Mode</Text>
//                         <View style={styles.paymentContainer}>
//                             <TouchableOpacity
//                                 style={styles.paymentOption}
//                                 onPress={() => setPaymentMethod('online')}
//                             >
//                                 <View
//                                     style={[styles.radioButton, paymentMethod === 'online' && styles.radioSelected]}
//                                 />
//                                 <Text style={styles.paymentText}>Online Payment</Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity
//                                 style={styles.paymentOption}
//                                 onPress={() => setPaymentMethod('cash')}
//                             >
//                                 <View
//                                     style={[styles.radioButton, paymentMethod === 'cash' && styles.radioSelected]}
//                                 />
//                                 <Text style={styles.paymentText}>Cash Payment</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </>
//                 )}
//             </ScrollView>
//             <View style={[styles.navigationContainer, !fromBookingScreen && { justifyContent: 'space-between' }]}>
//                 {!fromBookingScreen && (
//                     <TouchableOpacity onPress={handleBack}>
//                         <ButtonBack />
//                     </TouchableOpacity>
//                 )}
//                 <TouchableOpacity onPress={handleNext}>
//                     <ButtonNext />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };

// export default PaymentDetailScreen;

// const styles = StyleSheet.create({
//     mainContainer: {
//         flex: 1,
//         backgroundColor: '#FBFBFB',
//     },
//     headerRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 10,
//     },
//     loaderContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     errorText: {
//         fontSize: 16,
//         color: '#FF0000',
//         textAlign: 'center',
//         marginTop: 20,
//     },
//     cartSection: {
//         marginTop: 10,
//     },
//     cartTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         marginBottom: 10,
//         color: Constants.COLOR.BLACK_COLOR,
//     },
//     cartItem: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         backgroundColor: '#f7f7f7',
//         padding: 10,
//     },
//     cartItemName: {
//         fontSize: 16,
//         color: '#4c6f86',
//         flex: 1,
//     },
//     cartItemPrice: {
//         fontSize: 16,
//         color: '#6f6f6f',
//     },
//     cartBreakdown: {
//         padding: 10,
//         backgroundColor: '#f2f2f2',
//     },
//     breakdownRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginVertical: 5,
//     },
//     breakdownLabel: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#4c6f86',
//     },
//     breakdownValue: {
//         fontSize: 16,
//         color: '#586992',
//     },
//     netPayableRow: {
//         borderTopWidth: 1,
//         borderTopColor: '#ccc',
//         paddingTop: 10,
//     },
//     netPayableValue: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#005DAB',
//     },
//     paymentHeader: {
//         fontSize: 16,
//         color: '#9D9D9D',
//         marginTop: 20,
//         fontFamily: 'Poppins-Regular',
//     },
//     paymentContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     paymentOption: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     radioButton: {
//         width: 20,
//         height: 20,
//         borderRadius: 10,
//         borderWidth: 1,
//         borderColor: Constants.COLOR.BLACK_COLOR,
//         marginRight: 10,
//     },
//     radioSelected: {
//         backgroundColor: Constants.COLOR.THEME_COLOR,
//     },
//     paymentText: {
//         fontSize: 16,
//         color: Constants.COLOR.BLACK_COLOR,
//     },
//     CancelContainer: {
//         flexDirection: 'row',
//         marginVertical: 10,
//         alignItems: 'center',
//     },
//     CancelCheckbox: {
//         width: 20,
//         height: 20,
//         borderWidth: 1,
//         borderColor: Constants.COLOR.BLACK_COLOR,
//         borderRadius: 5,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     CancelChecked: {
//         width: 12,
//         height: 12,
//         backgroundColor: Constants.COLOR.THEME_COLOR,
//         borderRadius: 2,
//     },
//     CancelText: {
//         marginLeft: 10,
//         fontSize: 16,
//         color: Constants.COLOR.BLACK_COLOR,
//     },
//     remarkInput: {
//         borderWidth: 1,
//         borderRadius: 5,
//         flex: 1,
//         padding: 10,
//         height: deviceHeight / 8,
//     },
//     navigationContainer: {
//         flexDirection: 'row',
//         justifyContent: 'flex-end',
//         marginTop: 20,
//     },
// });






import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Alert,
    Image,
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import BookTestHeader from './BookTestHeader';
import Constants from '../util/Constants';
import NetInfo from '@react-native-community/netinfo';
import ButtonBack from '../common/BackButton';
import ButtonNext from '../common/NextButton';
import ButtonHome from '../common/HomeButton';
import { useServiceBookingMutation } from '../redux/service/ServiceBookingService';
import { useUser } from '../common/UserContext';
import { useAppSettings } from '../common/AppSettingContext';
import { useBookingDetailMutation } from '../redux/service/BookingDetailService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { updateSelectedTest } from '../redux/slice/BookTestSearchSlice';


const deviceHeight = Dimensions.get('window').height;
const tickImage = require('../images/roundTick.png');


interface Test {
    Service_Name: string;
    Amount: string;
    TestType?: string;
    TestCode?: string;
    Service_Amount?: string;
    Service_Discount?: string;
    Primary_Share?: string;
    Patient_Share?: string;
    Test_VAT?: string;
    Patient_VAT?: string;
    Discount?: string;
    VAT_Amount?: string;
    Patient_Amount?: string;
}

interface BookingDetails {
    Booking_No: string;
    Pt_Code: string;
    Visit_Date_Desc: string;
    Pt_Name: string;
    First_Age: string;
    First_Age_Period: string;
    Gender_Code: string;
    Pt_Mobile_No: string;
    Report_Status_Desc: string;
    Booking_Status_Desc: string;
    Service_Detail: ServiceDetail[];
    Discount_Amount: string;
    VAT_Amount: string;
    Net_Amount: string;
    Patient_Due: string
}

interface ServiceDetail {
    Service_Name: string;
    Service_Amount: string;
}

const PaymentDetailScreen = ({ navigation, route, showHeader = true }: any) => {
    const { userData } = useUser();
    const dispatch = useDispatch();

    const { settings } = useAppSettings();
    const {
        selectedTests = [],
        selectedDate,
        selectedTime,
        selectedPatientDetails,
        testData,
        booking,
        selectedTestDetails,
        showCancel = false,
        fromBookingScreen = false
    } = route?.params || {};
    const [paymentMethod, setPaymentMethod] = useState('');
    const [bookingResponse, setBookingResponse] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [remark, setRemark] = useState('');
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
    const [isFinalPayment, setIsFinalPayment] = useState(false);
    const [bookingNo, setBookingNo] = useState('');
    const [bookingDetailAPIReq] = useBookingDetailMutation();
    const [serviceBookingAPIReq] = useServiceBookingMutation();

    const labels = settings?.Message?.[0]?.Labels || {};

    const getLabel = (key: string) => {
        return labels[key]?.defaultMessage || '';
    };

    const updatedCart = useSelector(
        (state: RootState) => state.bookTestSearch.updatedCartData
    );


    useEffect(() => {
        const fetchBookingDetails = async () => {
            if (fromBookingScreen) {
                const requestBody = {
                    App_Type: "R",
                    Username: userData?.UserCode,
                    Booking_Type: "R",
                    Firm_No: "01",
                    Booking_Date: booking.Booking_Date,
                    Booking_No: booking.Booking_No
                };

                const response = await bookingDetailAPIReq(requestBody);
                if (response.data && response.data.SuccessFlag === "true") {
                    setBookingDetails(response.data.Message[0]);
                }
            }
        };

        fetchBookingDetails();
    }, [fromBookingScreen, booking, bookingDetailAPIReq, userData]);

    const toggleCheckbox = () => {
        setIsChecked(!isChecked);
    };

    const handleUpdate = async () => {
        const selectedTestDetails = selectedTests.map((test: Test) => {
            const correspondingTestData = testData.find(
                (data: any) => data.Service_Name === test.Service_Name
            );

            if (!correspondingTestData) {
                console.error(`Test data not found for: ${test.Service_Name}`);
                return null; // Skip this test if data is not found
            }

            return {
                TestType: correspondingTestData?.Service_Type,
                TestCode: correspondingTestData?.Service_Code,
                Service_Amount: correspondingTestData?.Amount,
                Service_Discount: correspondingTestData?.Discount_Amount,
                Primary_Share: correspondingTestData?.Primary_Share,
                Patient_Share: correspondingTestData?.Patient_Share,
                Test_VAT: correspondingTestData?.Test_VAT,
                Patient_VAT: correspondingTestData?.Patient_VAT,
                Aid_VAT: correspondingTestData?.Aid_VAT,
                T_Round_Off: correspondingTestData?.T_Round_off,
                Prof_Code: "",
            };
        }).filter(Boolean);


        const payload = {
            Ref_Code: userData?.UserCode,
            Ref_Type: userData?.UserType,
            Pt_Code: selectedPatientDetails?.PtCode,
            Firm_No: "01",
            Name: selectedPatientDetails?.PtName,
            Dob: selectedPatientDetails?.DOB,
            Age: selectedPatientDetails?.Age,
            Gender: selectedPatientDetails?.Gender,
            Title_Code: selectedPatientDetails?.Title_Code,
            Title_Desc: selectedPatientDetails?.Title_Desc,
            Street: selectedPatientDetails?.Street,
            Place: selectedPatientDetails?.Street,
            City: selectedPatientDetails?.Street,
            Email: selectedPatientDetails?.Email_Id,
            Phone: selectedPatientDetails?.Mobile_No,
            User_Id: "",
            Paid_Amount: "0",
            Bill_Amount: updatedCart?.Amount,
            DiscountAmount: updatedCart?.Discount_Amount,
            DueAmount: updatedCart?.T_Patient_Due,
            Pay_No: "",
            Pay_Status: "P",
            Pay_Mode: paymentMethod === 'online' ? "O" : "C",
            Zero_Payment: 0,
            Promo_Code: "",
            Medical_Aid_No: selectedPatientDetails?.Medical_Aid_No,
            Coverage: "",
            Package_Code: "",
            Sponsor_Paid: "",
            NationalityCode: selectedPatientDetails?.Nationality,
            Prescription_File1: "2024-01-17010001.jpg",
            Prescription_File2: null,
            File_Extension1: "jpeg",
            File_Extension2: "",
            Sample_Collection_Date: selectedDate,
            Sample_Collection_Time: selectedTime,
            Services: selectedTestDetails,
        };
        console.log('%%%%%%%%%%%%%%%%%%%%payload', payload);


        try {
            const response = await serviceBookingAPIReq(payload).unwrap();
            console.log('%%%%%%%%%%%%%%%%%%%%response', response);
            if (response?.Code === 200 && response?.SuccessFlag === "true") {
                const message = response.Message[0]?.Description || 'Booking Successful';
                Alert.alert(message);
                setBookingResponse(response);
                setBookingNo(response.Message[0]?.Booking_No);
                setIsFinalPayment(true);
            } else {
                Alert.alert('Error: Something went wrong.');
            }
        } catch (err) {
            Alert.alert('Error: Something went wrong.');
        } finally {
        }
    };


    const handleBack = async () => {
        const state = await NetInfo.fetch();
        if (!state.isConnected) {
            Alert.alert(
                Constants.ALERT.TITLE.ERROR,
                Constants.VALIDATION_MSG.NO_INTERNET,
            );
            return;
        }
        navigation.goBack();
    };

    const handleNext = async () => {
        const state = await NetInfo.fetch();
        if (!state.isConnected) {
            Alert.alert(
                Constants.ALERT.TITLE.ERROR,
                Constants.VALIDATION_MSG.NO_INTERNET,
            );
            return;
        }
        if (isChecked) {
            Alert.alert(
                'Booking Cancelled',
                'Your booking has been cancelled.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            navigation.navigate('Bottom');
                        },
                    },
                ],
                { cancelable: false }
            );
            return;
        }
        if (!paymentMethod) {
            Alert.alert(
                Constants.ALERT.TITLE.INFO,
                Constants.VALIDATION_MSG.NO_PAYMENT_MSG,
            ); return;
        }
        await handleUpdate();
    };

    const handleAddTest = () => {
        const serviceDetails = bookingDetails?.Service_Detail.map(service => ({
            Service_Name: service.Service_Name,
            Service_Amount: service.Service_Amount,
        }));

        navigation.navigate('BookTestSearch', {
            selectedTests,
            selectedDate,
            selectedTime,
            selectedPatientDetails,
            testData,
            bookingResponse,
            selectedTestDetails,
            fromBookingScreen,
            serviceDetails,
        });
    };

    const calculateTotal = () => {
        if (fromBookingScreen && bookingDetails) {
            const serviceDetails = bookingDetails.Service_Detail;
            const subTotal = serviceDetails.reduce((sum, service) => sum + parseFloat(service.Service_Amount), 0);
            const discount = parseFloat(bookingDetails.Discount_Amount);
            const vatAmount = parseFloat(bookingDetails.VAT_Amount);
            const netAmount = parseFloat(bookingDetails.Net_Amount);
            const patientAmount = parseFloat(bookingDetails.Patient_Due);

            const netPayable = subTotal + vatAmount - discount;
            return { subTotal, discount, vatAmount, netAmount, patientAmount, netPayable };
        } else {
            const amountDataDetails = updatedCart.map((test: Test) => {
                const amountData = updatedCart.find(
                    (data: any) => data.Service_Name === test.Service_Name
                );

                if (!amountData) {
                    console.warn(`No matching data found for ${test.Service_Name}`);
                    return { subTotal: 0, discount: 0, vatAmount: 0, netAmount: 0, patientAmount: 0 };
                }

                return {
                    subTotal: parseFloat(amountData?.T_Sub_Total) || 0,
                    discount: parseFloat(amountData?.T_Discount_Amount) || 0,
                    vatAmount: parseFloat(amountData?.T_VAT_Amount) || 0,
                    netAmount: parseFloat(amountData?.T_Net_Amount) || 0,
                    patientAmount: parseFloat(amountData?.T_Patient_Due) || 0,
                };
            });

            const totals = amountDataDetails.reduce((acc: any, item: any) => ({
                subTotal: acc.subTotal + item.subTotal,
                discount: acc.discount + item.discount,
                vatAmount: acc.vatAmount + item.vatAmount,
                netAmount: acc.netAmount + item.netAmount,
                patientAmount: acc.patientAmount + item.patientAmount,
            }), { subTotal: 0, discount: 0, vatAmount: 0, netAmount: 0, patientAmount: 0 });

            const netPayable = totals.subTotal + totals.vatAmount - totals.discount;
            return { ...totals, netPayable };
        }
    };

    const { subTotal, discount, vatAmount, netAmount, patientAmount, netPayable } = calculateTotal();

    const AmountToBePaid = ({ amount }: any) => {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{getLabel('cashpaysuc_4')}</Text>
                <Text style={styles.amount}>P {amount}</Text>
            </View>
        );
    };

    const handleFinalPaymentUpdate = async () => {
        try {
            navigation.navigate('Bottom');
            // dispatch(updateSelectedTest([]));
        } catch (error) {
            Alert.alert("Error", "There was an issue processing the payment.");
        }
    };

    return (
        <View style={styles.mainContainer}>
            {showHeader && (
                <>
                    <NavigationBar title="Payment" />
                    <BookTestHeader selectValue={3} />
                </>
            )}
            {isFinalPayment ? (
                <ScrollView style={{ paddingHorizontal: 10 }}>
                    <View style={styles.headerContainer}>
                        <Image source={tickImage} style={styles.tickImage} />
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle}>{getLabel('cashpaysuc_1')}</Text>
                            <Text style={styles.bookingId}>Booking No : {bookingNo}</Text>
                        </View>
                    </View>
                    <View>
                        <AmountToBePaid amount={netPayable.toFixed(2)} />
                    </View>

                    <View style={styles.selectedTestsSection}>
                        <View style={styles.cartSection}>
                            <Text style={styles.cartTitle}>{getLabel('cashpaysuc_3')}</Text>
                            {updatedCart.map((test, index) => {
                                console.log('TEEEEEESSSSST', test)
                                // const correspondingTestData = testData.find(
                                //     (data: { Service_Name: any; }) => data.Service_Name === test.Service_Name
                                // );
                                return (
                                    <View key={index} style={styles.cartItem}>
                                        <Text style={styles.cartItemName} numberOfLines={2}>
                                            {test?.Service_Name}
                                        </Text>
                                        <Text style={styles.cartItemPrice}>
                                            P {test?.Amount}
                                        </Text>
                                    </View>
                                );
                            })}
                            <View style={styles.cartBreakdown}>
                                <View style={styles.breakdownRow}>
                                    <Text style={styles.breakdownLabel}>{getLabel('labtsummary_6')}</Text>
                                    <Text style={styles.breakdownValue}>P{subTotal.toFixed(2)}</Text>
                                </View>
                                <View style={styles.breakdownRow}>
                                    <Text style={styles.breakdownLabel}>{getLabel('bksumcol_3')}</Text>
                                    <Text style={styles.breakdownValue}>- P {discount.toFixed(2)}</Text>
                                </View>
                                <View style={styles.breakdownRow}>
                                    <Text style={styles.breakdownLabel}>{getLabel('bksumcol_7')}</Text>
                                    <Text style={styles.breakdownValue}>P {vatAmount.toFixed(2)}</Text>
                                </View>
                                <View style={styles.breakdownRow}>
                                    <Text style={styles.breakdownLabel}>{getLabel('bksumcol_5')}</Text>
                                    <Text style={styles.breakdownValue}>P {netAmount.toFixed(2)}</Text>
                                </View>
                                <View style={styles.breakdownRow}>
                                    <Text style={styles.breakdownLabel}>{getLabel('sumbtn_11')}</Text>
                                    <Text style={styles.breakdownValue}>- P {patientAmount.toFixed(2)}</Text>
                                </View>
                                <View style={[styles.breakdownRow, styles.netPayableRow]}>
                                    <Text style={styles.breakdownLabel}>Net Payable Amount:</Text>
                                    <Text style={[styles.breakdownValue, styles.netPayableValue]}>P {netPayable.toFixed(2)}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.patientDetailsSection}>
                        <View style={styles.patientDetailsRow}>
                            <Text style={styles.patientDetailsLabelName}>
                                Name: {selectedPatientDetails?.PtName || selectedPatientDetails?.Pt_Name}
                            </Text>
                        </View>
                        <View style={styles.patientDetailsRow}>
                            <Text style={styles.patientDetailsLabel}>
                                {`${selectedPatientDetails?.State}, ${selectedPatientDetails?.Place}, ${selectedPatientDetails?.Street1}`}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.patientDetailsRowDateTime}>
                        <Text style={styles.patientDetailsLabel}>
                            Collect Date & Time: {selectedDate} {' '} {selectedTime}
                        </Text>
                    </View>

                    <TouchableOpacity onPress={handleFinalPaymentUpdate} style={styles.HomeButton}>
                        <ButtonHome />
                    </TouchableOpacity>
                </ScrollView>
            ) : (
                <ScrollView style={{ paddingHorizontal: 10 }}>
                    <View style={styles.cartSection}>
                        <View style={styles.headerRow}>
                            <Text style={styles.cartTitle}>{getLabel('labtpaydtls_1')}</Text>
                            {fromBookingScreen && !isChecked && (
                                <TouchableOpacity onPress={handleAddTest}>
                                    <Text style={{ color: Constants.COLOR.THEME_COLOR }}>{getLabel('labtpaydtls_9')}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        {fromBookingScreen && bookingDetails?.Service_Detail
                            ? bookingDetails.Service_Detail.map((service, index) => (
                                <View key={index} style={styles.cartItem}>
                                    <Text style={styles.cartItemName} numberOfLines={2}>
                                        {service.Service_Name}
                                    </Text>
                                    <Text style={styles.cartItemPrice}>
                                        P {service.Service_Amount}
                                    </Text>
                                </View>
                            ))
                            : updatedCart.map((test: { Service_Name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; Amount: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }, index: React.Key | null | undefined) => (
                                <View key={index} style={styles.cartItem}>
                                    <Text style={styles.cartItemName} numberOfLines={2}>
                                        {test.Service_Name}
                                    </Text>
                                    <Text style={styles.cartItemPrice}>
                                        P {test.Amount}
                                    </Text>
                                </View>
                            ))}
                        <View style={styles.cartBreakdown}>
                            <View style={styles.breakdownRow}>
                                <Text style={styles.breakdownLabel}>{getLabel('labtsummary_6')}:</Text>
                                <Text style={styles.breakdownValue}>P {subTotal.toFixed(2)}</Text>
                            </View>
                            <View style={styles.breakdownRow}>
                                <Text style={styles.breakdownLabel}>{getLabel('bksumcol_3')}:</Text>
                                <Text style={styles.breakdownValue}>- P {discount.toFixed(2)}</Text>
                            </View>
                            <View style={styles.breakdownRow}>
                                <Text style={styles.breakdownLabel}>{getLabel('bksumcol_7')}:</Text>
                                <Text style={styles.breakdownValue}>P {vatAmount.toFixed(2)}</Text>
                            </View>
                            <View style={styles.breakdownRow}>
                                <Text style={styles.breakdownLabel}>{getLabel('bksumcol_5')}:</Text>
                                <Text style={styles.breakdownValue}>P {netAmount.toFixed(2)}</Text>
                            </View>
                            <View style={styles.breakdownRow}>
                                <Text style={styles.breakdownLabel}>{getLabel('sumbtn_11')}:</Text>
                                <Text style={styles.breakdownValue}>- P {patientAmount}</Text>
                            </View>
                            <View style={[styles.breakdownRow, styles.netPayableRow]}>
                                <Text style={styles.breakdownLabel}>{getLabel('sumbtn_17')}:</Text>
                                <Text style={[styles.breakdownValue, styles.netPayableValue]}>P {netPayable.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>

                    {showCancel && (
                        <>
                            <View style={styles.CancelContainer}>
                                <TouchableOpacity onPress={toggleCheckbox} style={styles.CancelCheckbox}>
                                    {isChecked && <View style={styles.CancelChecked} />}
                                </TouchableOpacity>
                                <Text style={styles.CancelText}>Cancel</Text>
                            </View>
                            {isChecked && (
                                <TextInput
                                    style={styles.remarkInput}
                                    placeholder="Enter remark"
                                    value={remark}
                                    onChangeText={setRemark}
                                />
                            )}
                        </>
                    )}
                    {!showCancel && (
                        <>
                            <Text style={styles.paymentHeader}>Payment Mode</Text>
                            <View style={styles.paymentContainer}>
                                <TouchableOpacity
                                    style={styles.paymentOption}
                                    onPress={() => setPaymentMethod('online')}
                                >
                                    <View
                                        style={[styles.radioButton, paymentMethod === 'online' && styles.radioSelected]}
                                    />
                                    <Text style={styles.paymentText}>Online Payment</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.paymentOption}
                                    onPress={() => setPaymentMethod('cash')}
                                >
                                    <View
                                        style={[styles.radioButton, paymentMethod === 'cash' && styles.radioSelected]}
                                    />
                                    <Text style={styles.paymentText}>Cash Payment</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </ScrollView>
            )}
            {!isFinalPayment && (
                <View style={[styles.navigationContainer, !fromBookingScreen && { justifyContent: 'space-between' }]}>
                    {!fromBookingScreen && (
                        <TouchableOpacity onPress={handleBack}>
                            <ButtonBack />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={handleNext}>
                        <ButtonNext />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FBFBFB',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#FF0000',
        textAlign: 'center',
        marginTop: 20,
    },
    cartSection: {
        marginTop: 10,
    },
    cartTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: Constants.COLOR.BLACK_COLOR,
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f7f7f7',
        padding: 10,
    },
    cartItemName: {
        fontSize: 16,
        color: '#4c6f86',
        flex: 1,
    },
    cartItemPrice: {
        fontSize: 16,
        color: '#6f6f6f',
    },
    cartBreakdown: {
        padding: 10,
        backgroundColor: '#f2f2f2',
    },
    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    breakdownLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4c6f86',
    },
    breakdownValue: {
        fontSize: 16,
        color: '#586992',
    },
    netPayableRow: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 10,
    },
    netPayableValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#005DAB',
    },
    paymentHeader: {
        fontSize: 16,
        color: '#9D9D9D',
        marginTop: 20,
        fontFamily: 'Poppins-Regular',
    },
    paymentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Constants.COLOR.BLACK_COLOR,
        marginRight: 10,
    },
    radioSelected: {
        backgroundColor: Constants.COLOR.THEME_COLOR,
    },
    paymentText: {
        fontSize: 16,
        color: Constants.COLOR.BLACK_COLOR,
    },
    CancelContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        alignItems: 'center',
    },
    CancelCheckbox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: Constants.COLOR.BLACK_COLOR,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    CancelChecked: {
        width: 12,
        height: 12,
        backgroundColor: Constants.COLOR.THEME_COLOR,
        borderRadius: 2,
    },
    CancelText: {
        marginLeft: 10,
        fontSize: 16,
        color: Constants.COLOR.BLACK_COLOR,
    },
    remarkInput: {
        borderWidth: 1,
        borderRadius: 5,
        flex: 1,
        padding: 10,
        height: deviceHeight / 8,
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    container: {
        marginTop: 10,
        backgroundColor: Constants.COLOR.THEME_COLOR,
        padding: 20,
        borderRadius: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
    },
    tickImage: {
        width: 30,
        height: 30,
        marginRight: 10,
        resizeMode: 'contain'
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Constants.COLOR.BLACK_COLOR,
    },
    bookingId: {
        fontSize: 14,
        color: '#555',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Constants.COLOR.WHITE_COLOR,
        alignSelf: 'center',
    },
    amount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Constants.COLOR.WHITE_COLOR,
        alignSelf: 'center',
    },
    selectedTestsSection: {
        marginTop: 10,
        padding: 15,
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
    },
    selectedTestsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    testItem: {
        marginBottom: 5,
    },
    testItemText: {
        fontSize: 14,
    },
    noTestsText: {
        fontSize: 14,
        color: 'gray',
    },
    patientDetailsSection: {
        marginTop: 10,
        padding: 15,
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
    },
    patientDetailsRow: {
        marginTop: 10
    },
    patientDetailsRowDateTime: {
        backgroundColor: "white",
        padding: 16,
    },
    patientDetailsLabel: {
        fontSize: 14,
    },
    patientDetailsLabelName: {
        fontSize: 14,
        fontWeight: "bold"
    },
    HomeButton: {
        backgroundColor: '#040619',
        alignItems: 'center',
        borderRadius: 25,
        marginTop: 15,
        alignSelf: 'center',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 1.0,
        elevation: 6,
        shadowRadius: 15,
        marginBottom: 35,
    },
});

export default PaymentDetailScreen;
