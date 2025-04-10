import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Dimensions, Image,
  TextInput, ScrollView, Alert, I18nManager
} from 'react-native';
import moment from 'moment';
import Constants from '../util/Constants';
import { useAppSettings } from '../common/AppSettingContext';
import TimePickerModal from 'react-native-modal-datetime-picker';
import NavigationBar from '../common/NavigationBar';
import NetInfo from '@react-native-community/netinfo';
import BookTestHeader from './BookTestHeader';
import ButtonBack from '../common/BackButton';
import ButtonNext from '../common/NextButton';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox } from 'react-native-paper';
import { RootState } from '../redux/Store';
import CalendarModal from '../common/Calender';
import { updateBookingDetails, updateSelectedTest } from '../redux/slice/BookTestSearchSlice';

const deviceHeight = Dimensions.get('window').height;

interface Test {
  Service_Name: string;
  Amount: number;
}

interface Language {
  Alignment: 'ltr' | 'rtl';
  Code: string
}

// const CalendarScreen = ({ navigation, route, showHeader = true }: any) => {
//   const dispatch = useDispatch();
//   const { labels, settings } = useAppSettings();

//   const {
//     selectedTests = [],
//     selectedPatientDetails,
//     testData,
//     patientData,
//     imageUri,
//     fromPaymentDetailsScreen,
//   } = route?.params || {};
//   const selectedLanguage = useSelector((state: RootState) => state.appSettings.selectedLanguage) as Language | null;
//   const updatedCart = useSelector((state: RootState) => state.bookTestSearch.updatedCartData) || [];
//   const bookingItems = useSelector((state: RootState) => state.bookTestSearch.bookingDetails) || [];
//   const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
//   const [selectedTime, setSelectedTime] = useState(moment().format('hh:mm A'));
//   const [dateInput, setDateInput] = useState(`${moment().format('YYYY-MM-DD hh:mm A')}`);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const [isChecked, setIsChecked] = useState(false);

//   const effectRan = useRef(false);

//   useEffect(() => {
//     I18nManager.forceRTL(selectedLanguage?.Alignment === 'rtl');
//   }, [selectedLanguage]);

//   useEffect(() => {
//     if (!effectRan.current) {
//       effectRan.current = true;
//       return;
//     }

//     if (fromPaymentDetailsScreen) {
//       dispatch(updateBookingDetails(bookingItems));
//     } else {
//       dispatch(updateSelectedTest(updatedCart?.flat() || []));
//     }
//   }, [fromPaymentDetailsScreen, dispatch]);

//   const getLabel = (key: string) => labels?.[key]?.defaultMessage || '';

//   const handleDateSelection = (date: Date) => {
//     const selectedDateMoment = moment(date);

//     if (!selectedDateMoment.isValid()) {
//       Alert.alert('Error', 'Invalid date selected.');
//       return;
//     }

//     if (selectedDateMoment.isBefore(moment(), 'day')) {
//       Alert.alert('Invalid Selection', 'Past dates are not allowed.');
//       return;
//     }

//     useEffect(() => {
//       setDateInput(`${selectedDate} ${selectedTime}`);
//     }, []);

//     const dateString = selectedDateMoment.format('YYYY-MM-DD');
//     setSelectedDate(dateString);
//     setSelectedTime('');
//     setDateInput(`${dateString}`);
//     setShowCalendar(false);
//   };

//   const handleTimeSelected = (time: Date) => {
//     const now = moment();
//     const selectedMoment = moment(time);

//     if (selectedDate === now.format('YYYY-MM-DD') && selectedMoment.isBefore(now, 'minute')) {
//       Alert.alert('Invalid Time', 'Please select a future time.');
//       return;
//     }

//     const formattedTime = selectedMoment.format('hh:mm A');
//     setSelectedTime(formattedTime);
//     setDateInput(`${selectedDate} ${formattedTime}`);
//     setShowTimePicker(false);
//   };

//   const handleCheckboxToggle = () => {
//     const newCheckedState = !isChecked;
//     setIsChecked(newCheckedState);

//     if (newCheckedState) {
//       const currentDate = moment().format('YYYY-MM-DD');
//       const currentTime = moment().format('hh:mm A');
//       setSelectedDate(currentDate);
//       setSelectedTime(currentTime);
//       setDateInput(`${currentDate} ${currentTime}`);
//     } else {
//       setSelectedDate('');
//       setSelectedTime('');
//       setDateInput('');
//     }
//   };

