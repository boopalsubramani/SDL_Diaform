import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import BookTestHeader from './BookTestHeader';
import Constants from '../util/Constants';
import ButtonHome from '../common/HomeButton';
import { useServiceBookingMutation } from '../redux/service/ServiceBookingService';

const FinalPaymentScreen = ({ navigation, route, showHeader = true }: any) => {
    const { selectedTests = [], selectedDate, selectedTime } = route?.params || [];
    const [serviceBookingAPIReq, { data: serviceBookingAPIRes, error }] = useServiceBookingMutation();  

    const [isLoading, setIsLoading] = useState(false);

    const calculateTotal = (tests) => {
        const subTotal = tests.reduce((sum, test) => sum + (parseFloat(test.Amount) || 0), 0);
        const discount = tests.reduce((sum, test) => sum + (parseFloat(test.Discount) || 0), 0);
        const vatAmount = tests.reduce((sum, test) => sum + (parseFloat(test.VAT_Amount) || 0), 0);
        const patientAmount = tests.reduce((sum, test) => sum + (parseFloat(test.Patient_Amount) || 0), 0);
        const netAmount = subTotal - discount + vatAmount;
        const netPayable = netAmount - patientAmount;
        return { subTotal, discount, vatAmount, netAmount, patientAmount, netPayable };
    };

    const { subTotal, discount, vatAmount, netAmount, patientAmount, netPayable } = calculateTotal(selectedTests);

    const AmountToBePaid = ({ amount }) => {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Amount to be Paid</Text>
                <Text style={styles.amount}>P {amount}</Text>
            </View>
        );
    };

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
            Pay_Mode: "O",
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


    return (
        <View style={styles.mainContainer}>
            {showHeader && (
                <>
                    <NavigationBar title="Book Test" />
                    <BookTestHeader selectValue = {3}/>
                </>
            )}
            <ScrollView style={{ paddingHorizontal: 10 }}>
                <View>
                    <AmountToBePaid amount={netPayable.toFixed(2)} />
                </View>

                {/* Cart Section */}
                <View style={styles.cartSection}>
                    <Text style={styles.cartTitle}>Summary</Text>
                    {selectedTests.map((test, index) => (
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

                <View style={styles.patientDetailsSection}>
                    <View style={styles.patientDetailsRow}>
                        <Text style={styles.patientDetailsLabel}>Name:{serviceBookingAPIRes?.Name}</Text>
                    </View>
                    <View style={styles.patientDetailsRow}>
                        <Text style={styles.patientDetailsLabel}>{`${serviceBookingAPIRes?.Street}, ${serviceBookingAPIRes?.Place}, ${serviceBookingAPIRes?.City}`}</Text>
                    </View>
                    <View style={styles.patientDetailsRow}>
                        <Text style={styles.patientDetailsLabel}>Collect Date & Time: {selectedDate}  {selectedTime}
                            {/* {serviceBookingAPIRes?.Sample_Collection_Date} {serviceBookingAPIRes?.Sample_Collection_Time} */}
                            </Text>
                    </View>
                </View>

                <TouchableOpacity onPress={handleUpdate} style={styles.HomeButton}>
                    <ButtonHome />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FBFBFB',
    },
    container: {
        marginTop: 10,
        backgroundColor: Constants.COLOR.THEME_COLOR,
        padding: 20,
        borderRadius: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Constants.COLOR.WHITE_COLOR,
        alignSelf: "center",
    },
    amount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Constants.COLOR.WHITE_COLOR,
        alignSelf: "center",
    },
    cartSection: {
        marginTop: 5,
        backgroundColor: '#f8f8f8',
    },
    cartTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 5,
        color: Constants.COLOR.BLACK_COLOR,
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f7f7f7',
        padding: 10,
        marginBottom: 5,
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
    patientDetailsSection: {
        marginTop: 10,
        padding: 15,
        backgroundColor: '#f2f2f2',
        borderRadius: 5,
    },
    patientDetailsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    patientDetailsRow: {
        marginBottom: 5,
    },
    patientDetailsLabel: {
        fontSize: 14,
    },
});

export default FinalPaymentScreen;
