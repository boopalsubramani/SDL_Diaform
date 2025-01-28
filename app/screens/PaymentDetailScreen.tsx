import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import BookTestHeader from './BookTestHeader';
import Constants from '../util/Constants';
import ButtonBack from '../common/BackButton';
import ButtonNext from '../common/NextButton';

const deviceHeight = Dimensions.get('window').height;

const PaymentDetailScreen = ({ navigation, route, showHeader = true }: any) => {
    const { selectedTests = [] } = route?.params || [];
    const [paymentMethod, setPaymentMethod] = useState('');

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

    const handleBack = () => {
        navigation.goBack();
    };

    const handleNext = () => {
        navigation.navigate('FinalPayment');
    };

    return (
        <View style={styles.mainContainer}>
            {showHeader && (
                <>
                    <NavigationBar title="Book Test" />
                    <BookTestHeader selectValue = {3} />
                </>
            )}
            <ScrollView style={{ paddingHorizontal: 10 }}>
                <View style={styles.cartSection}>
                    <Text style={styles.cartTitle}>Booking Details</Text>
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

                <Text style={styles.paymentHeader}>Payment Mode</Text>
                <View style={styles.paymentContainer}>
                    <TouchableOpacity
                        style={styles.paymentOption}
                        onPress={() => setPaymentMethod('online')}
                    >
                        <View
                            style={[
                                styles.radioButton,
                                paymentMethod === 'online' && styles.radioSelected,
                            ]}
                        />
                        <Text style={styles.paymentText}>Online Payment</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.paymentOption}
                        onPress={() => setPaymentMethod('cash')}
                    >
                        <View
                            style={[
                                styles.radioButton,
                                paymentMethod === 'cash' && styles.radioSelected,
                            ]}
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
                    <ButtonNext/>
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
        borderColor: '#7A7A7A',
        marginRight: 10,
    },
    radioSelected: {
        backgroundColor: Constants.COLOR.THEME_COLOR,
    },
    paymentText: {
        fontSize: 14,
        color: '#000',
        fontFamily: 'Poppins-Regular',
    },
    navigationContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#FBFBFB',
        justifyContent: 'space-between',
      },
});

export default PaymentDetailScreen;
