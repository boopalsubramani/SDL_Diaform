import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Image,
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import BookTestHeader from './BookTestHeader';
import Constants from '../util/Constants';
import ButtonHome from '../common/HomeButton';
import { useAppSettings } from '../common/AppSettingContext';

const tickImage = require('../images/roundTick.png');

interface TestItem {
    Service_Name: string;
    Amount: number;
    Discount_Amount: number;
    T_VAT_Amount: number;
    Patient_Share: number;
}

const FinalPaymentScreen = ({ navigation, route, showHeader = true }: any) => {
    const {
        selectedTests = [],
        selectedDate,
        selectedTime,
        selectedPatientDetails,
        testData,
        selectedTestDetails = []
    } = route?.params || {};
        const { settings } = useAppSettings();
    const [isPaymentInProgress, setIsPaymentInProgress] = useState(false);

    const labels = settings?.Message?.[0]?.Labels || {};
    const getLabel = (key: string) => {
      return labels[key]?.defaultMessage || '';
    };

    const calculateTotal = (tests: any) => {
        const amountDataDetails = tests.map((test: any) => {
            const amountData = testData.find(
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
    };

    const { subTotal, discount, vatAmount, netAmount, patientAmount, netPayable } = calculateTotal(selectedTests);

    const AmountToBePaid = ({ amount }: any) => {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{getLabel('cashpaysuc_4')}</Text>
                <Text style={styles.amount}>P {amount}</Text>
            </View>
        );
    };

    // Handle payment update
    const handleUpdate = async () => {
        setIsPaymentInProgress(true);
        try {
            // Simulate payment processing
            setIsPaymentInProgress(false);
            navigation.navigate('Bottom');
        } catch (error) {
            setIsPaymentInProgress(false);
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
            <ScrollView style={{ paddingHorizontal: 10 }}>
                 <View style={styles.headerContainer}>
                    <Image source={tickImage} style={styles.tickImage} />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.headerTitle}>{getLabel('cashpaysuc_1')}</Text>
                        <Text style={styles.bookingId}>{getLabel('cashpaysuc_2')}</Text>
                    </View>
                </View>
                <View>
                    <AmountToBePaid amount={netPayable.toFixed(2)} />
                </View>

                {/* Selected Tests Section */}
                <View style={styles.selectedTestsSection}>
                    <View style={styles.cartSection}>
                        <Text style={styles.cartTitle}>{getLabel('cashpaysuc_3')}</Text>
                        {selectedTests.map((test: TestItem, index: number) => {
                            const correspondingTestData = testData.find(
                                (data: { Service_Name: string; }) => data.Service_Name === test.Service_Name
                            );

                            return (
                                <View key={index} style={styles.cartItem}>
                                    <Text style={styles.cartItemName} numberOfLines={2}>
                                        {correspondingTestData?.Service_Name}
                                    </Text>
                                    <Text style={styles.cartItemPrice}>
                                        P {correspondingTestData?.Amount}
                                    </Text>
                                </View>
                            );
                        })}
                        <View style={styles.cartBreakdown}>
                            <View style={styles.breakdownRow}>
                                <Text style={styles.breakdownLabel}>{getLabel('labtsummary_6')}</Text>
                                <Text style={styles.breakdownValue}>P{subTotal.toFixed(2)}
                                </Text>
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

                {/* Patient Details Section */}
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

                {/* Home Button */}
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
});

export default FinalPaymentScreen;
