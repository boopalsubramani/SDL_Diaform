import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
  ScrollView,
  Animated,
  Alert,
  I18nManager,
  Linking,
  RefreshControl,
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import Constants from '../util/Constants';
import { useFetchApiMutation } from '../redux/service/FetchApiService';
import Spinner from 'react-native-spinkit';
import { useUser } from '../common/UserContext';
import { useTransactionDetailsMutation } from '../redux/service/TransactionDetailsService';
import { useAppSettings } from '../common/AppSettingContext';
import { useInvoiceDownloadMutation } from '../redux/service/InvoiceDownloadService';
import CalendarModal from '../common/Calender';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import SpinnerIndicator from '../common/SpinnerIndicator';

const deviceHeight = Dimensions.get('window').height;

interface TransactionDetail {
  Sid_No: string;
  Sid_Date: string;
  Pay_Type: string;
  Result: string;
  Firm_Name: string;
  Due: string;
  Paid: string;
}

interface PayMode {
  PayMode: string;
  PayDescription: string;
}

interface Language {
  Alignment: 'ltr' | 'rtl';
}

const TransactionScreen = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedPayMode, setSelectedPayMode] = useState<PayMode>({
    PayMode: '',
    PayDescription: 'Pay Mode',
  });
  const { labels } = useAppSettings();
  const [selectedFromDate, setSelectedFromDate] = useState('');
  const [selectedToDate, setSelectedToDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarType, setCalendarType] = useState('');
  const [payModes, setPayModes] = useState<PayMode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetail[]>([]);
  const [noDataFound, setNoDataFound] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<Animated.Value[]>([]);
  const { userData } = useUser();
  const selectedLanguage = useSelector((state: RootState) => state.appSettings.selectedLanguage) as Language | null;
  const [fetchAPIReq] = useFetchApiMutation();
  const [transactionDetailsReq] = useTransactionDetailsMutation();
  const [invoiceDownloadReq] = useInvoiceDownloadMutation();

  useEffect(() => {
    I18nManager.forceRTL(selectedLanguage?.Alignment === 'rtl');
  }, [selectedLanguage]);

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

  // Set up animations when transaction details change
  useEffect(() => {
    setAnimatedValues(transactionDetails.map(() => new Animated.Value(0)));
  }, [transactionDetails]);

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
      fetchTransactionDetails();
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

  const fetchTransactionDetails = async () => {
    setIsLoading(true);
    setNoDataFound(false);
    setTransactionDetails([]);

    try {
      const requestPayload = {
        Usertype: userData?.UserType,
        Username: userData?.UserCode,
        Firm_No: userData?.Branch_Code,
        From_Date: formatDateForRequest(selectedFromDate),
        To_Date: formatDateForRequest(selectedToDate),
        Pay_Type: selectedPayMode.PayMode,
      };

      const response = await transactionDetailsReq(requestPayload).unwrap();

      if (response.SuccessFlag === 'true') {
        if (response.Message && response.Message.length > 0) {
          setTransactionDetails(response.Message);
        } else {
          setNoDataFound(true);
        }
      } else {
        setNoDataFound(true);
        console.warn('Failed to fetch transaction details');
      }
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      setNoDataFound(true);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactionDetails();
  };

  const downloadInvoice = async (invoiceNo: string, invoiceDate: string) => {
    setIsLoading(true);

    try {
      const response = await invoiceDownloadReq({
        Username: userData?.UserCode,
        Usertype: userData?.UserType,
        Firm_No: userData?.Branch_Code,
        Invoice_No: invoiceNo,
        Invoice_Date: invoiceDate,
      }).unwrap();

      if (
        response.SuccessFlag === 'true' &&
        response.Message.length > 0 &&
        response.Message[0]?.InvoiceReport_Url
      ) {
        let fileUrl = response.Message[0].InvoiceReport_Url.trim();
        console.log('Opening URL in Browser:', fileUrl);

        // Ensure URL starts with HTTP/HTTPS
        if (!fileUrl.startsWith('http')) {
          Alert.alert('Error', 'Invalid URL format: ' + fileUrl);
          return;
        }

        // Open URL directly without checking canOpenURL
        await Linking.openURL(fileUrl);
      } else {
        Alert.alert('Error', 'Invalid response. No file URL found.');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred while opening the invoice.');
    } finally {
      setIsLoading(false);
    }
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
      <NavigationBar title="Transaction" />

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
        {isLoading && transactionDetails.length === 0 ? (
          <View style={styles.loaderContainer}>
            <SpinnerIndicator />
          </View>
        ) : noDataFound ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              {getLabel('aboutscr_5')}
            </Text>
          </View>
        ) : transactionDetails.length > 0 ? (
          <FlatList
            data={transactionDetails}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <Animated.View
                style={[
                  styles.detailCard,
                  {
                    opacity: animatedValues[index],
                  },
                ]}
              >
                <View style={styles.detailHeader}>
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>No</Text>
                    <Text style={styles.detailColen}>:</Text>
                    <Text style={styles.detailValue}>{item.Sid_No}</Text>
                  </View>
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailColen}>:</Text>
                    <Text style={styles.detailValue}>{item.Sid_Date}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.downloadButton}
                    onPress={() => downloadInvoice(item.Sid_No, formatDateForRequest(item.Sid_Date))}
                  >
                    <Image source={require('../images/download.png')} style={styles.downloadIcon} />
                  </TouchableOpacity>
                </View>
                <View style={styles.detailBody}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Firm</Text>
                    <Text style={styles.detailColen}>:</Text>
                    <Text style={styles.detailValue}>{item.Firm_Name}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <View style={styles.detailColumn}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Due</Text>
                        <Text style={styles.detailColen}>:</Text>
                        <Text style={styles.detailValue}>{item.Due}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Total</Text>
                        <Text style={styles.detailColen}>:</Text>
                        <Text style={styles.detailValue}>{item.Due}</Text>
                      </View>
                    </View>
                    <View style={styles.detailColumn}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Paid</Text>
                        <Text style={styles.detailColen}>:</Text>
                        <Text style={styles.detailValuePaid}>{item.Paid}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Status</Text>
                        <Text style={styles.detailColen}>:</Text>
                        <Text style={styles.detailValue}>{item.Result}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Animated.View>
            )}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
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

export default TransactionScreen;

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
    marginTop: 10,
  },
  detailCard: {
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderRadius: 10,
    shadowColor: Constants.COLOR.THEME_COLOR,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: '#ddd',
    marginBottom: 15,
    padding: 15,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  detailBody: {
    paddingHorizontal: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  detailColumn: {
    flex: 1,
  },
  detailSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    width: 45,
    fontSize: Constants.FONT_SIZE.S,
    color: Constants.COLOR.BLACK_COLOR,
    fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
  },
  detailColen: {
    fontSize: Constants.FONT_SIZE.S,
    color: Constants.COLOR.BLACK_COLOR,
    fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
  },
  detailValue: {
    fontSize: Constants.FONT_SIZE.S,
    marginLeft: 5,
  },
  detailValuePaid: {
    fontSize: Constants.FONT_SIZE.S,
    color: Constants.COLOR.THEME_COLOR,
    marginLeft: 5,
  },
  downloadButton: {
    padding: 5,
  },
  downloadIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  noDataText: {
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
    fontSize: Constants.FONT_SIZE.SM,
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
  label: {
    fontSize: Constants.FONT_SIZE.S,
    fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


