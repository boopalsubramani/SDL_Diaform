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
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import NavigationBar from '../common/NavigationBar';
import Constants from '../util/Constants';
import { useFetchApiMutation } from '../redux/service/FetchApiService';
import Spinner from 'react-native-spinkit';
import { useUser } from '../common/UserContext';
import { useTransactionDetailsMutation } from '../redux/service/TransactionDetailsService';
import { useAppSettings } from '../common/AppSettingContext';
import { useInvoiceDownloadMutation } from '../redux/service/InvoiceDownloadService';
import RNFS from 'react-native-fs';


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

// const TransactionScreen = () => {
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [selectedPayMode, setSelectedPayMode] = useState({
//     PayMode: '',
//     PayDescription: 'Pay Mode',
//   });
//   const { settings } = useAppSettings();
//   const [selectedFromDate, setSelectedFromDate] = useState('');
//   const [selectedToDate, setSelectedToDate] = useState('');
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [calendarType, setCalendarType] = useState('');
//   const [payModes, setPayModes] = useState<PayMode[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [transactionDetails, setTransactionDetails] = useState<TransactionDetail[]>([]);
//   const [noDataFound, setNoDataFound] = useState(false);
//   const [animatedValues, setAnimatedValues] = useState<Animated.Value[]>([]);
//   const { userData } = useUser();

//   const [fetchAPIReq] = useFetchApiMutation();
//   const [transactionDetailsReq] = useTransactionDetailsMutation();
//   const [invoiceDownloadReq] = useInvoiceDownloadMutation();


//   const labels = settings?.Message?.[0]?.Labels || {};

//   const getLabel = (key: string) => {
//     return labels[key]?.defaultMessage || '';
//   };

//   const formatDate = (date: any) => {
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   const formatDateForRequest = (date: string) => {
//     const [day, month, year] = date.split('/');
//     return `${year}/${month}/${day}`;
//   };

//   useEffect(() => {
//     const currentDate = new Date();
//     setSelectedFromDate(formatDate(currentDate));
//     setSelectedToDate(formatDate(currentDate));
//     fetchPayModeList();
//   }, []);

//   useEffect(() => {
//     // Initialize animated values when transactionDetails change
//     setAnimatedValues(transactionDetails.map(() => new Animated.Value(0)));
//   }, [transactionDetails]);

//   useEffect(() => {
//     Animated.stagger(100, animatedValues.map((animatedValue) => {
//       return Animated.timing(animatedValue, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//       });
//     })).start();
//   }, [animatedValues]);

//   const fetchPayModeList = async () => {
//     setIsLoading(true);
//     try {
//       const fetchTitleObj = {
//         Mode: 'Y',
//         Command: 'OLXV65571F',
//       };
//       const response = await fetchAPIReq(fetchTitleObj).unwrap();
//       if (response?.TableData?.Paymodes) {
//         setPayModes(response.TableData.Paymodes);
//       } else {
//         console.warn('No Paymodes found in response');
//       }
//     } catch (error) {
//       console.error('Error fetching pay modes:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchTransactionDetails = async () => {
//     setIsLoading(true);
//     setNoDataFound(false);
//     try {
//       const requestPayload = {
//         Usertype: userData?.UserType,
//         Username: userData?.UserCode,
//         Firm_No: '01',
//         From_Date: formatDateForRequest(selectedFromDate),
//         To_Date: formatDateForRequest(selectedToDate),
//         Pay_Type: selectedPayMode.PayMode,
//       };
//       const response = await transactionDetailsReq(requestPayload).unwrap();
//       if (response.SuccessFlag === 'true') {
//         if (response.Message.length > 0) {
//           setTransactionDetails(response.Message);
//         } else {
//           setNoDataFound(true);
//         }
//       } else {
//         console.warn('Failed to fetch collection details');
//       }
//     } catch (error) {
//       console.error('Error fetching collection details:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const toggleDropdown = () => {
//     setDropdownVisible(!dropdownVisible);
//     fetchTransactionDetails();
//   };

//   const openCalendar = (type: any) => {
//     setCalendarType(type);
//     setShowCalendar(true);
//   };

//   const handleDateSelection = (day: any) => {
//     if (calendarType === 'from') {
//       setSelectedFromDate(day.dateString.split('-').reverse().join('/'));
//     } else {
//       setSelectedToDate(day.dateString.split('-').reverse().join('/'));
//     }
//     setShowCalendar(false);
//     fetchTransactionDetails();
//   };

//   const filterTransactionsByDate = (transactions: TransactionDetail[]) => {
//     const fromDate = new Date(selectedFromDate.split('/').reverse().join('-'));
//     const toDate = new Date(selectedToDate.split('/').reverse().join('-'));

//     return transactions.filter((transaction) => {
//       const transactionDate = new Date(transaction.Sid_Date.split('/').reverse().join('-'));
//       return transactionDate >= fromDate && transactionDate <= toDate;
//     });
//   };

//   const filteredTransactionDetails = filterTransactionsByDate(transactionDetails);

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <NavigationBar title="Transaction" />
//       <ScrollView contentContainerStyle={styles.container}>
//         <View style={styles.row}>
//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Payment</Text>
//             <View style={styles.card}>
//               <TouchableOpacity onPress={toggleDropdown} style={styles.dropdown}>
//                 <Text style={styles.dropdownText}>{selectedPayMode.PayDescription}</Text>
//                 <Image
//                   source={
//                     dropdownVisible
//                       ? require('../images/arrowUp.png')
//                       : require('../images/arrowDown.png')
//                   }
//                   style={styles.icon}
//                 />
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>From</Text>
//             <View style={styles.card}>
//               <TouchableOpacity onPress={() => openCalendar('from')} style={styles.dropdown}>
//                 <Text style={styles.dropdownText}>{selectedFromDate}</Text>
//                 <Image source={require('../images/calendar.png')} style={styles.icon} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>To</Text>
//             <View style={styles.card}>
//               <TouchableOpacity onPress={() => openCalendar('to')} style={styles.dropdown}>
//                 <Text style={styles.dropdownText}>{selectedToDate}</Text>
//                 <Image source={require('../images/calendar.png')} style={styles.icon} />
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>

//         {noDataFound ? (
//           <View style={styles.noDataContainer}>
//             <Text style={styles.noDataText}>{getLabel('aboutscr_5')}</Text>
//           </View>
//         ) : (
//           filteredTransactionDetails && filteredTransactionDetails.length > 0 ? (
//             <FlatList
//               data={filteredTransactionDetails}
//               keyExtractor={(item, index) => index.toString()}
//               renderItem={({ item, index }) => (
//                 <Animated.View
//                   style={[
//                     styles.detailCard,
//                     {
//                       opacity: animatedValues[index],

//                     },
//                   ]}
//                 >
//                   <View style={styles.detailHeader}>
//                     <View style={styles.detailSection}>
//                       <Text style={styles.detailLabel}>No : </Text>
//                       <Text style={styles.detailValue}>{item.Sid_No}</Text>
//                     </View>
//                     <View style={styles.detailSection}>
//                       <Text style={styles.detailLabel}>Date : </Text>
//                       <Text style={styles.detailValue}>{item.Sid_Date}</Text>
//                     </View>
//                     <TouchableOpacity style={styles.downloadButton}>
//                       <Image source={require('../images/download.png')} style={styles.downloadIcon} />
//                     </TouchableOpacity>
//                   </View>
//                   <View style={styles.detailBody}>
//                     <View style={styles.detailRow}>
//                       <Text style={styles.detailLabel}>Firm : </Text>
//                       <Text style={styles.detailValue}>{item.Firm_Name}</Text>
//                     </View>
//                     <View style={styles.detailRow}>
//                       <View style={styles.detailColumn}>
//                         <View style={styles.detailRow}>
//                           <Text style={styles.detailLabel}>Due : </Text>
//                           <Text style={styles.detailValue}>{item.Due}</Text>
//                         </View>
//                         <View style={styles.detailRow}>
//                           <Text style={styles.detailLabel}>Total : </Text>
//                           <Text style={styles.detailValue}>{item.Due}</Text>
//                         </View>
//                       </View>
//                       <View style={styles.detailColumn}>
//                         <View style={styles.detailRow}>
//                           <Text style={styles.detailLabel}>Paid : </Text>
//                           <Text style={styles.detailValuePaid}>{item.Paid}</Text>
//                         </View>
//                         <View style={styles.detailRow}>
//                           <Text style={styles.detailLabel}>Status : </Text>
//                           <Text style={styles.detailValue}>{item.Result}</Text>
//                         </View>
//                       </View>
//                     </View>
//                   </View>
//                 </Animated.View>
//               )}
//             />
//           ) : (
//             <View style={styles.noDataContainer}>
//               <Text style={styles.noDataText}>{getLabel('aboutscr_5')}</Text>
//             </View>
//           )
//         )}
//       </ScrollView>

//       <Modal visible={dropdownVisible} transparent animationType="fade">
//         <TouchableOpacity style={styles.overlay} onPress={() => setDropdownVisible(false)} />
//         <View style={styles.dropdownMenu}>
//           {isLoading ? (
//             <Spinner
//               isVisible={true}
//               size={40}
//               type={'Wave'}
//               color={Constants.COLOR.THEME_COLOR}
//             />
//           ) : (
//             <FlatList
//               data={payModes}
//               keyExtractor={(item) => item.PayMode}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.dropdownItem}
//                   onPress={() => {
//                     setSelectedPayMode(item);
//                     setDropdownVisible(false);
//                     fetchTransactionDetails();
//                   }}
//                 >
//                   <Text style={styles.dropdownItemText}>{item.PayDescription}</Text>
//                 </TouchableOpacity>
//               )}
//             />
//           )}
//         </View>
//       </Modal>

//       <Modal visible={showCalendar} transparent animationType="slide">
//         <TouchableOpacity
//           style={styles.overlay}
//           onPress={() => setShowCalendar(false)}
//         />
//         <View style={styles.calendarContainer}>
//           <Calendar
//             onDayPress={handleDateSelection}
//             markedDates={{
//               [selectedFromDate.split('/').reverse().join('-')]: {
//                 selected: true,
//                 selectedColor: '#5cb85c',
//               },
//               [selectedToDate.split('/').reverse().join('-')]: {
//                 selected: true,
//                 selectedColor: '#5cb85c',
//               },
//             }}
//           />
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default TransactionScreen;


const TransactionScreen = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedPayMode, setSelectedPayMode] = useState({
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
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetail[]>([]);
  const [noDataFound, setNoDataFound] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<Animated.Value[]>([]);
  const { userData } = useUser();

  const [fetchAPIReq] = useFetchApiMutation();
  const [transactionDetailsReq] = useTransactionDetailsMutation();
  const [invoiceDownloadReq] = useInvoiceDownloadMutation();

  const labels = settings?.Message?.[0]?.Labels || {};

  const getLabel = (key: string) => {
    return labels[key]?.defaultMessage || '';
  };

  const formatDate = (date: any) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForRequest = (date: string) => {
    const [day, month, year] = date.split('/');
    return `${year}/${month}/${day}`;
  };

  useEffect(() => {
    const currentDate = new Date();
    setSelectedFromDate(formatDate(currentDate));
    setSelectedToDate(formatDate(currentDate));
    fetchPayModeList();
  }, []);

  useEffect(() => {
    // Initialize animated values when transactionDetails change
    setAnimatedValues(transactionDetails.map(() => new Animated.Value(0)));
  }, [transactionDetails]);

  useEffect(() => {
    Animated.stagger(100, animatedValues.map((animatedValue) => {
      return Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      });
    })).start();
  }, [animatedValues]);

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
    try {
      const requestPayload = {
        Usertype: userData?.UserType,
        Username: userData?.UserCode,
        Firm_No: '01',
        From_Date: formatDateForRequest(selectedFromDate),
        To_Date: formatDateForRequest(selectedToDate),
        Pay_Type: selectedPayMode.PayMode,
      };
      const response = await transactionDetailsReq(requestPayload).unwrap();
      if (response.SuccessFlag === 'true') {
        if (response.Message.length > 0) {
          setTransactionDetails(response.Message);
        } else {
          setNoDataFound(true);
        }
      } else {
        console.warn('Failed to fetch collection details');
      }
    } catch (error) {
      console.error('Error fetching collection details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadInvoice = async (invoiceNo: string, invoiceDate: string) => {
    setIsLoading(true);
    try {
      const requestPayload = {
        Username: userData?.UserCode,
        Usertype: userData?.UserType,
        Firm_No: '01',
        Invoice_No: invoiceNo,
        Invoice_Date: invoiceDate,
      };
      console.log('Request Payload:', requestPayload);

      const response = await invoiceDownloadReq(requestPayload).unwrap();

      if (response.SuccessFlag === 'true') {
        // Assuming the response contains a URL to the invoice file
        const fileUrl = response.FileUrl; // Replace with the actual key from the response
        const fileExtension = fileUrl.split('.').pop();
        const localFilepath = `${RNFS.DownloadDirectoryPath}/invoice_${invoiceNo}.${fileExtension}`;

        // Check permissions
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to your storage to download files',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.error('Storage permission denied');
            Alert.alert('Permission Denied', 'Storage permission is required to download the invoice.');
            return;
          }
        }

        // Download the file
        RNFS.downloadFile(fileUrl)
          .promise.then(() => {
            Alert.alert('Download Successful', 'Invoice has been saved to your gallery.');
          })
          .catch(error => {
            console.error('Error downloading file:', error);
            Alert.alert('Download Failed', 'There was an error downloading the invoice.');
          });
      } else {
        console.error('Error downloading invoice:', response.Message[0].Message);
        Alert.alert('Error', response.Message[0].Message);
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      Alert.alert('Unexpected Error', 'An unexpected error occurred while downloading the invoice.');
    } finally {
      setIsLoading(false);
    }
  };


  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
    fetchTransactionDetails();
  };

  const openCalendar = (type: any) => {
    setCalendarType(type);
    setShowCalendar(true);
  };

  const handleDateSelection = (day: any) => {
    if (calendarType === 'from') {
      setSelectedFromDate(day.dateString.split('-').reverse().join('/'));
    } else {
      setSelectedToDate(day.dateString.split('-').reverse().join('/'));
    }
    setShowCalendar(false);
    fetchTransactionDetails();
  };

  const filterTransactionsByDate = (transactions: TransactionDetail[]) => {
    const fromDate = new Date(selectedFromDate.split('/').reverse().join('-'));
    const toDate = new Date(selectedToDate.split('/').reverse().join('-'));

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.Sid_Date.split('/').reverse().join('-'));
      return transactionDate >= fromDate && transactionDate <= toDate;
    });
  };

  const filteredTransactionDetails = filterTransactionsByDate(transactionDetails);

  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationBar title="Transaction" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.row}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Payment</Text>
            <View style={styles.card}>
              <TouchableOpacity onPress={toggleDropdown} style={styles.dropdown}>
                <Text style={styles.dropdownText}>{selectedPayMode.PayDescription}</Text>
                <Image
                  source={
                    dropdownVisible
                      ? require('../images/arrowUp.png')
                      : require('../images/arrowDown.png')
                  }
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

        {noDataFound ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>{getLabel('aboutscr_5')}</Text>
          </View>
        ) : (
          filteredTransactionDetails && filteredTransactionDetails.length > 0 ? (
            <FlatList
              data={filteredTransactionDetails}
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
                      <Text style={styles.detailLabel}>No : </Text>
                      <Text style={styles.detailValue}>{item.Sid_No}</Text>
                    </View>
                    <View style={styles.detailSection}>
                      <Text style={styles.detailLabel}>Date : </Text>
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
                      <Text style={styles.detailLabel}>Firm : </Text>
                      <Text style={styles.detailValue}>{item.Firm_Name}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <View style={styles.detailColumn}>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Due : </Text>
                          <Text style={styles.detailValue}>{item.Due}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Total : </Text>
                          <Text style={styles.detailValue}>{item.Due}</Text>
                        </View>
                      </View>
                      <View style={styles.detailColumn}>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Paid : </Text>
                          <Text style={styles.detailValuePaid}>{item.Paid}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Status : </Text>
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
              <Text style={styles.noDataText}>{getLabel('aboutscr_5')}</Text>
            </View>
          )
        )}
      </ScrollView>

      <Modal visible={dropdownVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={() => setDropdownVisible(false)} />
        <View style={styles.dropdownMenu}>
          {isLoading ? (
            <Spinner
              isVisible={true}
              size={40}
              type={'Wave'}
              color={Constants.COLOR.THEME_COLOR}
            />
          ) : (
            <FlatList
              data={payModes}
              keyExtractor={(item) => item.PayMode}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedPayMode(item);
                    setDropdownVisible(false);
                    fetchTransactionDetails();
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item.PayDescription}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </Modal>

      <Modal visible={showCalendar} transparent animationType="slide">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setShowCalendar(false)}
        />
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDateSelection}
            markedDates={{
              [selectedFromDate.split('/').reverse().join('-')]: {
                selected: true,
                selectedColor: '#5cb85c',
              },
              [selectedToDate.split('/').reverse().join('-')]: {
                selected: true,
                selectedColor: '#5cb85c',
              },
            }}
          />
        </View>
      </Modal>
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
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  inputContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 6,
    marginRight: 5,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: Constants.FONT_SIZE.XS,
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
  },
  icon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    marginLeft: 5,
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailCard: {
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 0.2,
    marginBottom: 15,
  },
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#ECEEF5',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  detailBody: {
    paddingHorizontal: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 12,
    color: 'black',
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 12,
    color: '#495057',
    marginLeft: 5,
  },
  detailValuePaid: {
    fontSize: 12,
    color: '#007BFF',
    marginLeft: 5,
  },
  downloadButton: {
    padding: 5,
  },
  downloadIcon: {
    width: 14,
    height: 14,
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
  calendarContainer: {
    flex: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
  },
  label: {
    fontSize: Constants.FONT_SIZE.S,
    fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
  },
});