//   const handleBack = async () => {
//     const state = await NetInfo.fetch();
//     if (!state.isConnected) {
//       Alert.alert('Error', 'No internet connection.');
//       return;
//     }
//     navigation.goBack();
//   };

//   const handleNext = async () => {
//     const state = await NetInfo.fetch();
//     if (!state.isConnected) {
//       Alert.alert('Error', 'No internet connection.');
//       return;
//     }

//     if (settings?.CollectDate_Mandatory === 'Y' && (!selectedDate || !selectedTime)) {
//       Alert.alert('Info', 'Please select a date and time.');
//       return;
//     }

//     navigation.navigate('PaymentDetail', {
//       selectedTests,
//       selectedDate,
//       selectedTime,
//       selectedPatientDetails,
//       testData,
//       patientData,
//       fromPaymentDetailsScreen,
//       imageUri
//     });
//   };

//   return (
//     <View style={styles.container}>
//       {showHeader && (
//         <>
//           <NavigationBar title="Book Test" />
//           <BookTestHeader selectValue={2} />
//         </>
//       )}

//       <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
//         {/* <View style={styles.cartSection}>
//           <Text style={styles.cartTitle}>{getLabel('labtsummary_5')}</Text>

//           {(fromPaymentDetailsScreen ? bookingItems : updatedCart.flat())?.map((test, index) => (
//             <View key={index} style={styles.cartItem}>
//               <Text style={styles.cartItemName} numberOfLines={2}>
//                 {test.Service_Name || "N/A"}
//               </Text>
//               <Text style={styles.cartItemPrice}>
//                 {test.Service_Amount || test.Amount || "0"}
//               </Text>
//             </View>
//           ))}

//           <View style={styles.cartSubtotal}>
//             <Text style={styles.cartSubtotalLabel}>{getLabel('labtsummary_6')}</Text>
//             <Text style={styles.cartSubtotalAmount}>
//               (P) {(fromPaymentDetailsScreen ? bookingItems : updatedCart.flat())?.reduce(
//                 (acc, test) => acc + (test?.Service_Amount || test?.Amount || 0),
//                 0
//               ).toFixed(2)}
//             </Text>
//           </View>
//         </View> */}

//         {imageUri ? (
//           <View style={styles.cartSectionPatientDetails}>
//             <Text style={styles.cartTitle}>Patient Details</Text>
//             <View style={styles.cartItemPatientDetails}>
//               <View style={styles.detailRow}>
//                 <Text style={styles.cartItemBookingName}>{selectedPatientDetails?.PtName || selectedPatientDetails?.Pt_Name || ''}</Text>
//               </View>
//               <View style={styles.detailRow}>
//                 <Text style={styles.cartItemName}>{selectedPatientDetails?.Street || 'Not Registered'}</Text>
//               </View>
//               <View style={styles.detailRow}>
//                 <Text style={styles.cartItemName}>{selectedPatientDetails?.Street1 || 'Not Registered'}</Text>
//               </View>
//               <View style={styles.detailRow}>
//                 <Text style={styles.cartItemName}>{selectedPatientDetails?.Mobile_No || 'Not Registered'}</Text>
//               </View>
//             </View>
//           </View>
//         ) : (
//           <View style={styles.cartSection}>
//             <Text style={styles.cartTitle}>{getLabel('labtsummary_5')}</Text>
//             {(fromPaymentDetailsScreen ? bookingItems : updatedCart.flat())?.map((test, index) => (
//               <View key={index} style={styles.cartItem}>
//                 <Text style={styles.cartItemName} numberOfLines={2}>
//                   {test.Service_Name || "N/A"}
//                 </Text>
//                 <Text style={styles.cartItemPrice}>
//                   {test.Service_Amount || test.Amount || "0"}
//                 </Text>
//               </View>
//             ))}
//             <View style={styles.cartSubtotal}>
//               <Text style={styles.cartSubtotalLabel}>{getLabel('labtsummary_6')}</Text>
//               <Text style={styles.cartSubtotalAmount}>
//                 (P) {(fromPaymentDetailsScreen ? bookingItems : updatedCart.flat())?.reduce(
//                   (acc, test) => acc + (test?.Service_Amount || test?.Amount || 0),
//                   0
//                 ).toFixed(2)}
//               </Text>
//             </View>
//           </View>
//         )}

