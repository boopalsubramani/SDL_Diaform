import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Dimensions, FlatList } from 'react-native';
import NavigationBar from '../common/NavigationBar';
import Constants from "../util/Constants";
import { WebView } from "react-native-webview";
import { usePaymentMutation } from '../redux/service/PaymentService';
import { useUser } from '../common/UserContext';
import { usePaymentGatewayMutation } from '../redux/service/PatmentGatewayService';
import SpinnerIndicator from '../common/SpinnerIndicator';
import { Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import ButtonBack from '../common/BackButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../routes/Types';

const deviceHeight = Dimensions.get('window').height;

// Define the types for the API responses
interface Invoice {
  InvoiceFirm: string;
  InvoiceNo: string;
  InvoiceDate: string;
  PatientDue: number;
  Pat_Due: string;
  Inv_No: string;
  Inv_Firm: string;
  Inv_Date: string;
}

interface PaymentDataItem {
  Inv_No: string;
  Pat_Due: string;
  Inv_Firm: string;
  Inv_Date: string;
  Billing_Firm_No: string;
}

interface WithoutInvoice {
  DueAmount: number;
}

interface Deposit {
  CurrentBalance: number;
}

type PaymentData = Invoice[] | WithoutInvoice | Deposit;

type PaymentScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Payment'>;

const PaymentScreen = () => {
  const navigation = useNavigation<PaymentScreenNavigationProp>();
  const [selectedOption, setSelectedOption] = useState('With invoice');
  const [showInvoice, setShowInvoice] = useState(true);
  const { userData } = useUser();
  const [showWithoutInvoice, setShowWithoutInvoice] = useState(false);
  const [payAmountInvoice, setPayAmountInvoice] = useState('0.00');
  const [payAmountWithoutInvoice, setPayAmountWithoutInvoice] = useState('');
  const [payAmountDeposit, setPayAmountDeposit] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [showDeposit, setShowDeposit] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentDataItem[]>([]);
  const [paymentDetailsReq] = usePaymentMutation();
  const [paymentGatewayReq] = usePaymentGatewayMutation();
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedPayments, setSelectedPayments] = useState<{ [key: string]: string }>({});
  const [canGoBack, setCanGoBack] = useState(false);

  const handleWebViewNavigationStateChange = (newNavState: any) => {
    const { url, canGoBack } = newNavState;
    setCanGoBack(canGoBack);

    // Check if the user is navigating back from the payment URL
    if (canGoBack && !url.includes('payment')) {
      setPaymentUrl(null);

    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, [selectedOption]);

  const fetchPaymentData = async () => {
    try {
      const response = await paymentDetailsReq({
        UserType: userData?.UserType,
        Username: userData?.UserCode,
        PaymentType: selectedOption === 'With invoice' ? 'WI' : selectedOption === 'Without invoice' ? 'WOI' : 'DP'
      });
      if (response.data && response.data.SuccessFlag === "true") {
        setPaymentData(response.data.Message);
      }
    } catch (error) {
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPaymentData();
      return () => {
        console.log('Screen lost focus');
      };
    }, [selectedOption])
  );

  const options = ['With invoice', 'Without invoice', 'Deposit'];

  const handleOptionPress = (option: any) => {
    setSelectedOption(option);
    setShowInvoice(option === 'With invoice');
    setShowWithoutInvoice(option === 'Without invoice');
    setShowDeposit(option === 'Deposit');
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedInvoices([]);
      setSelectedPayments({});
      setPayAmountInvoice('0.00');
    } else {
      if (Array.isArray(paymentData)) {
        const allInvoiceNos = paymentData.map((item: any) => item.Inv_No);
        setSelectedInvoices(allInvoiceNos);

        const totalAmount = paymentData.reduce((total, item) => {
          const amount = selectedPayments[item.Inv_No]
            ? parseFloat(selectedPayments[item.Inv_No])
            : parseFloat(item.Pat_Due);
          return total + amount;
        }, 0); setPayAmountInvoice(totalAmount.toFixed(2));
      }
    }
    setSelectAll(!selectAll);
  };

  const handleInvoiceSelect = (invoiceNo: string) => {
    setSelectedInvoices((prevSelected) => {
      let updatedSelection;

      if (prevSelected.includes(invoiceNo)) {
        updatedSelection = prevSelected.filter((inv) => inv !== invoiceNo);
      } else {
        updatedSelection = [...prevSelected, invoiceNo];
      }

      if (Array.isArray(paymentData)) {
        setSelectAll(updatedSelection.length === paymentData.length);

        const totalAmount = paymentData
          .filter((item: any) => updatedSelection.includes(item.Inv_No))
          .reduce((total, item) => {
            const amount = selectedPayments[item.Inv_No]
              ? parseFloat(selectedPayments[item.Inv_No])
              : parseFloat(item.Pat_Due);
            return total + amount;
          }, 0);

        setPayAmountInvoice(totalAmount.toFixed(2));
      }

      return updatedSelection;
    });
  };

  const handlePaymentInputChange = (invoiceNo: string, value: string) => {
    setSelectedPayments((prev) => ({
      ...prev,
      [invoiceNo]: value,
    }));
    if (selectedInvoices.includes(invoiceNo)) {
      if (Array.isArray(paymentData)) {
        const totalAmount = paymentData
          .filter((item: any) => selectedInvoices.includes(item.Inv_No))
          .reduce((total, item) => {
            const amount = invoiceNo === item.Inv_No
              ? (value ? parseFloat(value) : parseFloat(item.Pat_Due))
              : (selectedPayments[item.Inv_No]
                ? parseFloat(selectedPayments[item.Inv_No])
                : parseFloat(item.Pat_Due));
            return total + amount;
          }, 0);
        setPayAmountInvoice(totalAmount.toFixed(2));
      }
    }
  };

  const handlePayAll = () => {
    if (Array.isArray(paymentData)) {
      const totalDue = paymentData.reduce((total, item) => {
        if (selectedInvoices.includes(item.Inv_No)) {
          const amount = selectedPayments[item.Inv_No] ? parseFloat(selectedPayments[item.Inv_No]) : parseFloat(item.Pat_Due);
          return total + amount;
        }
        return total;
      }, 0);
      setPayAmount(totalDue.toString());
      handlePayment();
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    const invoiceDetails = selectedOption === 'With invoice'
      ? selectedInvoices.map((invoiceNo) => {
        const item = paymentData.find((item: { Inv_No: string; }) => item.Inv_No === invoiceNo);
        const amount = selectedPayments[invoiceNo] ? parseFloat(selectedPayments[invoiceNo]) : parseFloat(item.Pat_Due);
        return {
          invoiceNo: item?.Inv_No,
          date: item?.Inv_Date,
          amount: amount,
          firmNo: item?.Billing_Firm_No,
        };
      })
      : [];

    const totalAmount = selectedOption === 'With invoice'
      ? invoiceDetails.reduce((total, invoice) => total + invoice.amount, 0)
      : selectedOption === 'Without invoice'
        ? parseFloat(payAmountWithoutInvoice)
        : parseFloat(payAmountDeposit);
    const requestBody = {
      userType: userData?.UserType,
      userCode: userData?.UserCode,
      firmNo: userData?.Branch_Code,
      name: userData?.Names,
      phone: userData?.Mobile,
      email: userData?.Email,
      product:
        selectedOption === "With invoice"
          ? "Due Payment"
          : selectedOption === "Without invoice"
            ? "WOI Payment"
            : "Deposit Payment",
      amount: totalAmount,
      paymentType:
        selectedOption === "With invoice"
          ? "WI"
          : selectedOption === "Without invoice"
            ? "WOI"
            : "DP",
      invoices: invoiceDetails,
    };

    console.log("🔵 Sending Payment API Request:", JSON.stringify(requestBody));
    Alert.alert(
      "Confirm Payment",
      "Are you sure you want to proceed with the payment?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => setLoading(false),
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              const response = await paymentGatewayReq(requestBody);
              if (response?.data?.SuccessFlag === "true") {
                const paymentUrl = response?.data?.Message?.paymentUrlList?.[0]?.redirectUrl;
                if (paymentUrl) {
                  console.log("🔗 Redirecting to Payment URL:", paymentUrl);
                  setPaymentUrl(paymentUrl);
                  // Linking.openURL(paymentUrl);
                  if (selectedOption === 'With invoice') {
                    setPaymentData(response.data.Message.updatedPaymentData);
                    setSelectedPayments({});
                  }
                  setPayAmountInvoice('0.00');
                  setPayAmountWithoutInvoice('');
                  setPayAmountDeposit('');
                  setSelectedInvoices([]);
                  setSelectAll(false);
                } else {
                  navigation.navigate('PaymentFailure');
                }
              }
              else {
                navigation.navigate('PaymentFailure');
              }
            } catch (error) {
              navigation.navigate('PaymentFailure');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (paymentUrl) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          source={{ uri: paymentUrl }}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          startInLoadingState
          renderLoading={() => <SpinnerIndicator />}
        />
        {canGoBack && (
          <TouchableOpacity onPress={() => setPaymentUrl(null)} style={{ position: 'absolute', bottom: 10, left: 10 }}>
            <ButtonBack />
          </TouchableOpacity>
        )}
      </SafeAreaView>
    );
  }

  const renderInvoiceItem = ({ item }: any) => (
    <View style={styles.invoiceCard}>
      <View style={styles.invoiceRow}>
        <Checkbox.Android
          status={selectedInvoices.includes(item.Inv_No) ? 'checked' : 'unchecked'}
          onPress={() => handleInvoiceSelect(item.Inv_No)}
          color={Constants.COLOR.THEME_COLOR}
        />
        <Text style={styles.invoiceLabel}>Invoice No: {item.Inv_No}</Text>
      </View>

      <View style={styles.invoiceRow}>
        <Text style={styles.invoiceLabel}>Invoice Form</Text>
        <Text style={styles.invoiceLabelValue}>{item.Inv_Firm}</Text>
      </View>
      <View style={styles.invoiceRow}>
        <Text style={styles.invoiceLabel}>Invoice Date</Text>
        <Text style={styles.invoiceLabelValue}>{item.Inv_Date}</Text>
      </View>

      <View style={{ backgroundColor: '#ECEEF5', padding: 5 }}>
        <View style={[styles.invoiceRow, { justifyContent: 'space-between' }]}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.invoiceLabel}>Due</Text>
            <Text style={styles.invoiceLabelValue}>{item.Pat_Due}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.invoiceLabel}>Pay</Text>
            <TextInput
              style={[styles.invoiceLabelValue, styles.input, { backgroundColor: Constants.COLOR.WHITE_COLOR, borderWidth: 0 }]}
              placeholder="0.00"
              placeholderTextColor={Constants.COLOR.BOOK_ID_TEXT_COLOR}
              keyboardType="numeric"
              value={selectedPayments[item.Inv_No] || ''}
              onChangeText={(text) => handlePaymentInputChange(item.Inv_No, text)}
            />
          </View>
        </View>

        <View style={[styles.invoiceRow, { justifyContent: 'space-between', }]}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.invoiceLabel}>Total</Text>
            <Text style={styles.invoiceLabelValue}>{item.Pat_Due}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationBar title="Payments" />
      <View style={styles.container}>
        <View style={styles.toggleGroup}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                selectedOption === option && styles.selectedOption,
              ]}
              onPress={() => handleOptionPress(option)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedOption === option && styles.selectedOptionText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Custom Checkbox and Pay Now Button */}
        {selectedOption === 'With invoice' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '40%' }}>
              <Checkbox.Android
                status={selectAll ? 'checked' : 'unchecked'}
                onPress={handleSelectAll}
                color={Constants.COLOR.THEME_COLOR}
                uncheckedColor={Constants.COLOR.BLACK_COLOR}
              />
              <Text onPress={() => setChecked(!checked)}>Select All</Text>
            </View>
            <View style={{ width: '25%' }}>
              <Text>Total:</Text>
              <Text style={{ fontWeight: 'bold', color: Constants.COLOR.THEME_COLOR }}>{payAmountInvoice}</Text>
            </View>
            <TouchableOpacity style={styles.payButton} onPress={handlePayAll}>
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Invoice Section */}
        {showInvoice && (
          <FlatList
            data={paymentData}
            renderItem={renderInvoiceItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.invoiceContainer}
            ListEmptyComponent={loading ? <SpinnerIndicator /> : null} />
        )}

        {/* Without Invoice Section */}
        {showWithoutInvoice && (
          <View style={styles.withoutInvoiceContainer}>
            <Text style={styles.sectionTitle}>Without Invoice</Text>
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>Total Due</Text>
              <TouchableOpacity style={{ flex: 1 }}>
                <Text style={[styles.invoiceLabel, styles.totalDue]}>
                  {/* {(paymentData as WithoutInvoice).DueAmount || '0.00'} */}
                  {paymentData?.DueAmount != null ? paymentData.DueAmount : '0.00'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>Total Pay</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={payAmountWithoutInvoice}
                onChangeText={setPayAmountWithoutInvoice} // Separate state
              />
            </View>
            <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Deposit Section */}
        {showDeposit && (
          <View style={styles.withoutInvoiceContainer}>
            <Text style={styles.sectionTitle}>Deposit</Text>
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>Current Balance</Text>
              <Text style={[styles.invoiceLabel, styles.totalDue]}>
                {(paymentData as Deposit).CurrentBalance || '0.00'}
              </Text>
            </View>
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>Advance Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={payAmountDeposit}
                onChangeText={setPayAmountDeposit} // Separate state
              />
            </View>
            <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
              <Text style={styles.payButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PaymentScreen;
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Constants.COLOR.WHITE_COLOR },
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  invoiceCard: {
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 10,
    shadowColor: Constants.COLOR.THEME_COLOR,
    elevation: 3
  },
  errorText: { textAlign: 'center', color: Constants.COLOR.BLACK_COLOR, fontFamily: Constants.FONT_FAMILY.fontFamilyRegular, marginTop: 10 },
  toggleGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ECEEF5',
    borderRadius: 20,
    padding: 5,
    marginBottom: 10,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 25,
  },
  selectedOption: {
    backgroundColor: Constants.COLOR.THEME_COLOR,
  },
  optionText: {
    fontSize: Constants.FONT_SIZE.SM,
    color: Constants.COLOR.BLACK_COLOR,
  },
  selectedOptionText: {
    fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
    fontSize: Constants.FONT_SIZE.S,
    color: Constants.COLOR.WHITE_COLOR,
  },
  iconGroup: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  iconButton: {
    padding: 8,
  },
  checkboxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  checkboxText: {
    fontSize: Constants.FONT_SIZE.S,
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
    color: 'black',
  },
  icon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  invoiceContainer: {
    paddingVertical: 10,
    paddingBottom: 100
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  invoiceLabel: {
    fontSize: Constants.FONT_SIZE.S,
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
    color: Constants.COLOR.BLACK_COLOR,
    flex: 1,
  },
  invoiceLabelValue: {
    fontSize: Constants.FONT_SIZE.S,
    fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
    color: Constants.COLOR.BLACK_COLOR,
    flex: 1,
  },
  payAmountText: {
    color: Constants.COLOR.THEME_COLOR,
  },
  withoutInvoiceContainer: {
    marginTop: 40,
    padding: 15,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderRadius: 10,
    width: '100%',
    alignSelf: "center",
    position: 'relative',
    shadowColor: Constants.COLOR.THEME_COLOR,
    elevation: 3,
  },
  sectionTitle: {
    position: 'absolute',
    top: -12,
    left: '35%',
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    paddingHorizontal: 10,
    fontSize: Constants.FONT_SIZE.M,
    color: Constants.COLOR.THEME_COLOR,
    fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold
  },
  totalDue: {
    color: Constants.COLOR.THEME_COLOR,
    fontSize: Constants.FONT_SIZE.SM,
  },
  input: {
    borderWidth: 0.5,
    borderColor: Constants.COLOR.THEME_COLOR,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flex: 1,
  },
  payButton: {
    backgroundColor: Constants.COLOR.THEME_COLOR,
    paddingVertical: 5,
    marginVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  payButtonText: {
    color: Constants.COLOR.WHITE_COLOR,
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
    fontSize: Constants.FONT_SIZE.S,
  },
});


