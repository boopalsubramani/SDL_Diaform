import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, TextInput, ScrollView, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import Constants from '../util/Constants';
import TimePickerModal from 'react-native-modal-datetime-picker';
import NavigationBar from '../common/NavigationBar';
import NetInfo from '@react-native-community/netinfo';
import BookTestHeader from './BookTestHeader';
import ButtonBack from '../common/BackButton';
import ButtonNext from '../common/NextButton';

const deviceHeight = Dimensions.get('window').height;

interface Test {
  Service_Name: string;
  Amount: string;
}

const CalendarScreen = ({ navigation, route, showHeader = true }: any) => {
  const { selectedTests = [], selectedPatientDetails, testData } = route?.params || {};
  const [selectedDate, setSelectedDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateInput, setDateInput] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [isChecked, setIsChecked] = useState(false);

  const toggleCalendar = () => setShowCalendar(!showCalendar);
  const toggleTimePicker = () => setShowTimePicker(!showTimePicker);

  useEffect(() => {
    const currentDate = moment().format('YYYY-MM-DD');
    const currentTime = moment().format('hh:mm A');
    setDateInput(`${currentDate} ${currentTime}`);
    setSelectedDate(currentDate);
    setSelectedTime(currentTime);
  }, []);

  const handleDateInputChange = (text: any) => {
    setDateInput(text);
  };

  const handleTimeSelected = (time: any) => {
    const hours = time.getHours();
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const formattedTime = moment({ hours, minutes }).format('hh:mm A');
    setSelectedTime(formattedTime);
    setShowTimePicker(false);
    setDateInput(`${selectedDate} ${formattedTime}`);
  };

  const renderDay = (day: any) => {
    return (
      <View>
        <Text>{day.day}</Text>
        {day.dateString === selectedDate && (
          <Text>{selectedTime}</Text>
        )}
      </View>
    );
  };

  const handleCheckboxToggle = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      // Set current date and time when checked
      const currentDate = moment().format('YYYY-MM-DD');
      const currentTime = moment().format('HH:mm');
      setDateInput(`${currentDate} ${currentTime}`);
      setSelectedDate(currentDate);
      setSelectedTime(currentTime);
    } else {
      // Clear input when unchecked
      setDateInput('');
      setSelectedDate('');
      setSelectedTime('');
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

    // Check if date and time are selected
    if (!selectedDate || !selectedTime) {
      Alert.alert(
        Constants.ALERT.TITLE.INFO,
        Constants.VALIDATION_MSG.NO_DATE_TIME_SELECTED,
      );
      return;
    }

    navigation.navigate('PaymentDetail', { selectedTests, selectedDate, selectedTime, selectedPatientDetails, testData });
  };

  return (
    <View style={styles.container}>
      {showHeader && (
        <>
          <NavigationBar title="Book Test" />
          <BookTestHeader selectValue={2} />
        </>
      )}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.cartSection}>
          <Text style={styles.cartTitle}>Tests in Cart</Text>
          {selectedTests.map((test: Test, index: number) => (
            <View key={index} style={styles.cartItem}>
              <Text style={styles.cartItemName} numberOfLines={2}>{test.Service_Name}</Text>
              <Text style={styles.cartItemPrice}>P {test.Amount}</Text>
            </View>
          ))}
          <View style={styles.cartSubtotal}>
            <Text style={styles.cartSubtotalLabel}>SubTotal</Text>
            <Text style={styles.cartSubtotalAmount}>
              P {selectedTests.reduce((acc: number, test: Test) => acc + parseFloat(test.Amount || '0'), 0).toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.labelAndCheckboxContainer}>
          <Text style={styles.label}>Collect Date and Time</Text>

          {/* Checkbox Row */}
          <View style={styles.checkboxRow}>
            <TouchableOpacity onPress={handleCheckboxToggle} style={styles.checkboxContainer}>
              <View style={[styles.checkbox, isChecked && styles.checkedCheckbox]}>
                {isChecked && <View style={styles.checkmark} />}
              </View>
            </TouchableOpacity>
            <Text style={styles.checkboxText}>Current date and time</Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.dateInput}
            value={dateInput}
            onChangeText={handleDateInputChange}
            placeholder="Select Date and Time"
            placeholderTextColor="black"
            editable={false}
          />
          <TouchableOpacity onPress={toggleCalendar}>
            <Image
              source={require('../images/calendar.png')}
              style={styles.calendarIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleTimePicker}>
            <Image
              source={require('../images/scan.png')}
              style={styles.timeIcon}
            />
          </TouchableOpacity>
        </View>

        {showCalendar && (
          <Calendar
            onDayPress={(day: any) => {
              setSelectedDate(day.dateString);
              setDateInput(`${day.dateString} ${selectedTime}`);
            }}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: Constants.COLOR.THEME_COLOR,
                dots: [{ key: 's0', color: 'blue', selectedDotColor: 'white' }],
              },
            }}
            renderDay={renderDay}
            minDate={moment().format('YYYY-MM-DD')}
          />
        )}

        <TimePickerModal
          isVisible={showTimePicker}
          onConfirm={handleTimeSelected}
          onCancel={toggleTimePicker}
          mode="time"
        />
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
export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
  cartSection: {
    padding: 10,
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
    color: "#4c6f86",
    flex: 1
  },
  cartItemPrice: {
    fontSize: 16,
    color: '#6f6f6f',
  },
  cartSubtotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f2f2f2',
    padding: 10,
  },
  cartSubtotalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#4c6f86",
  },
  cartSubtotalAmount: {
    fontSize: 16,
    color: '#6f6f6f',
  },
  labelAndCheckboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  label: {
    fontSize: 12,
    marginVertical: 5,
    color: Constants.COLOR.BLACK_COLOR,
    fontFamily: "Poppins-Regular",
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  checkbox: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedCheckbox: {
    backgroundColor: Constants.COLOR.THEME_COLOR,
  },
  checkmark: {
    width: 10,
    height: 10,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  checkboxText: {
    fontSize: 12,
    color: Constants.COLOR.BLACK_COLOR,
    fontFamily: "Poppins-Regular",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    paddingHorizontal: 10,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  dateInput: {
    flex: 1,
    marginRight: 5,
  },
  calendarIcon: {
    width: 20,
    height: 20,
    tintColor: "black",
    resizeMode: 'contain',
  },
  timeIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginLeft: 10,
    tintColor: "black",
  },
  navigationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FBFBFB',
    justifyContent: 'space-between',
  },
  scrollContainer: {
    paddingBottom: 80,
  },
});