//         {settings?.CollectDate_Mandatory === 'Y' && (
//           <View style={styles.labelAndCheckboxContainer}>
//             <Text style={styles.label}>Collect Date and Time</Text>
//             <Checkbox status={isChecked ? 'checked' : 'unchecked'} onPress={handleCheckboxToggle} />
//           </View>
//         )}

//         <View style={styles.inputContainer}>
//           <TextInput style={styles.dateInput} value={dateInput} editable={false} placeholder="Select Date and Time" />
//           <TouchableOpacity onPress={() => setShowCalendar(true)}>
//             <Image source={require('../images/calendar.png')} style={styles.calendarIcon} />
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => setShowTimePicker(true)}>
//             <Image source={require('../images/scan.png')} style={styles.timeIcon} />
//           </TouchableOpacity>
//         </View>

//         <CalendarModal isVisible={showCalendar} onConfirm={handleDateSelection} onCancel={() => setShowCalendar(false)} />
//         <TimePickerModal isVisible={showTimePicker} onConfirm={handleTimeSelected} onCancel={() => setShowTimePicker(false)} />
//       </ScrollView>

//       <View style={styles.navigationContainer}>
//         <TouchableOpacity onPress={handleBack}><ButtonBack /></TouchableOpacity>
//         <TouchableOpacity onPress={handleNext}><ButtonNext /></TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default CalendarScreen;

