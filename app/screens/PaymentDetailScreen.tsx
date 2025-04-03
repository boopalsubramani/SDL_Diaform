
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
    I18nManager,
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
import { useServiceBookingCancelMutation } from '../redux/service/ServiceBookingCancelService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearCart } from '../redux/slice/BookTestSearchSlice';

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
    Booking_Date: string;
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

interface Language {
    Alignment: 'ltr' | 'rtl';
}

const PaymentDetailScreen = ({ navigation, route, showHeader = true }: any) => {
    const { userData, imageBase64 } = useUser();
    const dispatch = useDispatch();
    const { settings, labels } = useAppSettings();
    const {
        selectedTests = [],
        selectedDate,
        selectedTime,
        selectedPatientDetails,
        patientData,
        testData,
        booking,
        selectedTestDetails,
        showCancel = false,
        fromBookingScreen = false,
        imageUri,
        fromPaymentDetailsScreen = false,
    } = route?.params || {};
    const [paymentMethod, setPaymentMethod] = useState('');
    const [bookingResponse, setBookingResponse] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [remark, setRemark] = useState('');
    const [bookingDetails, setBookingDetails] = useState(null);
    const [isFinalPayment, setIsFinalPayment] = useState(false);
    const [bookingNo, setBookingNo] = useState('');
    const [bookingDetailAPIReq] = useBookingDetailMutation();
    const [serviceBookingAPIReq] = useServiceBookingMutation();
    const [serviceBookingCancelApiReq] = useServiceBookingCancelMutation();
    const updatedCart = useSelector(
        (state: RootState) => state.bookTestSearch.updatedCartData
    );
    const bookingItems = useSelector((state: RootState) => state.bookTestSearch.bookingDetails) || [];
    const handleBookingDetail = useSelector((state: RootState) => state.bookTestSearch.handleBookingDetailState) || null;
    const selectedLanguage = useSelector((state: RootState) => state.appSettings.selectedLanguage) as Language | null;

    useEffect(() => {
        console.log(handleBookingDetail, "handleBookingDetail")
    }, [route?.params]);

    useEffect(() => {
        I18nManager.forceRTL(selectedLanguage?.Alignment === 'rtl');
    }, [selectedLanguage]);

    const getLabel = (key: string) => {
        return labels[key]?.defaultMessage || '';
    };

    useEffect(() => {
        const fetchBookingDetails = async () => {
            if (fromBookingScreen || fromPaymentDetailsScreen) {
                const requestBody = {
                    App_Type: "R",
                    Username: userData?.UserCode,
                    Booking_Type: "R",
                    Firm_No: userData?.Branch_Code,
                    Booking_Date: booking.Booking_Date,
                    Booking_No: booking.Booking_No
                };

                const response = await bookingDetailAPIReq(requestBody);
                console.log('API Response:', response);
                if (response.data && response.data.SuccessFlag === "true") {
                    setBookingDetails(response.data.Message[0]);
                }
            }
        };
        fetchBookingDetails();
    }, [fromBookingScreen, fromPaymentDetailsScreen, booking, bookingDetailAPIReq, userData]);


    useEffect(() => {
        console.log("Current booking state:", booking);
    }, [booking]);

    const toggleCheckbox = () => {
        setIsChecked(!isChecked);
    };

    const handleUpdate = async () => {
        setIsLoading(true);
        const validPatientData = patientData || {};
        const mergedPatient = {
            PtCode: selectedPatientDetails?.PtCode || validPatientData?.Pt_Code || handleBookingDetail?.booking?.Pt_Code || '',
            Name: selectedPatientDetails?.PtName || validPatientData?.Pt_Name || handleBookingDetail?.booking?.Pt_Name || "Unknown",
            Dob: validPatientData?.Dob ? validPatientData.Dob.replace(/\//g, "-") : selectedPatientDetails?.DOB || handleBookingDetail?.booking?.Pt_Dob || "",
            Age: selectedPatientDetails?.Age || validPatientData?.Age || handleBookingDetail?.booking?.Pt_First_Age || '0',
            Gender: selectedPatientDetails?.Gender || validPatientData?.Gender || handleBookingDetail?.booking?.Pt_Gender || "",
            Title_Code: selectedPatientDetails?.Title_Code || handleBookingDetail?.booking?.Pt_Title_Code || "",
            Title_Desc: selectedPatientDetails?.Title_Desc || handleBookingDetail?.booking?.Pt_Title_Desc || "MR.",
            Phone: selectedPatientDetails?.Mobile_No || validPatientData?.Mobile_No || handleBookingDetail?.booking?.Pt_Mobile_No || "",
            NationalityCode: selectedPatientDetails?.Nationality || handleBookingDetail?.booking?.Pt_Title_Code || "",
            Place: selectedPatientDetails?.Place || validPatientData?.Place || "",
            City: selectedPatientDetails?.City || validPatientData?.Street || "",
            Email: selectedPatientDetails?.Email_Id || handleBookingDetail?.booking?.Pt_Email_Id || "",
        };
        console.log("Merged Patient Details:", mergedPatient);
        if (!mergedPatient.Name || !mergedPatient.Gender || !mergedPatient.Age) {
            Alert.alert("Error", "Mandatory fields Name and Gender are missing.");
            setIsLoading(false);
            return;
        }
        const formData = new FormData();
        formData.append("Ref_Code", userData?.UserCode);
        formData.append("Ref_Type", userData?.UserType);
        formData.append("Pt_Code", mergedPatient.PtCode);
        formData.append("Firm_No", userData?.Branch_Code);
        formData.append("Name", mergedPatient.Name);
        formData.append("Dob", mergedPatient.Dob);
        formData.append("Age", mergedPatient.Age);
        formData.append("Gender", mergedPatient.Gender);
        formData.append("Title_Code", mergedPatient.Title_Code);
        formData.append("Title_Desc", mergedPatient.Title_Desc);
        formData.append("Phone", mergedPatient.Phone);
        formData.append("NationalityCode", mergedPatient.NationalityCode);
        formData.append("File_Extension1", "png");
        formData.append("Paid_Amount", "100");
        formData.append("Bill_Amount", "530.0");
        formData.append("Pay_No", "6548561564154");
        formData.append("Pay_Status", "C");
        formData.append("Pay_Mode", paymentMethod === 'online' ? "O" : "C");
        formData.append("Zero_Payment", "1");
        formData.append("Place", mergedPatient.Place);
        formData.append("City", mergedPatient.City);
        formData.append("Email", mergedPatient.Email);
        formData.append("Prescription_File1", imageBase64);
        if (fromPaymentDetailsScreen && handleBookingDetail) {
            formData.append("Service_No", handleBookingDetail?.booking?.Booking_No);
            formData.append("Service_Date", handleBookingDetail?.booking?.Booking_Date);
        }
        const newTests = (fromPaymentDetailsScreen ? bookingItems : updatedCart).map(test => ({
            TESTTYPE: 'T',
            TESTCODE: test?.Service_Code,
            SERVICE_AMOUNT: test?.Service_Amount || test?.Amount,
            SERVICE_DISCOUNT: test?.Discount_Amount,
            PRIMARY_SHARE: test?.Primary_Share,
            PATIENT_SHARE: test?.Patient_Share,
            TEST_VAT: test?.Test_VAT,
            PATIENT_VAT: test?.Patient_VAT,
            AID_VAT: test?.Aid_VAT,
            T_ROUND_OFF: test?.T_Round_off,
            PROF_CODE: test?.Service_Code,
        }));
        const finalTests = newTests.filter((test, index, self) =>
            index === self.findIndex(t => t.TESTCODE === test.TESTCODE)
        );
        console.log('Final Tests (After Fixing):', JSON.stringify(finalTests, null, 2));
        formData.append("Services", JSON.stringify(finalTests));
        try {
            const response = await serviceBookingAPIReq(formData).unwrap();
            if (response?.Code === 200 && response?.SuccessFlag === "true") {
                const successMessage = fromPaymentDetailsScreen
                    ? "Booking Updated Successfully"
                    : response.Message[0]?.Description || "Booking Successful";
                Alert.alert(successMessage);
                setBookingResponse(response);
                setBookingNo(response.Message[0]?.Booking_No);
                setIsFinalPayment(true);
            } else {
                Alert.alert(`Error: ${response?.Message[0]?.Message || "Something went wrong."}`);
            }
        } catch (error) {
            console.error("API Error:", JSON.stringify(error));
            Alert.alert("Error", "Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };


    const handleCancelBooking = async () => {
        setIsLoading(true);
        const requestBody = {
            Ref_Code: userData?.UserCode,
            Ref_Type: userData?.UserType,
            Firm_No: userData?.Branch_Code,
            Service_No: bookingDetails?.Booking_No,
            Service_Date: bookingDetails?.Booking_Date,
            Cancel_Remarks: remark
        };
        try {
            const response = await serviceBookingCancelApiReq(requestBody).unwrap();
            if (response?.Code === 200 && response?.SuccessFlag === "true") {
                Alert.alert("Booking Cancelled", response.Message[0]?.Description);
                navigation.navigate('Bottom');
            } else {
                Alert.alert("Error", "Failed to cancel the booking.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Something went wrong!");
        } finally {
            setIsLoading(false);
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
            await handleCancelBooking();
            return;
        }
        if (settings?.Enable_Paymode === 'Y' && !paymentMethod) {
            Alert.alert(
                Constants.ALERT.TITLE.INFO,
                Constants.VALIDATION_MSG.NO_PAYMENT_MSG,
            );
            return;
        }
        await handleUpdate();
    };

    const handleAddTest = () => {
        navigation.navigate('BookTestSearch', {
            selectedTests,
            selectedDate,
            selectedTime,
            selectedPatientDetails,
            testData,
            bookingResponse,
            selectedTestDetails,
            fromBookingScreen,
            bookingDetails,
            fromPaymentDetailsScreen: true,
        });
    };

    const calculateTotal = () => {
        if (fromBookingScreen && bookingDetails) {
            const serviceDetails = bookingDetails.Service_Detail;
            const subTotal = serviceDetails.reduce((sum, service) => sum + parseFloat(service.Service_Amount || 0), 0);
            const discount = parseFloat(bookingDetails.Discount_Amount) || 0;
            const vatAmount = serviceDetails.reduce((sum, service) => {
                const vat = parseFloat(service.Test_VAT) || 0;
                return sum + (parseFloat(service.Service_Amount) * vat) / 100;
            }, 0);
            const netAmount = subTotal - discount;
            const patientAmount = netAmount + vatAmount;
            const vatPer = subTotal ? ((vatAmount / subTotal) * 100).toFixed(2) : 0;
            const netPayable = subTotal + vatAmount - discount;
            return { subTotal, discount, vatAmount, netAmount, patientAmount, netPayable, vatPer };
        } else {
            let totalVATPer = 0;
            let totalSubTotal = 0;
            const amountDataDetails = (fromPaymentDetailsScreen ? bookingItems : updatedCart).map((test) => {
                const vatPercentage = parseFloat(test?.Test_VAT) || 0;
                const subTotal = parseFloat(test?.Service_Amount || test?.Amount) || 0;
                const calculatedVAT = (subTotal * vatPercentage) / 100;
                totalVATPer += vatPercentage * subTotal;
                totalSubTotal += subTotal;
                return {
                    subTotal,
                    discount: parseFloat(test?.Service_Discount) || 0,
                    vatAmount: calculatedVAT,
                    netAmount: subTotal - (parseFloat(test?.Service_Discount) || 0),
                    patientAmount: subTotal + calculatedVAT,
                    vatPer: vatPercentage,
                };
            });
            const totals = amountDataDetails.reduce((acc, item) => ({
                subTotal: acc.subTotal + item.subTotal,
                discount: acc.discount + item.discount,
                vatAmount: acc.vatAmount + item.vatAmount,
                netAmount: acc.netAmount + item.netAmount,
                patientAmount: acc.patientAmount + item.patientAmount,
            }), { subTotal: 0, discount: 0, vatAmount: 0, netAmount: 0, patientAmount: 0 });
            const weightedVATPer = totalSubTotal ? totalVATPer / totalSubTotal : 0;
            const netPayable = totals.subTotal + totals.vatAmount - totals.discount;
            return { ...totals, netPayable, vatPer: weightedVATPer.toFixed(2) };
        }
    };
    const { subTotal, discount, vatAmount, netAmount, patientAmount, netPayable, vatPer } = calculateTotal();

    const AmountToBePaid = ({ amount }: any) => (
        <View style={styles.container}>
            <Text style={styles.title}>{getLabel('cashpaysuc_4')}</Text>
            <Text style={styles.amount}>P {amount}</Text>
        </View>
    );

    const handleFinalPaymentUpdate = async () => {
        try {
            dispatch(clearCart());
            await AsyncStorage.multiRemove(['patientData', 'cartData']);
            navigation.navigate('Bottom');
        } catch (error) {
            Alert.alert("Error", "Payment failed");
        }
    };


    // return (
    //     <View style={styles.mainContainer}>
    //         {showHeader && (
    //             <>
    //                 <NavigationBar title="Payment" />
    //                 <BookTestHeader selectValue={3} />
    //             </>
    //         )}
    //         {isFinalPayment ? (
    //             <ScrollView style={{ paddingHorizontal: 10 }}>
    //                 <View style={styles.headerContainer}>
    //                     <Image source={tickImage} style={styles.tickImage} />
    //                     <View style={styles.headerTextContainer}>
    //                         <Text style={styles.headerTitle}>{getLabel('cashpaysuc_1')}</Text>
    //                         <Text style={styles.bookingId}>Booking No : {bookingNo}</Text>
    //                     </View>
    //                 </View>
    //                 <View>
    //                     <AmountToBePaid amount={netPayable.toFixed(2)} />
    //                 </View>
    //                 <View style={styles.selectedTestsSection}>
    //                     <View style={styles.cartSection}>
    //                         <Text style={styles.cartTitle}>{getLabel('cashpaysuc_3')}</Text>
    //                         {fromPaymentDetailsScreen
    //                             ? bookingItems.map((test, index) => (
    //                                 <View key={index} style={styles.cartItem}>
    //                                     <Text style={styles.cartItemName} numberOfLines={2}>
    //                                         {test?.Service_Name}
    //                                     </Text>
    //                                     <Text style={styles.cartItemPrice}>
    //                                         {test?.Service_Amount || test.Amount || "0"}
    //                                     </Text>
    //                                 </View>
    //                             ))
    //                             : updatedCart.map((test, index) => (
    //                                 <View key={index} style={styles.cartItem}>
    //                                     <Text style={styles.cartItemName} numberOfLines={2}>
    //                                         {test?.Service_Name}
    //                                     </Text>
    //                                     <Text style={styles.cartItemPrice}>
    //                                         {test?.Amount}
    //                                     </Text>
    //                                 </View>
    //                             ))}
    //                         <View style={styles.cartBreakdown}>
    //                             <View style={styles.breakdownRow}>
    //                                 <Text style={styles.breakdownLabel}>{getLabel('labtsummary_6')}</Text>
    //                                 <Text style={styles.breakdownValue}>{subTotal.toFixed(2)}</Text>
    //                             </View>
    //                             <View style={styles.breakdownRow}>
    //                                 <Text style={styles.breakdownLabel}>{getLabel('bksumcol_3')}</Text>
    //                                 <Text style={styles.breakdownValue}>{discount.toFixed(2)}</Text>
    //                             </View>
    //                             <View style={styles.breakdownRow}>
    //                                 <Text style={styles.breakdownLabel}>{getLabel('bksumcol_7')}</Text>
    //                                 <Text style={styles.breakdownValue}>{vatAmount.toFixed(2)} ({vatPer}%)</Text>
    //                             </View>
    //                             <View style={styles.breakdownRow}>
    //                                 <Text style={styles.breakdownLabel}>{getLabel('bksumcol_5')}</Text>
    //                                 <Text style={styles.breakdownValue}>{netAmount.toFixed(2)}</Text>
    //                             </View>
    //                             <View style={styles.breakdownRow}>
    //                                 <Text style={styles.breakdownLabel}>{getLabel('sumbtn_11')}</Text>
    //                                 <Text style={styles.breakdownValue}>{patientAmount.toFixed(2)}</Text>
    //                             </View>
    //                             <View style={[styles.breakdownRow, styles.netPayableRow]}>
    //                                 <Text style={styles.breakdownLabel}>Net Payable Amount</Text>
    //                                 <Text style={[styles.breakdownValue, styles.netPayableValue]}>(P)
    //                                     {netPayable.toFixed(2)}</Text>
    //                             </View>
    //                         </View>
    //                     </View>
    //                 </View>
    //                 <View style={styles.patientDetailsSection}>
    //                     <View style={styles.patientDetailsRow}>
    //                         <Text style={styles.patientDetailsLabelName}>
    //                             Name: {selectedPatientDetails?.PtName || selectedPatientDetails?.Pt_Name || handleBookingDetail?.booking?.Pt_Name || ''}
    //                         </Text>
    //                     </View>
    //                     <View style={styles.patientDetailsRow}>
    //                         <Text style={styles.patientDetailsLabel}>
    //                             {`${selectedPatientDetails?.State || handleBookingDetail?.booking?.Street || ''}, ${selectedPatientDetails?.Place || ''}, ${selectedPatientDetails?.Street1 || ''}`}
    //                         </Text>
    //                     </View>
    //                 </View>
    //                 <View style={styles.patientDetailsRowDateTime}>
    //                     <Text style={styles.patientDetailsLabel}>
    //                         Collect Date & Time: {selectedDate} {' '} {selectedTime}
    //                     </Text>
    //                 </View>
    //                 <TouchableOpacity onPress={handleFinalPaymentUpdate} style={styles.HomeButton}>
    //                     <ButtonHome />
    //                 </TouchableOpacity>
    //             </ScrollView>
    //         ) : (
    //             <ScrollView style={{ paddingHorizontal: 10 }}>
    //                 <View style={styles.cartSection}>
    //                     <View style={styles.headerRow}>
    //                         <Text style={styles.cartTitle}>{getLabel('labtpaydtls_1')}</Text>
    //                         {fromBookingScreen && !isChecked && (
    //                             <TouchableOpacity onPress={handleAddTest}>
    //                                 <Text style={{ color: Constants.COLOR.THEME_COLOR }}>{getLabel('labtsummary_9')}</Text>
    //                             </TouchableOpacity>
    //                         )}
    //                     </View>
    //                     {fromBookingScreen && bookingDetails?.Service_Detail
    //                         ? bookingDetails.Service_Detail.map((service, index) => (
    //                             <View key={index} style={styles.cartItem}>
    //                                 <Text style={styles.cartItemName} numberOfLines={2}>
    //                                     {service.Service_Name}
    //                                 </Text>
    //                                 <Text style={styles.cartItemPrice}>
    //                                     {service.Service_Amount}
    //                                 </Text>
    //                             </View>
    //                         ))
    //                         : fromPaymentDetailsScreen
    //                             ? bookingItems.map((test, index) => (
    //                                 <View key={index} style={styles.cartItem}>
    //                                     <Text style={styles.cartItemName} numberOfLines={2}>
    //                                         {test.Service_Name}
    //                                     </Text>
    //                                     <Text style={styles.cartItemPrice}>
    //                                         {test.Service_Amount || test.Amount || "0"}
    //                                     </Text>
    //                                 </View>
    //                             ))
    //                             : updatedCart.map((test, index) => (
    //                                 <View key={index} style={styles.cartItem}>
    //                                     <Text style={styles.cartItemName} numberOfLines={2}>
    //                                         {test.Service_Name}
    //                                     </Text>
    //                                     <Text style={styles.cartItemPrice}>
    //                                         {test.Amount}
    //                                     </Text>
    //                                 </View>
    //                             ))}
    //                     <View style={styles.cartBreakdown}>
    //                         <View style={styles.breakdownRow}>
    //                             <Text style={styles.breakdownLabel}>{getLabel('labtsummary_6')}</Text>
    //                             <Text style={styles.breakdownValue}>{subTotal.toFixed(2)}</Text>
    //                         </View>
    //                         <View style={styles.breakdownRow}>
    //                             <Text style={styles.breakdownLabel}>{getLabel('bksumcol_3')}</Text>
    //                             <Text style={styles.breakdownValue}>{discount.toFixed(2)}</Text>
    //                         </View>
    //                         <View style={styles.breakdownRow}>
    //                             <Text style={styles.breakdownLabel}>{getLabel('bksumcol_7')}</Text>
    //                             <Text style={styles.breakdownValue}>{vatAmount.toFixed(2)} ({vatPer}%)</Text>
    //                         </View>
    //                         <View style={styles.breakdownRow}>
    //                             <Text style={styles.breakdownLabel}>{getLabel('bksumcol_5')}</Text>
    //                             <Text style={styles.breakdownValue}>{netAmount.toFixed(2)}</Text>
    //                         </View>
    //                         <View style={styles.breakdownRow}>
    //                             <Text style={styles.breakdownLabel}>{getLabel('sumbtn_11')}</Text>
    //                             <Text style={styles.breakdownValue}>{patientAmount}</Text>
    //                         </View>
    //                         <View style={[styles.breakdownRow, styles.netPayableRow]}>
    //                             <Text style={styles.breakdownLabel}>{getLabel('sumbtn_17')}</Text>
    //                             <Text style={[styles.breakdownValue, styles.netPayableValue]}>(P) {netPayable.toFixed(2)}</Text>
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
    //                 {settings?.Enable_Paymode === 'Y' && !showCancel && (
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
    //         )}
    //         {!isFinalPayment && (
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
    //         )}
    //     </View>
    // );
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
                        {imageUri ? (
                            <View style={styles.cartSectionPatientDetails}>
                                <Text style={styles.cartTitle}>Patient Details</Text>
                                <View style={styles.cartItemPatientDetails}>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.cartItemName}>{selectedPatientDetails?.PtName || selectedPatientDetails?.Pt_Name || handleBookingDetail?.booking?.Pt_Name || ''}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.cartItemName}>{selectedPatientDetails?.Street || 'Not Registered'}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.cartItemName}>{selectedPatientDetails?.Street1 || 'Not Registered'}</Text>
                                    </View>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.cartItemName}>{selectedPatientDetails?.Mobile_No || 'Not Registered'}</Text>
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.cartSection}>
                                <Text style={styles.cartTitle}>{getLabel('cashpaysuc_3')}</Text>
                                {fromPaymentDetailsScreen
                                    ? bookingItems.map((test, index) => (
                                        <View key={index} style={styles.cartItem}>
                                            <Text style={styles.cartItemName} numberOfLines={2}>
                                                {test?.Service_Name}
                                            </Text>
                                            <Text style={styles.cartItemPrice}>
                                                {test?.Service_Amount || test.Amount || "0"}
                                            </Text>
                                        </View>
                                    ))
                                    : updatedCart.map((test, index) => (
                                        <View key={index} style={styles.cartItem}>
                                            <Text style={styles.cartItemName} numberOfLines={2}>
                                                {test?.Service_Name}
                                            </Text>
                                            <Text style={styles.cartItemPrice}>
                                                {test?.Amount}
                                            </Text>
                                        </View>
                                    ))}
                                {!fromPaymentDetailsScreen && (
                                    <View style={styles.cartBreakdown}>
                                        <View style={styles.breakdownRow}>
                                            <Text style={styles.breakdownLabel}>{getLabel('labtsummary_6')}</Text>
                                            <Text style={styles.breakdownValue}>{subTotal.toFixed(2)}</Text>
                                        </View>
                                        <View style={styles.breakdownRow}>
                                            <Text style={styles.breakdownLabel}>{getLabel('bksumcol_3')}</Text>
                                            <Text style={styles.breakdownValue}>{discount.toFixed(2)}</Text>
                                        </View>
                                        <View style={styles.breakdownRow}>
                                            <Text style={styles.breakdownLabel}>{getLabel('bksumcol_7')}</Text>
                                            <Text style={styles.breakdownValue}>{vatAmount.toFixed(2)} ({vatPer}%)</Text>
                                        </View>
                                        <View style={styles.breakdownRow}>
                                            <Text style={styles.breakdownLabel}>{getLabel('bksumcol_5')}</Text>
                                            <Text style={styles.breakdownValue}>{netAmount.toFixed(2)}</Text>
                                        </View>
                                        <View style={styles.breakdownRow}>
                                            <Text style={styles.breakdownLabel}>{getLabel('sumbtn_11')}</Text>
                                            <Text style={styles.breakdownValue}>{patientAmount.toFixed(2)}</Text>
                                        </View>
                                        <View style={[styles.breakdownRow, styles.netPayableRow]}>
                                            <Text style={styles.breakdownLabel}>Net Payable Amount</Text>
                                            <Text style={[styles.breakdownValue, styles.netPayableValue]}>(P)
                                                {netPayable.toFixed(2)}</Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}
                    </View>
                    <View style={styles.patientDetailsSection}>
                        <View style={styles.patientDetailsRow}>
                            <Text style={styles.patientDetailsLabelName}>
                                Name: {selectedPatientDetails?.PtName || selectedPatientDetails?.Pt_Name || handleBookingDetail?.booking?.Pt_Name || ''}
                            </Text>
                        </View>
                        <View style={styles.patientDetailsRow}>
                            <Text style={styles.patientDetailsLabel}>
                                {`${selectedPatientDetails?.State || handleBookingDetail?.booking?.Street || ''}, ${selectedPatientDetails?.Place || ''}, ${selectedPatientDetails?.Street1 || ''}`}
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
                <ScrollView style={{ paddingHorizontal: 10 }} >
                    {imageUri ? (
                        <View style={styles.cartSectionPatientDetails}>
                            <Text style={styles.cartTitle}>Patient Details</Text>
                            <View style={styles.cartItemPatientDetails}>
                                <View style={styles.detailRow}>
                                    <Text style={styles.cartItemName}>{selectedPatientDetails?.PtName || selectedPatientDetails?.Pt_Name || handleBookingDetail?.booking?.Pt_Name || ''}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.cartItemName}>{selectedPatientDetails?.Street || 'Not Registered'}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.cartItemName}>{selectedPatientDetails?.Street1 || 'Not Registered'}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.cartItemName}>{selectedPatientDetails?.Mobile_No || 'Not Registered'}</Text>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.cartSection}>
                            <View style={styles.headerRow}>
                                <Text style={styles.cartTitle}>{getLabel('labtpaydtls_1')}</Text>
                                {fromBookingScreen && !isChecked && (
                                    <TouchableOpacity onPress={handleAddTest}>
                                        <Text style={{ color: Constants.COLOR.THEME_COLOR }}>{getLabel('labtsummary_9')}</Text>
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
                                            {service.Service_Amount}
                                        </Text>
                                    </View>
                                ))
                                : fromPaymentDetailsScreen
                                    ? bookingItems.map((test, index) => (
                                        <View key={index} style={styles.cartItem}>
                                            <Text style={styles.cartItemName} numberOfLines={2}>
                                                {test.Service_Name}
                                            </Text>
                                            <Text style={styles.cartItemPrice}>
                                                {test.Service_Amount || test.Amount || "0"}
                                            </Text>
                                        </View>
                                    ))
                                    : updatedCart.map((test, index) => (
                                        <View key={index} style={styles.cartItem}>
                                            <Text style={styles.cartItemName} numberOfLines={2}>
                                                {test.Service_Name}
                                            </Text>
                                            <Text style={styles.cartItemPrice}>
                                                {test.Amount}
                                            </Text>
                                        </View>
                                    ))}
                            {!fromPaymentDetailsScreen && (
                                <View style={styles.cartBreakdown}>
                                    <View style={styles.breakdownRow}>
                                        <Text style={styles.breakdownLabel}>{getLabel('labtsummary_6')}</Text>
                                        <Text style={styles.breakdownValue}>{subTotal.toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.breakdownRow}>
                                        <Text style={styles.breakdownLabel}>{getLabel('bksumcol_3')}</Text>
                                        <Text style={styles.breakdownValue}>{discount.toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.breakdownRow}>
                                        <Text style={styles.breakdownLabel}>{getLabel('bksumcol_7')}</Text>
                                        <Text style={styles.breakdownValue}>{vatAmount.toFixed(2)} ({vatPer}%)</Text>
                                    </View>
                                    <View style={styles.breakdownRow}>
                                        <Text style={styles.breakdownLabel}>{getLabel('bksumcol_5')}</Text>
                                        <Text style={styles.breakdownValue}>{netAmount.toFixed(2)}</Text>
                                    </View>
                                    <View style={styles.breakdownRow}>
                                        <Text style={styles.breakdownLabel}>{getLabel('sumbtn_11')}</Text>
                                        <Text style={styles.breakdownValue}>{patientAmount}</Text>
                                    </View>
                                    <View style={[styles.breakdownRow, styles.netPayableRow]}>
                                        <Text style={styles.breakdownLabel}>{getLabel('sumbtn_17')}</Text>
                                        <Text style={[styles.breakdownValue, styles.netPayableValue]}>(P) {netPayable.toFixed(2)}</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}
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
                    {settings?.Enable_Paymode === 'Y' && !showCancel && (
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

export default PaymentDetailScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Constants.COLOR.WHITE_COLOR,
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
    cartSection: {
        marginTop: 10,
    },
    cartTitle: {
        marginBottom: 10,
        fontSize: Constants.FONT_SIZE.M,
        fontFamily: Constants.FONT_FAMILY.fontFamilyMedium,
        color: '#3C3636',
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#ECEEF5',
        padding: 10,
    },
    cartItemName: {
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
        flex: 1,
    },
    cartItemPrice: {
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
        color: Constants.COLOR.FONT_COLOR_DEFAULT
    },
    cartBreakdown: {
        padding: 10,
        backgroundColor: '#ECEEF5',
    },
    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5,
    },
    breakdownLabel: {
        fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
        color: Constants.COLOR.FONT_COLOR_DEFAULT,
        flex: 0.6,
        textAlign: 'right',
    },
    breakdownValue: {
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
        color: Constants.COLOR.THEME_COLOR,
        flex: 0.3,
        textAlign: 'right',
    },
    netPayableRow: {
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 10,
    },
    netPayableValue: {
        color: Constants.COLOR.THEME_COLOR,
        fontSize: Constants.FONT_SIZE.M,
        fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
    },
    paymentHeader: {
        marginTop: 20,
        fontSize: Constants.FONT_SIZE.M,
        fontFamily: Constants.FONT_FAMILY.fontFamilyMedium,
        color: '#3C3636',
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
        fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
        color: Constants.COLOR.BLACK_COLOR,
    },
    bookingId: {
        fontSize: Constants.FONT_SIZE.M,
        color: Constants.COLOR.BOOK_ID_TEXT_COLOR,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular
    },
    title: {
        fontSize: Constants.FONT_SIZE.L,
        color: Constants.COLOR.WHITE_COLOR,
        alignSelf: 'center',
        fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
    },
    amount: {
        fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
        fontSize: Constants.FONT_SIZE.XL,
        color: Constants.COLOR.WHITE_COLOR,
        alignSelf: 'center',
    },
    selectedTestsSection: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#ECEEF5',
        borderRadius: 5,
    },
    patientDetailsSection: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#ECEEF5',
        borderRadius: 5,
    },
    patientDetailsRow: {
        marginTop: 10
    },
    patientDetailsRowDateTime: {
        margin: 10,
    },
    patientDetailsLabel: {
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
    },
    patientDetailsLabelName: {
        fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
    },
    HomeButton: {
        marginBottom: 35,
        marginTop: 15
    },
    patientDetailsContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    cartSectionPatientDetails: {
        padding: 10,
    },
    cartItemPatientDetails: {
        backgroundColor: '#ECEEF5',
        padding: 10,
    },
});


