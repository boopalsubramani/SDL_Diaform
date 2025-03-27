
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
import { CommonActions } from '@react-navigation/native';
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
        fromBookingScreen = false
    } = route?.params || {};
    const [paymentMethod, setPaymentMethod] = useState('');
    const [bookingResponse, setBookingResponse] = useState(null);
    const [isChecked, setIsChecked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [remark, setRemark] = useState('');
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
    const [isFinalPayment, setIsFinalPayment] = useState(false);
    const [bookingNo, setBookingNo] = useState('');
    const [bookingDetailAPIReq] = useBookingDetailMutation();
    const [serviceBookingAPIReq] = useServiceBookingMutation();
    const [serviceBookingCancelApiReq] = useServiceBookingCancelMutation();
    const selectedLanguage = useSelector((state: RootState) => state.appSettings.selectedLanguage) as Language | null;

    console.log('patientDataPaymentdetails', patientData);


    useEffect(() => {
        I18nManager.forceRTL(selectedLanguage?.Alignment === 'rtl');
    }, [selectedLanguage]);

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

    // const handleUpdate = async () => {
    //     setIsLoading(true);
    //     const formData = new FormData();
    //     formData.append("Ref_Code", userData?.UserCode);
    //     formData.append("Ref_Type", userData?.UserType);
    //     formData.append("Pt_Code", selectedPatientDetails?.PtCode);
    //     formData.append("Firm_No", "01");
    //     formData.append("Name", selectedPatientDetails?.PtName);
    //     formData.append("Dob", selectedPatientDetails?.DOB || '');
    //     formData.append("Age", selectedPatientDetails?.Age);
    //     formData.append("Gender", selectedPatientDetails?.Gender);
    //     formData.append("Title_Code", selectedPatientDetails?.Title_Code);
    //     formData.append("Title_Desc", selectedPatientDetails?.Title_Desc);
    //     formData.append("Phone", selectedPatientDetails?.Mobile_No);
    //     formData.append("NationalityCode", selectedPatientDetails?.Nationality);
    //     formData.append("File_Extension1", "png");
    //     formData.append("File_Extension2", "");
    //     formData.append("Paid_Amount", "636.0");
    //     formData.append("Bill_Amount", "530.0");
    //     formData.append("DiscountAmount", "0");
    //     formData.append("DueAmount", "0");
    //     formData.append("Pay_No", "6548561564154");
    //     formData.append("Pay_Status", "C");
    //     formData.append("Pay_Mode", paymentMethod === 'online' ? "O" : "C");
    //     formData.append("Zero_Payment", "1");
    //     formData.append("Promo_Code", "");
    //     formData.append("Medical_Aid_No", "");
    //     formData.append("Coverage", "");
    //     formData.append("Package_Code", "");
    //     formData.append("Sponsor_Paid", "0");
    //     formData.append("Place", selectedPatientDetails?.State);
    //     formData.append("City", selectedPatientDetails?.Street);
    //     formData.append("Email", selectedPatientDetails?.Email_Id);

    //     // Append the base64 string directly
    //     formData.append("Prescription_File1", imageBase64);
    //     formData.append("Prescription_File2", null);

    //     const selectedTestDetails = updatedCart.map((test: any) => {
    //         return {
    //             TESTTYPE: test?.Service_Type,
    //             TESTCODE: test?.Service_Code,
    //             SERVICE_AMOUNT: test?.Amount,
    //             SERVICE_DISCOUNT: test?.Discount_Amount,
    //             PRIMARY_SHARE: test?.Primary_Share,
    //             PATIENT_SHARE: test?.Patient_Share,
    //             TEST_VAT: test?.Test_VAT,
    //             PATIENT_VAT: test?.Patient_VAT,
    //             AID_VAT: test?.Aid_VAT,
    //             T_ROUND_OFF: test?.T_Round_off,
    //             PROF_CODE: test?.Service_Code,
    //         };
    //     });

    //     formData.append("Services", JSON.stringify(selectedTestDetails));

    //     try {
    //         const response = await serviceBookingAPIReq(formData).unwrap();
    //         if (response?.Code === 200 && response?.SuccessFlag === "true") {
    //             const message = response.Message[0]?.Description || "Booking Successful";
    //             Alert.alert(message);
    //             setBookingResponse(response);
    //             setBookingNo(response.Message[0]?.Booking_No);
    //             setIsFinalPayment(true);
    //         } else {
    //             Alert.alert("Error: Something went wrong.");
    //         }
    //     } catch (error) {
    //         console.error(JSON.stringify(error));
    //         Alert.alert("Error", "Something went wrong!");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const handleUpdate = async () => {
        setIsLoading(true);

        // Ensure patientData is valid before merging
        const validPatientData = patientData || {};

        // Merging patient details to avoid missing fields
        const mergedPatient = {
            PtCode: selectedPatientDetails?.PtCode || validPatientData?.Pt_Code || "",
            Name: selectedPatientDetails?.PtName || validPatientData?.Pt_Name || "",
            Dob: validPatientData?.Dob ? validPatientData.Dob.replace(/\//g, "-") : selectedPatientDetails?.DOB || "",
            Age: selectedPatientDetails?.Age || validPatientData?.Age || "0",
            Gender: validPatientData?.Gender === "Male" ? "M" : validPatientData?.Gender === "Female" ? "F" : selectedPatientDetails?.Gender || "",
            Title_Code: selectedPatientDetails?.Title_Code || "",
            Title_Desc: selectedPatientDetails?.Title_Desc || "MR.",
            Phone: selectedPatientDetails?.Mobile_No || validPatientData?.Mobile_No || "",
            NationalityCode: selectedPatientDetails?.Nationality || "",
            Place: selectedPatientDetails?.Place || validPatientData?.Place || "",
            City: selectedPatientDetails?.City || validPatientData?.Street || "",
            Email: selectedPatientDetails?.Email_Id || "",
        };

        console.log("Merged Patient Details:", mergedPatient);

        const formData = new FormData();
        formData.append("Ref_Code", userData?.UserCode);
        formData.append("Ref_Type", userData?.UserType);
        formData.append("Pt_Code", mergedPatient.PtCode);
        formData.append("Firm_No", "01");
        formData.append("Name", mergedPatient.Name);
        formData.append("Dob", mergedPatient.Dob);
        formData.append("Age", mergedPatient.Age);
        formData.append("Gender", mergedPatient.Gender);
        formData.append("Title_Code", mergedPatient.Title_Code);
        formData.append("Title_Desc", mergedPatient.Title_Desc);
        formData.append("Phone", mergedPatient.Phone);
        formData.append("NationalityCode", mergedPatient.NationalityCode);
        formData.append("File_Extension1", "png");
        formData.append("File_Extension2", "");
        formData.append("Paid_Amount", "636.0");
        formData.append("Bill_Amount", "530.0");
        formData.append("DiscountAmount", "0");
        formData.append("DueAmount", "0");
        formData.append("Pay_No", "6548561564154");
        formData.append("Pay_Status", "C");
        formData.append("Pay_Mode", paymentMethod === 'online' ? "O" : "C");
        formData.append("Zero_Payment", "1");
        formData.append("Promo_Code", "");
        formData.append("Medical_Aid_No", "");
        formData.append("Coverage", "");
        formData.append("Package_Code", "");
        formData.append("Sponsor_Paid", "0");
        formData.append("Place", mergedPatient.Place);
        formData.append("City", mergedPatient.City);
        formData.append("Email", mergedPatient.Email);

        // Append the base64 string directly
        formData.append("Prescription_File1", imageBase64);
        formData.append("Prescription_File2", null);

        const selectedTestDetails = updatedCart.map((test: any) => ({
            TESTTYPE: test?.Service_Type,
            TESTCODE: test?.Service_Code,
            SERVICE_AMOUNT: test?.Amount,
            SERVICE_DISCOUNT: test?.Discount_Amount,
            PRIMARY_SHARE: test?.Primary_Share,
            PATIENT_SHARE: test?.Patient_Share,
            TEST_VAT: test?.Test_VAT,
            PATIENT_VAT: test?.Patient_VAT,
            AID_VAT: test?.Aid_VAT,
            T_ROUND_OFF: test?.T_Round_off,
            PROF_CODE: test?.Service_Code,
        }));

        formData.append("Services", JSON.stringify(selectedTestDetails));

        try {
            const response = await serviceBookingAPIReq(formData).unwrap();

            console.log("API Response:", response);

            if (response?.Code === 200 && response?.SuccessFlag === "true") {
                const message = response.Message[0]?.Description || "Booking Successful";
                Alert.alert(message);
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
            Firm_No: "08",
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
        // If Enable_Paymode is not 'Y', skip payment method validation
        if (settings?.Enable_Paymode === 'Y' && !paymentMethod) {
            Alert.alert(
                Constants.ALERT.TITLE.INFO,
                Constants.VALIDATION_MSG.NO_PAYMENT_MSG,
            );
            return;
        }
        await handleUpdate();
    };

    // const handleAddTest = () => {
    //     const serviceDetails = bookingDetails?.Service_Detail.map(service => ({
    //         Service_Name: service.Service_Name,
    //         Service_Amount: service.Service_Amount,
    //     }));
    //     console.log('servicedetails', serviceDetails);

    //     navigation.navigate('BookTestSearch', {
    //         selectedTests,
    //         selectedDate,
    //         selectedTime,
    //         selectedPatientDetails,
    //         testData,
    //         bookingResponse,
    //         selectedTestDetails,
    //         fromBookingScreen,
    //         serviceDetails,
    //     });
    // };


    const handleAddTest = () => {
        // Log the entire bookingDetails for debugging purposes
        console.log('bookingDetails', bookingDetails);

        // Navigate to BookTestSearch with all the data, including the entire bookingDetails object
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
            const subTotal = serviceDetails.reduce((sum, service) => sum + parseFloat(service.Service_Amount), 0);
            const discount = parseFloat(bookingDetails.Discount_Amount);
            const vatAmount = parseFloat(bookingDetails.VAT_Amount);
            const netAmount = parseFloat(bookingDetails.Net_Amount);
            const patientAmount = parseFloat(bookingDetails.Patient_Due);

            const netPayable = subTotal + vatAmount - discount;
            return { subTotal, discount, vatAmount, netAmount, patientAmount, netPayable };
        } else {
            const amountDataDetails = updatedCart.map((test) => {
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
            dispatch(clearCart());
            await AsyncStorage.multiRemove(['patientData', 'cartData']);
            navigation.navigate('Bottom');
        } catch (error) {
            Alert.alert("Error", "Payment failed");
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
                            {updatedCart.map((test, index) => (
                                <View key={index} style={styles.cartItem}>
                                    <Text style={styles.cartItemName} numberOfLines={2}>
                                        {test?.Service_Name}
                                    </Text>
                                    <Text style={styles.cartItemPrice}>
                                        {test?.Amount}
                                    </Text>
                                </View>
                            ))}
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
                                    <Text style={styles.breakdownValue}>{vatAmount.toFixed(2)}</Text>
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
                            : updatedCart.map((test: any, index) => (
                                <View key={index} style={styles.cartItem}>
                                    <Text style={styles.cartItemName} numberOfLines={2}>
                                        {test.Service_Name}
                                    </Text>
                                    <Text style={styles.cartItemPrice}>
                                        {test.Amount}
                                    </Text>
                                </View>
                            ))}
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
                                <Text style={styles.breakdownValue}>{vatAmount.toFixed(2)}</Text>
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
                    {settings?.Enable_Paymode === 'Y' && !showCancel && (<>
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
    errorText: {
        fontSize: Constants.FONT_SIZE.M,
        color: Constants.COLOR.BLACK_COLOR,
        textAlign: 'center',
        marginTop: 20,
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
    saveButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
    },
    saveButtonDisabled: {
        backgroundColor: 'gray',
    },
    saveButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    paymentOptionDisabled: {
        opacity: 0.5,
    },
    paymentTextDisabled: {
        fontSize: 16,
        color: 'gray',
    },
});