const CalendarScreen = ({ navigation, route, showHeader = true }: any) => {
  const dispatch = useDispatch();
  const { labels, settings } = useAppSettings();

  const {
    selectedTests = [],
    selectedPatientDetails,
    testData,
    patientData,
    imageUri,
    fromPaymentDetailsScreen,
  } = route?.params || {};
  const selectedLanguage = useSelector((state: RootState) => state.appSettings.selectedLanguage) as Language | null;
  const updatedCart = useSelector((state: RootState) => state.bookTestSearch.updatedCartData) || [];
  const bookingItems = useSelector((state: RootState) => state.bookTestSearch.bookingDetails) || [];
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedTime, setSelectedTime] = useState(moment().format('hh:mm A'));
  const [dateInput, setDateInput] = useState(`${moment().format('YYYY-MM-DD hh:mm A')}`);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const effectRan = useRef(false);

  useEffect(() => {
    I18nManager.forceRTL(selectedLanguage?.Alignment === 'rtl');
  }, [selectedLanguage]);

  useEffect(() => {
    if (!effectRan.current) {
      effectRan.current = true;
      return;
    }

    if (fromPaymentDetailsScreen) {
      dispatch(updateBookingDetails(bookingItems));
    } else {
      dispatch(updateSelectedTest(updatedCart?.flat() || []));
    }
  }, [fromPaymentDetailsScreen, dispatch]);

  const getLabel = (key: string) => labels?.[key]?.defaultMessage || '';

  const handleDateSelection = (date: Date) => {
    const selectedDateMoment = moment(date);

    if (!selectedDateMoment.isValid()) {
      Alert.alert('Error', 'Invalid date selected.');
      return;
    }

    if (selectedDateMoment.isBefore(moment(), 'day')) {
      Alert.alert('Invalid Selection', 'Past dates are not allowed.');
      return;
    }

    const dateString = selectedDateMoment.format('YYYY-MM-DD');
    setSelectedDate(dateString);
    setSelectedTime('');
    setDateInput(`${dateString}`);
    setShowCalendar(false);
  };

  const handleTimeSelected = (time: Date) => {
    const now = moment();
    const selectedMoment = moment(time);

    if (selectedDate === now.format('YYYY-MM-DD') && selectedMoment.isBefore(now, 'minute')) {
      Alert.alert('Invalid Time', 'Please select a future time.');
      return;
    }

    const formattedTime = selectedMoment.format('hh:mm A');
    setSelectedTime(formattedTime);
    setDateInput(`${selectedDate} ${formattedTime}`);
    setShowTimePicker(false);
  };

  const handleCheckboxToggle = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);

    if (newCheckedState) {
      const currentDate = moment().format('YYYY-MM-DD');
      const currentTime = moment().format('hh:mm A');
      setSelectedDate(currentDate);
      setSelectedTime(currentTime);
      setDateInput(`${currentDate} ${currentTime}`);
    } else {
      setSelectedDate('');
      setSelectedTime('');
      setDateInput('');
    }
  };

  const handleBack = async () => {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      Alert.alert('Error', 'No internet connection.');
      return;
    }
    navigation.goBack();
  };

  const handleNext = async () => {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      Alert.alert('Error', 'No internet connection.');
      return;
    }

    if (settings?.CollectDate_Mandatory === 'Y' && (!selectedDate || !selectedTime)) {
      Alert.alert('Info', 'Please select a date and time.');
      return;
    }

    navigation.navigate('PaymentDetail', {
      selectedTests,
      selectedDate,
      selectedTime,
      selectedPatientDetails,
      testData,
      patientData,
      fromPaymentDetailsScreen,
      imageUri
    });
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
        {imageUri ? (
          <View style={styles.cartSectionPatientDetails}>
            <Text style={styles.cartTitle}>Patient Details</Text>
            <View style={styles.cartItemPatientDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.cartItemBookingName}>{selectedPatientDetails?.PtName || selectedPatientDetails?.Pt_Name || ''}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.cartItemName}>{selectedPatientDetails?.Street || 'Not Registered'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.cartItemName}>{selectedPatientDetails?.Street1 || 'Not Registered'}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.cartItemName}>{selectedPatientDetails?.Mobile_No || 'Not Registered'}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.cartSection}>
            <Text style={styles.cartTitle}>{getLabel('labtsummary_5')}</Text>
            {(fromPaymentDetailsScreen ? bookingItems : updatedCart.flat())?.map((test, index) => (
              <View key={index} style={styles.cartItem}>
                <Text style={styles.cartItemName} numberOfLines={2}>
                  {test.Service_Name || "N/A"}
                </Text>
                <Text style={styles.cartItemPrice}>
                  {test.Service_Amount || test.Amount || "0"}
                </Text>
              </View>
            ))}
            <View style={styles.cartSubtotal}>
              <Text style={styles.cartSubtotalLabel}>{getLabel('labtsummary_6')}</Text>
              <Text style={styles.cartSubtotalAmount}>
                (P) {(fromPaymentDetailsScreen ? bookingItems : updatedCart.flat())?.reduce(
                  (acc, test) => acc + (test?.Service_Amount || test?.Amount || 0),
                  0
                ).toFixed(2)}
              </Text>
            </View>
          </View>
        )}

        {settings?.CollectDate_Mandatory === 'Y' && (
          <View style={styles.labelAndCheckboxContainer}>
            <Text style={styles.label}>Collect Date and Time</Text>
            <Checkbox status={isChecked ? 'checked' : 'unchecked'} onPress={handleCheckboxToggle} />
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput style={styles.dateInput} value={dateInput} editable={false} placeholder="Select Date and Time" />
          <TouchableOpacity onPress={() => setShowCalendar(true)}>
            <Image source={require('../images/calendar.png')} style={styles.calendarIcon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowTimePicker(true)}>
            <Image source={require('../images/scan.png')} style={styles.timeIcon} />
          </TouchableOpacity>
        </View>

        <CalendarModal isVisible={showCalendar} onConfirm={handleDateSelection} onCancel={() => setShowCalendar(false)} />
        <TimePickerModal isVisible={showTimePicker} onConfirm={handleTimeSelected} onCancel={() => setShowTimePicker(false)} />
      </ScrollView>

      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={handleBack}><ButtonBack /></TouchableOpacity>
        <TouchableOpacity onPress={handleNext}><ButtonNext /></TouchableOpacity>
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
  cartItemBookingName: {
    fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
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
    tintColor:Constants.COLOR.BLACK_COLOR,
    resizeMode: 'contain',
  },
  timeIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginLeft: 10,
    tintColor:Constants.COLOR.BLACK_COLOR,
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
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  cartSectionPatientDetails: {
    padding: 10,
  },
  cartItemPatientDetails: {
    backgroundColor: '#ECEEF5',
    padding: 10,
  },
});




