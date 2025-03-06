import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, TextInput, Dimensions, FlatList, Alert, Linking } from 'react-native';
import NavigationBar from '../common/NavigationBar';
import Constants from "../util/Constants";
import { WebView } from "react-native-webview";
import { usePaymentMutation } from '../redux/service/PaymentService';
import { useUser } from '../common/UserContext';
import { usePaymentGatewayMutation } from '../redux/service/PatmentGatewayService';
import SpinnerIndicator from '../common/SpinnerIndicator';

const deviceHeight = Dimensions.get('window').height;

// Define the types for the API responses
interface Invoice {
  InvoiceFirm: string;
  InvoiceNo: string;
  InvoiceDate: string;
  PatientDue: number;
}

interface WithoutInvoice {
  DueAmount: number;
}

interface Deposit {
  CurrentBalance: number;
}

type PaymentData = Invoice[] | WithoutInvoice | Deposit;



const PaymentScreen = ({ navigation }: any) => {
  const [selectedOption, setSelectedOption] = useState('With invoice');
  const [showInvoice, setShowInvoice] = useState(true);
  const { userData } = useUser();
  const [showWithoutInvoice, setShowWithoutInvoice] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [showDeposit, setShowDeposit] = useState(false);
  const [paymentData, setPaymentData] = useState<PaymentData>([]);
  const [paymentDetailsReq] = usePaymentMutation();
  const [paymentGatewayReq, paymentGatewayResult] = usePaymentGatewayMutation();
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await paymentDetailsReq({
          UserType: userData?.UserType,
          Username: userData?.UserCode,
          PaymentType: selectedOption === 'With invoice' ? 'WI' : selectedOption === 'Without invoice' ? 'WOI' : 'D'
        });
        if (response.data && response.data.SuccessFlag === "true") {
          setPaymentData(response.data.Message);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    fetchPaymentData();
  }, [selectedOption]);

  const options = ['With invoice', 'Without invoice', 'Deposit'];

  const handleOptionPress = (option: any) => {
    console.log(`Selected Option: ${option}`);
    setSelectedOption(option);
    setShowInvoice(option === 'With invoice');
    setShowWithoutInvoice(option === 'Without invoice');
    setShowDeposit(option === 'Deposit');
  };

  useEffect(() => {
    console.log("Component mounted");
    return () => {
      console.log("Component unmounted");
    };
  }, []);

  const handleWithoutInvoice = () => {
    navigation.navigate('Collection');
  };

  const handleWithInvoice = () => {
    navigation.navigate('Transaction');
  };

  const handlePayment = async () => {
    setLoading(true);

    const requestBody = {
      userType: userData?.UserType,
      userCode: "01000175",
      firmNo: "01",
      name: userData?.Names,
      phone: userData?.Mobile,
      email: userData?.Email,
      product:
        selectedOption === "With invoice"
          ? "Due Payment"
          : selectedOption === "Without invoice"
            ? "WOI Payment"
            : "Deposit Payment",
      amount: parseFloat(payAmount) > 0 ? parseFloat(payAmount) : 234.0,
      paymentType:
        selectedOption === "With invoice"
          ? "WI"
          : selectedOption === "Without invoice"
            ? "WOI"
            : "D",
      invoices: [],
    };

    console.log("🔵 Sending Payment API Request:", JSON.stringify(requestBody));

    try {
      const response = await paymentGatewayReq(requestBody);

      console.log("🟢 Payment API Response:", response);

      if (response?.data?.SuccessFlag === "true") {
        const paymentUrl = response?.data?.Message?.paymentUrlList?.[0]?.redirectUrl;

        if (paymentUrl) {
          console.log("🔗 Redirecting to Payment URL:", paymentUrl);
          setPaymentUrl(paymentUrl);  
          // Linking.openURL(paymentUrl);
        } else {
          console.error("❌ Payment URL is missing in response");
        }
      }
    } catch (error) {
      console.error("❌ Payment API Request Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (paymentUrl) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <WebView source={{ uri: paymentUrl }} startInLoadingState renderLoading={() => <SpinnerIndicator />} />
        {/* <TouchableOpacity style={styles.closeButton} onPress={() => setPaymentUrl(null)}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity> */}
      </SafeAreaView>
    );
  }

  const renderInvoiceItem = ({ item }: any) => (
    <View style={styles.invoiceCard}>
      <View style={styles.invoiceRow}>
        <Text style={styles.invoiceLabel}>Invoice Form</Text>
        <Text style={styles.invoiceLabelValue}>{item.Inv_Firm}</Text>
      </View>
      <View style={styles.invoiceRow}>
        <Text style={styles.invoiceLabel}>Invoice No</Text>
        <Text style={styles.invoiceLabelValue}>{item.Inv_No}</Text>
      </View>
      <View style={styles.invoiceRow}>
        <Text style={styles.invoiceLabel}>Invoice Date</Text>
        <Text style={styles.invoiceLabelValue}>{item.Inv_Date}</Text>
      </View>
      <View style={styles.invoiceRow}>
        <Text style={styles.invoiceLabel}>Due Amount</Text>
        <Text style={styles.invoiceLabelValue}>{item.Pat_Due}</Text>
      </View>
      <View style={styles.invoiceRow}>
        <Text style={styles.invoiceLabel}>Pay Amount</Text>
        <TouchableOpacity onPress={handleWithInvoice} style={{ flex: 1 }}>
          <Text style={[styles.invoiceLabelValue, styles.payAmountText]}>{item.Inv_No}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.invoiceRow}>
        <Text style={styles.invoiceLabel}>Total</Text>
        <Text style={styles.invoiceLabelValue}>{item.Inv_No}</Text>
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

        <View style={styles.iconGroup}>
          <TouchableOpacity style={styles.iconButton}>
            <Image source={require('../images/search.png')} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Image source={require('../images/calenderBlack.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>

        {/* Invoice Section */}
        {showInvoice && (
          <FlatList
            data={paymentData}
            renderItem={renderInvoiceItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.invoiceContainer}
            ListEmptyComponent={<Text style={styles.errorText}>No payment data available</Text>}
          />
        )}

        {/* Without Invoice Section */}
        {showWithoutInvoice && (
          <View style={styles.withoutInvoiceContainer}>
            <Text style={styles.sectionTitle}>Without Invoice</Text>
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>Total Due</Text>
              <TouchableOpacity onPress={handleWithoutInvoice} style={{ flex: 1 }}>
                <Text style={[styles.invoiceLabel, styles.totalDue]}>
                  {/* {paymentData.DueAmount ? paymentData.DueAmount : '0.00'} */}
                  {(paymentData as WithoutInvoice).DueAmount ? (paymentData as WithoutInvoice).DueAmount : '0.00'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>Total Pay</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={payAmount}
                onChangeText={setPayAmount}
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
                {(paymentData as Deposit).CurrentBalance ? (paymentData as Deposit).CurrentBalance : '0.00'}
              </Text>
            </View>
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceLabel}>Advance Amount</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                keyboardType="numeric"
                value={payAmount}
                onChangeText={setPayAmount}
              />
            </View>
            <TouchableOpacity style={styles.payButton}>
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
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  errorText: { textAlign: 'center', color: 'red', marginTop: 10 },
  toggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#ECEEF5',
    borderRadius: 20,
    padding: 5,
    marginBottom: 10,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginHorizontal: 5,
    // backgroundColor: '#ECEEF5',
  },
  selectedOption: {
    backgroundColor: Constants.COLOR.THEME_COLOR,
  },
  optionText: {
    fontSize: 14,
    color: Constants.COLOR.BLACK_COLOR,
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: Constants.COLOR.WHITE_COLOR,
  },
  iconGroup: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  iconButton: {
    padding: 8,
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
    marginBottom: 10,
  },
  invoiceLabel: {
    fontSize: 12,
    color: '#333',
    flex: 1,
  },
  invoiceLabelValue: {
    fontSize: 12,
    color: Constants.COLOR.BLACK_COLOR,
    fontWeight: '400',
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
    borderColor: "#dedfde",
    width: '100%',
    alignSelf: "center",
    position: 'relative',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionTitle: {
    position: 'absolute',
    top: -12,
    left: '35%',
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2646f3',
  },
  totalDue: {
    color: Constants.COLOR.THEME_COLOR,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flex: 1,
  },
  payButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    alignSelf: 'center',
  },
  payButtonText: {
    color: Constants.COLOR.WHITE_COLOR,
  },
  closeButton: { position: "absolute", bottom: 20, left: 20, right: 20, backgroundColor: "red", padding: 15, borderRadius: 5, alignItems: "center" },
  closeButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});



