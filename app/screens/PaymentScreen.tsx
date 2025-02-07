import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, TextInput, Dimensions } from 'react-native';
import NavigationBar from '../common/NavigationBar';
import Constants from "../util/Constants";

const deviceHeight = Dimensions.get('window').height;

const PaymentScreen = () => {
  const [selectedOption, setSelectedOption] = useState('With invoice');
  const [showInvoice, setShowInvoice] = useState(true);
  const [showWithoutInvoice, setShowWithoutInvoice] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [showDeposit, setShowDeposit] = useState(false);

  const options = ['With invoice', 'Without invoice', 'Deposit'];

  const handleOptionPress = ({ option }: any) => {
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
      </View>

      {/* Invoice Section */}
      {showInvoice && (
        <View style={styles.invoiceContainer}>
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Invoice Form:</Text>
            <Text style={styles.invoiceLabel}>01-Bioline Laboratory</Text>
          </View>
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Invoice No:</Text>
            <Text style={styles.invoiceLabel}>00110</Text>
          </View>
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Invoice Date:</Text>
            <Text style={styles.invoiceLabel}>01/01/2020</Text>
          </View>
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Due Amount:</Text>
            <Text style={styles.invoiceLabel}>2280.00</Text>
          </View>
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Pay Amount:</Text>
            <Text style={styles.invoiceLabel}>-000000</Text>
          </View>
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Total:</Text>
            <Text style={styles.invoiceLabel}>-000000</Text>
          </View>
        </View>
      )}

      {/* Without Invoice Section */}
      {showWithoutInvoice && (
        <View style={styles.withoutInvoiceContainer}>
          <Text style={styles.sectionTitle}>Without Invoice</Text>
          <View style={styles.invoiceRow}>
            <Text style={styles.invoiceLabel}>Total Due</Text>
            <Text style={[styles.invoiceLabel, styles.totalDue]}>4930.00</Text>
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
          <TouchableOpacity style={styles.payButton}>
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
            <Text style={[styles.invoiceLabel, styles.totalDue]}>4930.00</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fafcfb' },
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  toggleGroup: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    marginBottom: 10,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 15,
    marginHorizontal: 5,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
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
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  invoiceContainer: {
    marginTop: 40,
    padding: 20,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderRadius: 10,
    borderColor: "#dedfde",
    width: '90%',
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5
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
  withoutInvoiceContainer: {
    marginTop: 40,
    padding: 20,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderRadius: 10,
    borderColor: "#dedfde",
    width: '90%',
    alignSelf: "center",
    position: 'relative',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5
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
    color: '#2646f3',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flex: 1,
    textAlign: 'left',
  },
  payButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: 120,
    alignSelf: 'center',
  },
  payButtonText: {
    color: Constants.COLOR.WHITE_COLOR,
  },
});

export default PaymentScreen;