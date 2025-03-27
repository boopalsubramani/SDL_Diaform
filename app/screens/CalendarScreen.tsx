import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, TextInput, ScrollView, Alert, I18nManager } from 'react-native';
import moment from 'moment';
import Constants from '../util/Constants';
import { useAppSettings } from '../common/AppSettingContext';
import TimePickerModal from 'react-native-modal-datetime-picker';
import NavigationBar from '../common/NavigationBar';
import NetInfo from '@react-native-community/netinfo';
import BookTestHeader from './BookTestHeader';
import ButtonBack from '../common/BackButton';
import ButtonNext from '../common/NextButton';
import { useSelector } from 'react-redux';
import { Checkbox } from 'react-native-paper';
import { RootState } from '../redux/Store';
import CalendarModal from '../common/Calender';

const deviceHeight = Dimensions.get('window').height;

interface Test {
  Service_Name: string;
  Amount: number;
}

interface Language {
  Alignment: 'ltr' | 'rtl';
}

const CalendarScreen = ({ navigation, route, showHeader = true }: any) => {
  const { selectedTests = [], selectedPatientDetails, testData, patientData } = route?.params || {};
  const { labels, settings } = useAppSettings();
  const [selectedDate, setSelectedDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateInput, setDateInput] = useState('');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [currentYear, setCurrentYear] = useState(moment().year());
  const selectedLanguage = useSelector((state: RootState) => state.appSettings.selectedLanguage) as Language | null;
  const updatedCart = useSelector(
    (state: RootState) => state.bookTestSearch.updatedCartData
  ) as Test[];
  const toggleCalendar = () => setShowCalendar(!showCalendar);
  const toggleTimePicker = () => setShowTimePicker(!showTimePicker);

  console.log('patientDataCalender', patientData);

  useEffect(() => {
    I18nManager.forceRTL(selectedLanguage?.Alignment === 'rtl');
  }, [selectedLanguage]);

  const getLabel = (key: string) => {
    return labels[key]?.defaultMessage || '';
  };

  const handleDateInputChange = (text: string) => {
    setDateInput(text);
  };

  const handleTimeSelected = (time: moment.MomentInput) => {
    const now = moment();
    const selectedMoment = moment(time);
    if (selectedDate === now.format('YYYY-MM-DD') && selectedMoment.isBefore(now, 'minute')) {
      Alert.alert('Invalid Time', 'Please select a future time.');
      return;
    }

    const formattedTime = selectedMoment.format('hh:mm A');
    setSelectedTime(formattedTime);
    setShowTimePicker(false);

    setDateInput(`${selectedDate || now.format('YYYY-MM-DD')} ${formattedTime}`);
  };

  const handleDateSelection = (date: moment.MomentInput) => {
    if (!date) {
      console.error('Invalid date object:', date);
      return;
    }

    const selectedDateMoment = moment(date);
    const yesterday = moment().subtract(1, 'days').startOf('day');

    if (selectedDateMoment.isAfter(yesterday, 'day')) {
      Alert.alert('Invalid Selection', 'Future dates are not allowed. Please select a past date.');
      return;
    }

    const dateString = selectedDateMoment.format('YYYY-MM-DD');
    setSelectedDate(dateString);
    setSelectedTime('');
    setDateInput(`${dateString} ${selectedTime || ''}`);
    setShowCalendar(false);
  };

  const handleCheckboxToggle = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      const currentDate = moment().format('YYYY-MM-DD');
      const currentTime = moment().format('hh:mm A');
      setDateInput(`${currentDate} ${currentTime}`);
      setSelectedDate(currentDate);
      setSelectedTime(currentTime);
    } else {
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

    if (settings?.CollectDate_Mandatory === 'Y' && (!selectedDate || !selectedTime)) {
      Alert.alert(
        Constants.ALERT.TITLE.INFO,
        Constants.VALIDATION_MSG.NO_DATE_TIME_SELECTED,
      );
      return;
    }

    navigation.navigate('PaymentDetail', { selectedTests, selectedDate, selectedTime, selectedPatientDetails, testData, patientData });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const year = moment().year();
      if (year !== currentYear) {
        setCurrentYear(year);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentYear]);

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
          <Text style={styles.cartTitle}>{getLabel('labtsummary_5')}</Text>
          {updatedCart.map((test, index) => {
            return (
              <View key={index} style={styles.cartItem}>
                <Text style={styles.cartItemName} numberOfLines={2}>{test.Service_Name}</Text>
                <Text style={styles.cartItemPrice}>{test.Amount}</Text>
              </View>
            );
          })}
          <View style={styles.cartSubtotal}>
            <Text style={styles.cartSubtotalLabel}>{getLabel('labtsummary_6')}</Text>
            <Text style={styles.cartSubtotalAmount}>
              (P) {updatedCart.reduce((acc, test) => acc + test.Amount, 0).toFixed(2).toString()}
            </Text>
          </View>
        </View>

        {settings?.CollectDate_Mandatory === 'Y' && (
          <>
            <View style={styles.labelAndCheckboxContainer}>
              <Text style={styles.label}>Collect Date and Time</Text>
              <View style={styles.checkboxRow}>
                <Checkbox
                  status={isChecked ? 'checked' : 'unchecked'}
                  onPress={handleCheckboxToggle}
                />
                <Text style={styles.checkboxText}>Current date and time</Text>
              </View>
            </View>
          </>
        )}

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
          <CalendarModal
            isVisible={showCalendar}
            onConfirm={handleDateSelection}
            onCancel={() => setShowCalendar(false)}
            mode="date"
            maximumDate={moment().subtract(1, 'days').toDate()}
          />
        )}

        <TimePickerModal
          isVisible={showTimePicker}
          onConfirm={handleTimeSelected}
          onCancel={toggleTimePicker}
          mode="time"
          minimumDate={selectedDate === moment().format('YYYY-MM-DD') ? new Date() : undefined}
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
    backgroundColor: Constants.COLOR.WHITE_COLOR,
  },
  cartSection: {
    padding: 10,
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
  },
  cartItemPrice: {
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,

  },
  cartSubtotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ECEEF5',
    padding: 10,
  },
  cartSubtotalLabel: {
    fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
    color: Constants.COLOR.FONT_COLOR_DEFAULT,
    flex: 0.6,
    textAlign: 'right',
  },
  cartSubtotalAmount: {
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
    color: Constants.COLOR.THEME_COLOR,
    flex: 0.3,
    textAlign: 'right',
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
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
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
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
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
