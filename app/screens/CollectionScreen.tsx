import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  FlatList,
  Alert,
  RefreshControl
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import Constants from '../util/Constants';
import { useFetchApiMutation } from '../redux/service/FetchApiService';
import Spinner from 'react-native-spinkit';
import { useCollectionDetailsMutation } from '../redux/service/CollectionDetailsService';
import { useUser } from '../common/UserContext';
import { useAppSettings } from '../common/AppSettingContext';
import CalendarModal from '../common/Calender';
import SpinnerIndicator from '../common/SpinnerIndicator';


interface PayMode {
  PayMode: string;
  PayDescription: string;
}

interface TransactionDetail {
  Branch_Desc: string;
  Sid_No: string;
  Sid_Date: string;
  Ref_Type: string;
  Ref_Name: string;
  PName: string;
  Pay_Mode: string;
  Bill_Time: string;
  Bill_Date: string;
  Bill_No: string;
  Bill_Amount: string;
}

const CollectionScreen = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedPayMode, setSelectedPayMode] = useState<PayMode>({
    PayMode: '',
    PayDescription: 'Pay Mode',
  });
  const { settings } = useAppSettings();
  const [selectedFromDate, setSelectedFromDate] = useState('');
  const [selectedToDate, setSelectedToDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarType, setCalendarType] = useState('');
  const [payModes, setPayModes] = useState<PayMode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noDataFound, setNoDataFound] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<Animated.Value[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { userData } = useUser();
  const [collectionDetails, setCollectionDetails] = useState<TransactionDetail[]>([]);

  const [fetchAPIReq] = useFetchApiMutation();
  const [collectionDetailsReq] = useCollectionDetailsMutation();

  const labels = settings?.Message?.[0]?.Labels || {};

  const getLabel = (key: string) => {
    return labels[key]?.defaultMessage || '';
  };

  const formatDate = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error("Invalid date object:", date);
      return "Invalid Date";
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForRequest = (date: string) => {
    const [day, month, year] = date.split('/');
    return `${year}/${month}/${day}`;
  };

  // Initialize with current date
  useEffect(() => {
    const currentDate = new Date();
    setSelectedFromDate(formatDate(currentDate));
    setSelectedToDate(formatDate(currentDate));
    fetchPayModeList();
  }, []);

  // Set up animations when collection details change
  useEffect(() => {
    setAnimatedValues(collectionDetails.map(() => new Animated.Value(0)));
  }, [collectionDetails]);

  // Trigger animations
  useEffect(() => {
    Animated.stagger(100, animatedValues.map((animatedValue) => {
      return Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      });
    })).start();
  }, [animatedValues]);

  // Fetch data when filters change
  useEffect(() => {
    if (selectedFromDate && selectedToDate) {
      fetchCollectionDetails();
    }
  }, [selectedPayMode.PayMode, selectedFromDate, selectedToDate]);

  const fetchPayModeList = async () => {
    setIsLoading(true);
    try {
      const fetchTitleObj = {
        Mode: 'Y',
        Command: 'OLXV65571F',
      };
      const response = await fetchAPIReq(fetchTitleObj).unwrap();
      if (response?.TableData?.Paymodes) {
        setPayModes(response.TableData.Paymodes);
      } else {
        console.warn('No Paymodes found in response');
      }
    } catch (error) {
      console.error('Error fetching pay modes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCollectionDetails = async () => {
    setIsLoading(true);
    setNoDataFound(false);
    setCollectionDetails([]);

    try {
      const requestPayload = {
        Usertype: userData?.UserType,
        Username: userData?.UserCode,
        Firm_No: userData?.Branch_Code,
        From_Date: formatDateForRequest(selectedFromDate),
        To_Date: formatDateForRequest(selectedToDate),
        Pay_Type: selectedPayMode.PayMode,
      };

      const response = await collectionDetailsReq(requestPayload).unwrap();

      if (response.SuccessFlag === 'true') {
        if (response.Message && response.Message.length > 0) {
          setCollectionDetails(response.Message);
        } else {
          setNoDataFound(true);
        }
      } else {
        setNoDataFound(true);
        console.warn('Failed to fetch collection details');
      }
    } catch (error) {
      console.error('Error fetching collection details:', error);
      setNoDataFound(true);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCollectionDetails();
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const openCalendar = (type: string) => {
    setCalendarType(type);
    setShowCalendar(true);
  };

  const handleDateSelection = (selectedDate: Date) => {
    const formattedDate = formatDate(new Date(selectedDate));
    const selectedDateObj = new Date(selectedDate);

    if (calendarType === 'from') {
      const toDateObj = new Date(selectedToDate.split('/').reverse().join('-'));
      if (selectedDateObj > toDateObj) {
        Alert.alert('Invalid Date Range', 'The "From" date cannot be later than the "To" date.');
        return;
      }
      setSelectedFromDate(formattedDate);
    } else {
      const fromDateObj = new Date(selectedFromDate.split('/').reverse().join('-'));
      if (selectedDateObj < fromDateObj) {
        Alert.alert('Invalid Date Range', 'The "To" date must be greater than or equal to the "From" date.');
        return;
      }
      setSelectedToDate(formattedDate);
    }
    setShowCalendar(false);
  };

  const handlePaymentModeSelect = (item: PayMode) => {
    setSelectedPayMode(item);
    setDropdownVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationBar title="Collection" />

      {/* Filter Controls */}
      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Payment</Text>
          <View style={styles.card}>
            <TouchableOpacity onPress={toggleDropdown} style={styles.dropdown}>
              <Text style={styles.dropdownText}>{selectedPayMode.PayDescription}</Text>
              <Image
                source={dropdownVisible ? require('../images/arrowUp.png') : require('../images/arrowDown.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>From</Text>
          <View style={styles.card}>
            <TouchableOpacity onPress={() => openCalendar('from')} style={styles.dropdown}>
              <Text style={styles.dropdownText}>{selectedFromDate}</Text>
              <Image source={require('../images/calendar.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>To</Text>
          <View style={styles.card}>
            <TouchableOpacity onPress={() => openCalendar('to')} style={styles.dropdown}>
              <Text style={styles.dropdownText}>{selectedToDate}</Text>
              <Image source={require('../images/calendar.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content Area */}
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {isLoading && collectionDetails.length === 0 ? (
          <View style={styles.loaderContainer}>
            <SpinnerIndicator />
          </View>
        ) : noDataFound ? (
          <View style={styles.noDataContainer}>
            <Text style={{ color: Constants.COLOR.BLACK_COLOR, fontFamily: 'Poppins-Regular' }}>
              {getLabel('aboutscr_5')}
            </Text>
          </View>
        ) : collectionDetails.length > 0 ? (
          <View style={styles.detailsContainer}>
            {collectionDetails.map((detail, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.detailCard,
                  {
                    opacity: animatedValues[index],
                  },
                ]}
              >
                <View style={{ flexDirection: "row" }}>
                  <View style={styles.Column1}>
                    <Text style={styles.CardBookingNo}>Branch</Text>
                    <Text style={styles.CardBookingNo}>SID No & Date</Text>
                    <Text style={styles.CardBookingNo}>Ref Type</Text>
                    <Text style={styles.CardBookingNo}>Ref Name</Text>
                    <Text style={styles.CardBookingNo}>Patient</Text>
                  </View>
                  <View style={styles.Column2}>
                    <View style={styles.columnContainer}>
                      <Text style={styles.detailValue}>{detail.Branch_Desc}</Text>
                      <Text style={styles.detailValue}>{detail.Sid_No} & {detail.Sid_Date}</Text>
                      <Text style={styles.detailValue}>{detail.Ref_Type}</Text>
                      <Text style={styles.detailValue}>{detail.Ref_Name}</Text>
                      <Text style={styles.detailValue}>{detail.PName}</Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', }}>
                  <View style={styles.Row1}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.BillText}>Bill Mode </Text>
                      <Text style={styles.BillTextValue}>{detail.Pay_Mode}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', borderTopWidth: 0.3 }}>
                      <Text style={styles.BillText}>Bill Time </Text>
                      <Text style={styles.BillTextValue}>{detail.Bill_Time}</Text>
                    </View>
                  </View>

                  <View style={styles.Row2}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.BillText}>Bill Date </Text>
                      <Text style={styles.BillTextValue}>{detail.Bill_Date}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', borderTopWidth: 0.3 }}>
                      <Text style={styles.BillText}>Bill No </Text>
                      <Text style={styles.BillTextValue}>{detail.Bill_No}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', borderTopWidth: 0.3 }}>
                      <Text style={styles.BillText}>Bill Amount</Text>
                      <Text style={styles.BillTextValue}>{detail.Bill_Amount}.00</Text>
                    </View>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={{ color: Constants.COLOR.BLACK_COLOR, fontFamily: 'Poppins-Regular' }}>
              {getLabel('aboutscr_5')}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Payment Mode Dropdown */}
      <Modal visible={dropdownVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={() => setDropdownVisible(false)} />
        <View style={styles.dropdownMenu}>
          {isLoading ? (
            <SpinnerIndicator />
          ) : (
            <FlatList
              data={payModes}
              keyExtractor={(item) => item.PayMode}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handlePaymentModeSelect(item)}
                >
                  <Text style={styles.dropdownItemText}>{item.PayDescription}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </Modal>

      {/* Calendar Modal */}
      <CalendarModal
        isVisible={showCalendar}
        onConfirm={handleDateSelection}
        onCancel={() => setShowCalendar(false)}
        mode="date"
        onClose={false}
      />
    </SafeAreaView>
  );
};
export default CollectionScreen;



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
  },
  container: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 10
  },
  card: {
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderRadius: 8,
    shadowColor: Constants.COLOR.THEME_COLOR,
    elevation: 3,
    padding: 10,
    width: '100%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: Constants.FONT_SIZE.S,
    fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  dropdownText: {
    fontSize: Constants.FONT_SIZE.XS,
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
  },
  icon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  detailsContainer: {
    marginTop: 20,
  },
  detailCard: {
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderRadius: 8,
    shadowColor: Constants.COLOR.THEME_COLOR,
    elevation: 3,
    borderWidth: 0.2,
    marginBottom: 10,
    flex: 1,
    height: 'auto',
  },
  Column1: {
    backgroundColor: Constants.COLOR.THEME_COLOR,
    borderTopLeftRadius: 8,
    alignItems: 'flex-end',
    width: '40%',
    overflow: 'hidden',
  },
  CardBookingNo: {
    fontSize: 12,
    color: Constants.COLOR.WHITE_COLOR,
    fontWeight: '600',
    paddingHorizontal: 5,
    paddingVertical: 3,
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
  },
  Column2: {
    width: '60%',
    flexDirection: "row",
    justifyContent: 'flex-start',
    borderTopRightRadius: 8,
  },
  columnContainer: {
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 3,
    paddingHorizontal: 5,
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
  },
  Row1: {
    width: '50%',
    overflow: 'hidden',
    borderBottomLeftRadius: 8,
    borderTopWidth: 0.5,
    borderRightWidth: 0.5
  },
  Row2: {
    width: '50%',
    overflow: 'hidden',
    borderBottomRightRadius: 8,
    borderTopWidth: 0.5
  },
  BillText: {
    fontSize: 12,
    color: Constants.COLOR.BLACK_COLOR,
    paddingHorizontal: 5,
    paddingVertical: 5,
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
  },
  BillTextValue: {
    fontSize: 12,
    color: Constants.COLOR.BLACK_COLOR,
    flex: 1,
    textAlign: 'right',
    paddingHorizontal: 10,
    fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownMenu: {
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    maxHeight: 300,
    paddingHorizontal: 10,
  },
  dropdownItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownItemText: {
    fontSize: Constants.FONT_SIZE.XS,
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

