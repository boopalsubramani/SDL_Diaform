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
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import BookTestHeader from './BookTestHeader';
import Constants from '../util/Constants';
import NetInfo from '@react-native-community/netinfo';
import ButtonBack from '../common/BackButton';
import ButtonNext from '../common/NextButton';
import { useServiceBookingMutation } from '../redux/service/ServiceBookingService';

const deviceHeight = Dimensions.get('window').height;

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

const PaymentDetailScreen = ({ navigation, route, showHeader = true }: any) => {
    const { selectedTests = [], selectedDate, selectedTime, selectedPatientDetails, testData, selectedTestDetails } = route?.params || [];
    const [paymentMethod, setPaymentMethod] = useState('');
    const [bookingResponse, setBookingResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [remark, setRemark] = useState('');
    

    const toggleCheckbox = () => {
        setIsChecked(!isChecked);
    };

    //Api call Sevice_Booking
    const [serviceBookingAPIReq] = useServiceBookingMutation();

    const handleUpdate = async () => {
        setIsLoading(true);
        const selectedTestDetails = selectedTests.map((test: Test) => {
            const correspondingTestData = testData.find(
                (data: { Service_Name: string; }) => data.Service_Name === test.Service_Name
            );

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
        });

        const payload = {
            Ref_Code: selectedPatientDetails?.Ref_Code,
            Ref_Type: selectedPatientDetails?.Ref_Type,
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
            Bill_Amount: "650.0",
            DiscountAmount: "",
            DueAmount: "700",
            Pay_No: "",
            Pay_Status: "P",
            Pay_Mode: paymentMethod === 'online' ? "O" : "C",
            Zero_Payment: 0,
            Promo_Code: "",
            Medical_Aid_No: "",
            Coverage: "",
            Package_Code: "",
            Sponsor_Paid: "",
            NationalityCode: "006",
            Prescription_File1: "2024-01-17010001.jpg",
            Prescription_File2: null,
            File_Extension1: "jpeg",
            File_Extension2: "",
            Sample_Collection_Date: selectedDate,
            Sample_Collection_Time: selectedTime,
            Services: selectedTestDetails,
        };

        console.log("payloaddddddddddddddd", payload);
        console.log("selectedTestDetails", selectedTestDetails);
        console.log("selectedTests", selectedTests);

        try {
            const response = await serviceBookingAPIReq(payload).unwrap();
            if (response?.Code === 200 && response?.SuccessFlag === "true") {
                const message = response.Message[0]?.Description || 'Booking Successful';
                Alert.alert(message);
                setBookingResponse(response);
                console.log("---------response-------", response)
                navigation.navigate('Bottom', { bookingNo: response.Message[0]?.Booking_No, bookingResponse: response });
            } else {
                Alert.alert('Error: Something went wrong.');
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error: Something went wrong.');
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
        if (!paymentMethod) {
            Alert.alert(
                Constants.ALERT.TITLE.INFO,
                Constants.VALIDATION_MSG.NO_PAYMENT_MSG,
            ); return;
        }
        await handleUpdate();
        navigation.navigate('FinalPayment', { selectedTests, selectedDate, selectedTime, selectedPatientDetails, testData, bookingResponse, selectedTestDetails });
    };


    // const calculateTotal = ({ tests }: any) => {
    //     // const validTests = Array.isArray(tests) ? tests : [];
    //     // console.log("validtest",validTests);

    //     // const subTotal = validTests.reduce((sum, test) => sum + (parseFloat(test.Amount) || 0), 0);
    //     // const discount = validTests.reduce((sum, test) => sum + (parseFloat(test.Discount) || 0), 0);
    //     // const vatAmount = validTests.reduce((sum, test) => sum + (parseFloat(test.VAT_Amount) || 0), 0);
    //     // const patientAmount = validTests.reduce((sum, test) => sum + (parseFloat(test.Patient_Amount) || 0), 0);
    //     // const netAmount = subTotal - discount + vatAmount;
    //     // const netPayable = netAmount - patientAmount;

    //     // return { subTotal, discount, vatAmount, netAmount, patientAmount, netPayable };
    //     const amountDataDetails = selectedTests.map((test: Test) => {
    //         const amountData = testData.find(
    //             (data: { Service_Name: string; }) => data.Service_Name === test.Service_Name
    //         );
    //         return {
    //             const subTotal = amountData?.T_Sub_Total;
    //             const discount = amountData?.T_Discount_Amount;
    //             const vatAmount = amountData?.T_VAT_Amount;
    //             const netAmount = amountData?.T_Net_Amount;
    //             const netPayable = amountData?.T_Patient_Due
    //         }
    //     })
    // };

    // const { subTotal, discount, vatAmount, netAmount, patientAmount, netPayable } = calculateTotal({ tests: amountDataDetails });
    const calculateTotal = (tests: Test[]) => {
        const amountDataDetails = tests.map((test: Test) => {
            const amountData = testData.find(
                (data: { Service_Name: string }) => data.Service_Name === test.Service_Name
            );

            console.log("amountData for test:", test.Service_Name, amountData);

            if (!amountData) {
                console.warn(`No matching data found for ${test.Service_Name}`);
            }

            return {
                subTotal: parseFloat(amountData?.T_Sub_Total) || 0,
                discount: parseFloat(amountData?.T_Discount_Amount) || 0,
                vatAmount: parseFloat(amountData?.T_VAT_Amount) || 0,
                netAmount: parseFloat(amountData?.T_Net_Amount) || 0,
                patientAmount: parseFloat(amountData?.T_Patient_Due) || 0,
                netPayable:
                    (parseFloat(amountData?.T_Net_Amount) || 0) -
                    (parseFloat(amountData?.T_Patient_Due) || 0),
            };
        });

        // Aggregate the total values
        const totals = amountDataDetails.reduce(
            (acc, item) => ({
                subTotal: acc.subTotal + item.subTotal,
                discount: acc.discount + item.discount,
                vatAmount: acc.vatAmount + item.vatAmount,
                netAmount: acc.netAmount + item.netAmount,
                patientAmount: acc.patientAmount + item.patientAmount,
                netPayable: acc.netPayable + item.netPayable,
            }),
            {
                subTotal: 0,
                discount: 0,
                vatAmount: 0,
                netAmount: 0,
                patientAmount: 0,
                netPayable: 0,
            }
        );

        console.log("Final totals:", JSON.stringify(totals));

        return totals;
    };

    // Call the function and destructure totals
    const { subTotal, discount, vatAmount, netAmount, patientAmount, netPayable } =
        calculateTotal(selectedTests);

console.log(patientAmount ,"patients");

    return (
        <View style={styles.mainContainer}>
            {showHeader && (
                <>
                    <NavigationBar title="Payment" />
                    <BookTestHeader selectValue={3} />
                </>
            )}
            <ScrollView style={{ paddingHorizontal: 10 }}>
                <View style={styles.cartSection}>
                    <Text style={styles.cartTitle}>Booking Details</Text>
                    {selectedTests.map((test: Test, index: number) => (
                        <View key={index} style={styles.cartItem}>
                            <Text style={styles.cartItemName} numberOfLines={2}>{test.Service_Name}</Text>
                            <Text style={styles.cartItemPrice}>P {test.Amount}</Text>
                        </View>
                    ))}
                    <View style={styles.cartBreakdown}>
                        <View style={styles.breakdownRow}>
                            <Text style={styles.breakdownLabel}>Sub Total:</Text>
                            <Text style={styles.breakdownValue}>P {subTotal.toFixed(2)}</Text>
                        </View>
                        <View style={styles.breakdownRow}>
                            <Text style={styles.breakdownLabel}>Discount:</Text>
                            <Text style={styles.breakdownValue}>- P {discount.toFixed(2)}</Text>
                        </View>
                        <View style={styles.breakdownRow}>
                            <Text style={styles.breakdownLabel}>VAT Amount:</Text>
                            <Text style={styles.breakdownValue}>P {vatAmount.toFixed(2)}</Text>
                        </View>
                        <View style={styles.breakdownRow}>
                            <Text style={styles.breakdownLabel}>Net Amount:</Text>
                            <Text style={styles.breakdownValue}>P {netAmount.toFixed(2)}</Text>
                        </View>
                        <View style={styles.breakdownRow}>
                            <Text style={styles.breakdownLabel}>Patient Amount:</Text>
                            <Text style={styles.breakdownValue}>- P {patientAmount}</Text>
                        </View>
                        <View style={[styles.breakdownRow, styles.netPayableRow]}>
                            <Text style={styles.breakdownLabel}>Net Payable Amount:</Text>
                            <Text style={[styles.breakdownValue, styles.netPayableValue]}>P {netPayable.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.CancelContainer}>
                    <TouchableOpacity onPress={toggleCheckbox} style={styles.CancelCheckbox}>
                        {isChecked && <View style={styles.CancelChecked} />}
                    </TouchableOpacity>
                    <Text style={styles.CancelText}>Cancel</Text>
                </View>

                {/* Display the remark input if checkbox is checked */}
                {isChecked && (
                    <TextInput
                        style={styles.remarkInput}
                        placeholder="Enter remark"
                        value={remark}
                        onChangeText={setRemark}
                    />
                )}

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
            </ScrollView>
            <View style={styles.navigationContainer}>
                <TouchableOpacity onPress={handleBack}>
                    <ButtonBack />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNext}>
                    <ButtonNext />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default PaymentDetailScreen;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FBFBFB',
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
        justifyContent: 'space-between',
        marginTop: 20,
    },
});

