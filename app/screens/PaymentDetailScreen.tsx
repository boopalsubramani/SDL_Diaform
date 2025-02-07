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
    const { selectedTests = [], selectedDate, selectedTime, selectedPatientDetails } = route?.params || [];
    const [paymentMethod, setPaymentMethod] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [remark, setRemark] = useState(''); // State for the remark text

    const toggleCheckbox = () => {
        setIsChecked(!isChecked);
    };

    //Api call Sevice_Booking
    const [serviceBookingAPIReq] = useServiceBookingMutation();

    const handleUpdate = async () => {
        setIsLoading(true);
        const selectedTestDetails = selectedTests.map(test => ({
            TestType: test.TestType || "T",
            TestCode: test.TestCode,
            Service_Amount: test.Service_Amount || "0.0",
            Service_Discount: test.Service_Discount || "0.0",
            Primary_Share: test.Primary_Share || "0",
            Patient_Share: test.Patient_Share || "0",
            Test_VAT: test.Test_VAT || "0.0",
            Patient_VAT: test.Patient_VAT || "0.0",
        }));

        const payload = {
            Ref_Code: "01000104",
            Ref_Type: "C",
            Pt_Code: "0100005036",
            Firm_No: "01",
            Name: "MONIKA",
            Dob: "2000/01/27",
            Age: "23.0",
            Gender: "F",
            Title_Code: "05",
            Title_Desc: "Miss.",
            Street: "Blaji colony",
            Place: "tirupati",
            City: "tirupati",
            Email: "tirupati@gmail.com",
            Phone: "9874558585",
            Paid_Amount: "50",
            Bill_Amount: "650.0",
            DueAmount: "730",
            Pay_No: "3564685874",
            Pay_Status: "P",
            Pay_Mode: paymentMethod === 'online' ? "O" : "C",
            Sample_Collection_Date: "2025/01/10",
            Sample_Collection_Time: "16:25",
            Services: selectedTestDetails,
        };

        try {
            const response = await serviceBookingAPIReq(payload).unwrap();

            if (response?.Code === 200 && response?.SuccessFlag === "true") {
                const message = response.Message[0]?.Description || 'Booking Successful';
                Alert.alert(message);
                navigation.navigate('Bottom', { bookingNo: response.Message[0]?.Booking_No });
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
        handleUpdate();
        navigation.navigate('FinalPayment', { selectedTests, selectedDate, selectedTime, selectedPatientDetails });
    };


    const calculateTotal = ({ tests }: any) => {
        const validTests = Array.isArray(tests) ? tests : [];

        const subTotal = validTests.reduce((sum, test) => sum + (parseFloat(test.Amount) || 0), 0);
        const discount = validTests.reduce((sum, test) => sum + (parseFloat(test.Discount) || 0), 0);
        const vatAmount = validTests.reduce((sum, test) => sum + (parseFloat(test.VAT_Amount) || 0), 0);
        const patientAmount = validTests.reduce((sum, test) => sum + (parseFloat(test.Patient_Amount) || 0), 0);
        const netAmount = subTotal - discount + vatAmount;
        const netPayable = netAmount - patientAmount;

        return { subTotal, discount, vatAmount, netAmount, patientAmount, netPayable };
    };

    const { subTotal, discount, vatAmount, netAmount, patientAmount, netPayable } = calculateTotal({ tests: selectedTests });


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
                            <Text style={styles.breakdownValue}>- P {patientAmount.toFixed(2)}</Text>
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

export default PaymentDetailScreen;
