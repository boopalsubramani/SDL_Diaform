import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
  I18nManager,
  FlexAlignType,
  ViewStyle,
} from 'react-native';
import moment from 'moment';
import Constants from '../util/Constants';
import NavigationBar from '../common/NavigationBar';
import { useBookingListMutation } from '../redux/service/BookingListService';
import Spinner from 'react-native-spinkit';
import LinearGradient from 'react-native-linear-gradient';
import { useFetchApiMutation } from '../redux/service/FetchApiService';
import SpinnerIndicator from '../common/SpinnerIndicator';
import { useUser } from '../common/UserContext';
import { useAppSettings } from '../common/AppSettingContext';
import CalendarModal from '../common/Calender';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';



const { height: deviceHeight, } = Dimensions.get('window');
const { width, height } = Dimensions.get('window');


// Define the type for the item object
interface BookingItem {
  Is_Cancelled: string;
  Booking_No: string;
  Booking_Date: string;
  Booking_Time: string;
  Booking_Status_Desc: string;
  Branch_Name: string;
  Pt_Name: string;
  Pt_First_Age: string;
  Pt_Gender: string;
  Sid_No: string;
  BookingType_ColorCode: string;
  Remarks?: string;
  Firm_No: string;
}

interface Language {
  Alignment: 'ltr' | 'rtl';
  Code: string
}


// const BookingScreen = ({ navigation, route }: any) => {
//   const { userData } = useUser();
//   const { labels } = useAppSettings();
//   const [bookingListAPIReq] = useBookingListMutation();
//   const [bookingData, setBookingData] = useState<BookingItem[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [dropdownType, setDropdownType] = useState<string | null>(null);
//   const [selectedBranch, setSelectedBranch] = useState('');
//   const [selectedStatus, setSelectedStatus] = useState('');
//   const [selectedDate, setSelectedDate] = useState('');
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [branches, setBranches] = useState<any[]>([]);
//   const [status, setStatus] = useState<any[]>([]);
//   const [firmNo, setFirmNo] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const selectedLanguage = useSelector((state: RootState) => state.appSettings.selectedLanguage) as Language | null;


//   const [fetchAPIReq] = useFetchApiMutation();
//   const branchCode = userData?.Branch_Code;

//   useEffect(() => {
//     I18nManager.forceRTL(selectedLanguage?.Alignment === 'rtl');
//   }, [selectedLanguage]);


//   const getLabel = (key: string) => {
//     return labels[key]?.defaultMessage || '';
//   };

//   const formatDate = (date: string | Date) => moment(date).format('YYYY/MM/DD');

//   useEffect(() => {
//     const currentDate = new Date();
//     setSelectedDate(formatDate(currentDate));
//     fetchData('branch');
//     fetchData('status');
//     fetchBookingData();
//   }, []);

//   const fetchData = async (type: 'branch' | 'status', branchNo = branchCode) => {
//     setIsLoading(true);
//     try {
//       const fetchTitleObj = {
//         Mode: type === 'branch' ? 'B' : 'S',
//         Command: 'OLXV65571F',
//         body: type === 'branch' ? { branchNo } : undefined,
//       };
//       const response = await fetchAPIReq(fetchTitleObj).unwrap();
//       if (response?.TableData?.data1) {
//         if (type === 'branch') setBranches(response.TableData.data1);
//         if (type === 'status') setStatus(response.TableData.data1);
//       }
//     } catch (error) {
//       console.error(`Error fetching ${type}:`, error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const toggleDropdown = (type: string) => {
//     setDropdownType(type);
//     setDropdownVisible(!dropdownVisible);
//   };

//   const handleSelection = (item: any) => {
//     if (dropdownType === 'branch') {
//       setSelectedBranch(item.Branch_Name);
//     } else if (dropdownType === 'status') {
//       setSelectedStatus(item.StatusDesc);
//     }
//     setDropdownVisible(false);
//   };

//   useEffect(() => {
//     if (selectedBranch) {
//       const var1 = selectedBranch.split('-')[0];
//       setFirmNo(var1);
//     }
//   }, [selectedBranch]);

//   useEffect(() => {
//     fetchBookingData();
//   }, [selectedBranch, selectedStatus, firmNo, selectedDate]);

//   const fetchBookingData = async () => {
//     setLoading(true);
//     try {
//       const payload = {
//         App_Type: 'R',
//         UserType: userData?.UserType,
//         Username: userData?.UserCode,
//         Branch: selectedBranch || '',
//         Status: selectedStatus || '',
//         Firm_No: firmNo || '',
//       };

//       const response = await bookingListAPIReq(payload).unwrap();
//       if (response?.Message?.length > 0) {
//         let allBookings = response.Message[0].Booking_Detail || [];
//         if (selectedBranch || selectedStatus || selectedDate || firmNo) {
//           allBookings = allBookings.filter((item: { Branch_Name: string; Booking_Status_Desc: string; Firm_No: string; Booking_Date: string; }) => {
//             const branchMatch = !selectedBranch || item.Branch_Name.includes(selectedBranch.split('-')[1].trim());
//             const statusMatch = !selectedStatus || item.Booking_Status_Desc.trim() === selectedStatus.trim();
//             const firmMatch = !firmNo || item.Firm_No === firmNo;
//             const bookingDate = moment(item.Booking_Date, 'YYYY/MM/DD').format('YYYY/MM/DD');
//             const selectedDateFormatted = moment(selectedDate, 'YYYY/MM/DD').format('YYYY/MM/DD');
//             const dateMatch = !selectedDate || bookingDate === selectedDateFormatted;
//             return branchMatch && statusMatch && firmMatch && dateMatch;
//           });
//         }
//         setBookingData(allBookings);
//       } else {
//         setBookingData([]);
//       }
//     } catch (error) {
//       console.error('Error fetching booking data:', error);
//       setBookingData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchBookingData();
//     setRefreshing(false);
//   };

//   const handleBookingDetail = (item: BookingItem) => {
//     if (!item.Sid_No || item.Sid_No.trim() === '') {
//       navigation.navigate('PaymentDetail', {
//         showCancel: true,
//         fromBookingScreen: true,
//         booking: item
//       });
//     } else {
//       navigation.navigate('BookingDetail', { booking: item });
//     }
//   };

//   const CardItem = ({ item }: { item: BookingItem }) => {
//     const formattedBookingDate = moment(item.Booking_Date, 'YYYY/MM/DD').format('MMM');
//     const formattedBookingDateAndYear = moment(item.Booking_Date, 'YYYY/MM/DD').format('D, YYYY');
//     const isCollectionCompleted = item.Booking_Status_Desc === 'Collection Completed';

//     return (
//       <TouchableOpacity onPress={() => handleBookingDetail(item)}>
//         <LinearGradient
//           colors={['white', 'white']}
//           style={[styles.CardContainer]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//         >
//           <View style={styles.Column1}>
//             <View style={styles.ServiceContainer}>
//               <Text style={styles.ServiceText}>Service</Text>
//               <Text style={styles.ServiceText}>No & Date</Text>
//             </View>
//             <Text style={styles.CardBookingNo}>{item.Booking_No}</Text>
//             <Text style={styles.CardMonthDate}>{formattedBookingDate}</Text>
//             <Text style={styles.CardMonthDate}>{formattedBookingDateAndYear}</Text>
//           </View>

//           <View style={styles.LocationContainer}>
//             <Image source={require('../images/placeholder.png')} style={styles.LocationImg} />
//             <Text style={styles.PlaceText} numberOfLines={2}>
//               {item.Branch_Name}
//             </Text>
//           </View>

//           <View style={styles.CardDetails}>
//             <Text style={styles.PatientDetails}>
//               {item.Pt_Name}, {item.Pt_First_Age}, {item.Pt_Gender}
//             </Text>

//             <View style={styles.RowContainer}>
//               <Text style={styles.SIDText}>SID:</Text>
//               <Text style={styles.CardTextNumber}>{item.Sid_No}</Text>

//               <View style={styles.DateContainer}>
//                 <Image source={require('../images/calendar.png')} style={styles.CalendarIcon} />
//                 <Text style={styles.BookDate}>{item.Booking_Date}</Text>
//               </View>
//             </View>

//             <View style={styles.StatusAndPayContainer}>
//               <Text style={[
//                 styles.StatusText,
//                 isCollectionCompleted && {
//                   backgroundColor: item.BookingType_ColorCode,
//                   color: 'black',
//                 },
//               ]}
//                 numberOfLines={1}>
//                 {item.Booking_Status_Desc}
//               </Text>
//               <TouchableOpacity style={styles.ButtonPayNowView}>
//                 <Text style={styles.ButtonPayNow}>{getLabel('bkrow_9')}</Text>
//               </TouchableOpacity>
//             </View>

//             {item.Is_Cancelled === 'True' && (
//               <View style={styles.CancelRemarks}>
//                 <Text style={styles.CancelText}>
//                   Remarks: {item.Remarks || 'No remarks available'}
//                 </Text>
//               </View>
//             )}
//           </View>
//         </LinearGradient>
//       </TouchableOpacity >
//     );
//   };

//   return (
//     <View style={styles.ScreenContainer}>
//       <NavigationBar title="Bookings" />

//       <View style={styles.filterBar}>
//         <TouchableOpacity
//           onPress={() => toggleDropdown('branch')}
//           style={styles.dropdown}
//         >
//           <Text style={styles.text}>{selectedBranch || getLabel('managebrscr_1')}</Text>
//           <Image
//             source={
//               dropdownType === 'branch' && dropdownVisible
//                 ? require('../images/arrowUp.png')
//                 : require('../images/arrowDown.png')
//             }
//             style={styles.icon}
//           />
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={() => toggleDropdown('status')}
//           style={styles.dropdown}
//         >
//           <Text style={styles.text}>{selectedStatus || 'Select Status'}</Text>
//           <Image
//             source={
//               dropdownType === 'status' && dropdownVisible
//                 ? require('../images/arrowUp.png')
//                 : require('../images/arrowDown.png')
//             }
//             style={styles.icon}
//           />
//         </TouchableOpacity>

//         <View style={styles.inputContainerDob}>
//           <TouchableOpacity
//             style={styles.touchableContainer}
//             onPress={() => setShowCalendar(true)}
//           >
//             <Text style={styles.input}>
//               {selectedDate || 'Select Date'}
//             </Text>
//             <Image
//               source={require('../images/calendar.png')}
//               style={styles.CalenderImg}
//             />
//           </TouchableOpacity>
//           {showCalendar && (
//             // <CalendarModal
//             //   isVisible={showCalendar}
//             //   onConfirm={(day: any) => {
//             //     const date = new Date(day);
//             //     if (!isNaN(date.getTime())) {
//             //       const formattedDate = formatDate(date);
//             //       setSelectedDate(formattedDate);
//             //       setShowCalendar(false);
//             //     } else {
//             //       console.error("Invalid date string:", day);
//             //     }
//             //   }}
//             //   onCancel={() => setShowCalendar(false)}
//             //   mode="date"  
//             // />

//             <CalendarModal 
//             selectedLanguage={selectedLanguage}/>

//           )}
//         </View>
//       </View>

//       <Modal visible={dropdownVisible} transparent animationType="fade">
//         <TouchableOpacity
//           style={styles.overlay}
//           onPress={() => setDropdownVisible(false)}
//         />
//         <View style={styles.dropdownMenu}>
//           {isLoading ? (
//             <Spinner
//               style={{
//                 marginTop: deviceHeight / 10,
//                 alignItems: 'center',
//                 alignSelf: 'center',
//               }}
//               isVisible={true}
//               size={40}
//               type={'Wave'}
//               color={Constants.COLOR.THEME_COLOR}
//             />
//           ) : (
//             <FlatList
//               data={dropdownType === 'branch' ? branches : status}
//               keyExtractor={(item, index) =>
//                 item.Firm_No || index.toString()
//               }
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.dropdownItem}
//                   onPress={() => handleSelection(item)}
//                 >
//                   <Text style={styles.text}>
//                     {dropdownType === 'branch' ? item.Branch_Name : item.StatusDesc}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             />
//           )}
//         </View>
//       </Modal>

//       {loading ? (
//         <View style={styles.loaderContainer}>
//           <SpinnerIndicator />
//         </View>
//       ) : (
//         <FlatList
//           data={bookingData}
//           keyExtractor={(item) => item.Booking_No}
//           renderItem={({ item }) => <CardItem item={item} />}
//           refreshing={refreshing}
//           onRefresh={handleRefresh}
//           ListEmptyComponent={() => (
//             <View style={styles.EmptyListContainer}>
//               {loading ? (
//                 <SpinnerIndicator />
//               ) : (
//                 <View style={{ flex: 1 }}>
//                   <Text style={{ color: Constants.COLOR.BLACK_COLOR, fontFamily: Constants.FONT_FAMILY.fontFamilyRegular, }}>{getLabel('aboutscr_5')}</Text>
//                 </View>
//               )}
//             </View>
//           )}
//         />
//       )}
//     </View>
//   );
// };

// export default BookingScreen;

const BookingScreen = ({ navigation, route }: any) => {
  const { userData } = useUser();
  const { labels } = useAppSettings();
  const [bookingListAPIReq] = useBookingListMutation();
  const [bookingData, setBookingData] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownType, setDropdownType] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);
  const [status, setStatus] = useState<any[]>([]);
  const [firmNo, setFirmNo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const selectedLanguage = useSelector((state: RootState) => state.appSettings.selectedLanguage) as Language | null;

  const [fetchAPIReq] = useFetchApiMutation();
  const branchCode = userData?.Branch_Code;

  useEffect(() => {
    I18nManager.forceRTL(selectedLanguage?.Alignment === 'rtl');
  }, [selectedLanguage]);

  const getLabel = (key: string) => {
    return labels[key]?.defaultMessage || '';
  };

  const formatDate = (date: string | Date) => moment(date).format('YYYY/MM/DD');

  useEffect(() => {
    const currentDate = new Date();
    setSelectedDate(formatDate(currentDate));
    fetchData('branch');
    fetchData('status');
    fetchBookingData();
  }, []);


  const getColumn1Style = (selectedLanguage: any): ViewStyle => {
    const isRTL = selectedLanguage?.Code === 'ar-SA';
    return {
      flexDirection: 'column',
      backgroundColor: Constants.COLOR.THEME_COLOR,
      borderTopLeftRadius: isRTL ? 0 : 15,
      borderBottomLeftRadius: isRTL ? 0 : 15,
      borderTopRightRadius: isRTL ? 15 : 0,
      borderBottomRightRadius: isRTL ? 15 : 0,
      justifyContent: 'space-between',
      // alignItems: 'flex-end',
      alignItems: 'flex-end' as FlexAlignType,
      width: '30%',
      paddingBottom: 4,
      overflow: 'hidden',
    };
  };


  const fetchData = async (type: 'branch' | 'status', branchNo = branchCode) => {
    setIsLoading(true);
    try {
      const fetchTitleObj = {
        Mode: type === 'branch' ? 'B' : 'S',
        Command: 'OLXV65571F',
        body: type === 'branch' ? { branchNo } : undefined,
      };
      const response = await fetchAPIReq(fetchTitleObj).unwrap();
      if (response?.TableData?.data1) {
        if (type === 'branch') setBranches(response.TableData.data1);
        if (type === 'status') setStatus(response.TableData.data1);
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDropdown = (type: string) => {
    setDropdownType(type);
    setDropdownVisible(!dropdownVisible);
  };

  const handleSelection = (item: any) => {
    if (dropdownType === 'branch') {
      setSelectedBranch(item.Branch_Name);
    } else if (dropdownType === 'status') {
      setSelectedStatus(item.StatusDesc);
    }
    setDropdownVisible(false);
  };

  useEffect(() => {
    if (selectedBranch) {
      const var1 = selectedBranch.split('-')[0];
      setFirmNo(var1);
    }
  }, [selectedBranch]);

  useEffect(() => {
    fetchBookingData();
  }, [selectedBranch, selectedStatus, firmNo, selectedDate]);

  const fetchBookingData = async () => {
    setLoading(true);
    try {
      const payload = {
        App_Type: 'R',
        UserType: userData?.UserType,
        Username: userData?.UserCode,
        Branch: selectedBranch || '',
        Status: selectedStatus || '',
        Firm_No: firmNo || '',
      };

      const response = await bookingListAPIReq(payload).unwrap();
      if (response?.Message?.length > 0) {
        let allBookings = response.Message[0].Booking_Detail || [];
        if (selectedBranch || selectedStatus || selectedDate || firmNo) {
          allBookings = allBookings.filter((item: { Branch_Name: string; Booking_Status_Desc: string; Firm_No: string; Booking_Date: string; }) => {
            const branchMatch = !selectedBranch || item.Branch_Name.includes(selectedBranch.split('-')[1].trim());
            const statusMatch = !selectedStatus || item.Booking_Status_Desc.trim() === selectedStatus.trim();
            const firmMatch = !firmNo || item.Firm_No === firmNo;
            const bookingDate = moment(item.Booking_Date, 'YYYY/MM/DD').format('YYYY/MM/DD');
            const selectedDateFormatted = moment(selectedDate, 'YYYY/MM/DD').format('YYYY/MM/DD');
            const dateMatch = !selectedDate || bookingDate === selectedDateFormatted;
            return branchMatch && statusMatch && firmMatch && dateMatch;
          });
        }
        setBookingData(allBookings);
      } else {
        setBookingData([]);
      }
    } catch (error) {
      console.error('Error fetching booking data:', error);
      setBookingData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBookingData();
    setRefreshing(false);
  };

  const handleBookingDetail = (item: BookingItem) => {
    if (!item.Sid_No || item.Sid_No.trim() === '') {
      navigation.navigate('PaymentDetail', {
        showCancel: true,
        fromBookingScreen: true,
        booking: item
      });
    } else {
      navigation.navigate('BookingDetail', { booking: item });
    }
  };

  const CardItem = ({ item }: { item: BookingItem }) => {
    const formattedBookingDate = moment(item.Booking_Date, 'YYYY/MM/DD').format('MMM');
    const formattedBookingDateAndYear = moment(item.Booking_Date, 'YYYY/MM/DD').format('D, YYYY');
    const isCollectionCompleted = item.Booking_Status_Desc === 'Collection Completed';


    return (
      <TouchableOpacity onPress={() => handleBookingDetail(item)}>
        <LinearGradient
          colors={['white', 'white']}
          style={[styles.CardContainer]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* <View style={styles.Column1}> */}
          <View style={getColumn1Style(selectedLanguage)}>
            <View style={styles.ServiceContainer}>
              <Text style={styles.ServiceText}>Service</Text>
              <Text style={styles.ServiceText}>No & Date</Text>
            </View>
            <Text style={styles.CardBookingNo}>{item.Booking_No}</Text>
            <Text style={styles.CardMonthDate}>{formattedBookingDate}</Text>
            <Text style={styles.CardMonthDate}>{formattedBookingDateAndYear}</Text>
          </View>

          <View style={styles.LocationContainer}>
            <Image source={require('../images/placeholder.png')} style={styles.LocationImg} />
            <Text style={styles.PlaceText} numberOfLines={2}>
              {item.Branch_Name}
            </Text>
          </View>

          <View style={styles.CardDetails}>
            <Text style={styles.PatientDetails}>
              {item.Pt_Name}, {item.Pt_First_Age}, {item.Pt_Gender}
            </Text>

            <View style={styles.RowContainer}>
              <Text style={styles.SIDText}>SID:</Text>
              <Text style={styles.CardTextNumber}>{item.Sid_No}</Text>

              <View style={styles.DateContainer}>
                <Image source={require('../images/calendar.png')} style={styles.CalendarIcon} />
                <Text style={styles.BookDate}>{item.Booking_Date}</Text>
              </View>
            </View>

            <View style={styles.StatusAndPayContainer}>
              <Text style={[
                styles.StatusText,
                isCollectionCompleted && {
                  backgroundColor: item.BookingType_ColorCode,
                  color: 'black',
                },
              ]}
                numberOfLines={1}>
                {item.Booking_Status_Desc}
              </Text>
              <TouchableOpacity style={styles.ButtonPayNowView}>
                <Text style={styles.ButtonPayNow}>{getLabel('bkrow_9')}</Text>
              </TouchableOpacity>
            </View>

            {item.Is_Cancelled === 'True' && (
              <View style={styles.CancelRemarks}>
                <Text style={styles.CancelText}>
                  Remarks: {item.Remarks || 'No remarks available'}
                </Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity >
    );
  };

  return (
    <View style={styles.ScreenContainer}>
      <NavigationBar title="Bookings" />

      <View style={styles.filterBar}>
        <TouchableOpacity
          onPress={() => toggleDropdown('branch')}
          style={styles.dropdown}
        >
          <Text style={styles.text}>{selectedBranch || getLabel('managebrscr_1')}</Text>
          <Image
            source={
              dropdownType === 'branch' && dropdownVisible
                ? require('../images/arrowUp.png')
                : require('../images/arrowDown.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => toggleDropdown('status')}
          style={styles.dropdown}
        >
          <Text style={styles.text}>{selectedStatus || 'Select Status'}</Text>
          <Image
            source={
              dropdownType === 'status' && dropdownVisible
                ? require('../images/arrowUp.png')
                : require('../images/arrowDown.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>

        <View style={styles.inputContainerDob}>
          <TouchableOpacity
            style={styles.touchableContainer}
            onPress={() => setShowCalendar(true)}
          >
            <Text style={styles.input}>
              {selectedDate || 'Select Date'}
            </Text>
            <Image
              source={require('../images/calendar.png')}
              style={styles.CalenderImg}
            />
          </TouchableOpacity>
          {/* {showCalendar && (
            <CalendarModal
              selectedLanguage={selectedLanguage}
              isVisible={showCalendar}
              onClose={() => setShowCalendar(false)}
              onConfirm={(day: any) => {
                const date = new Date(day);
                if (!isNaN(date.getTime())) {
                  const formattedDate = formatDate(date);
                  setSelectedDate(formattedDate);
                  setShowCalendar(false);
                } else {
                  console.error("Invalid date string:", day);
                }
              }}
            />
          )} */}

          {showCalendar && (
            <CalendarModal
              locale={selectedLanguage?.Code || "en"}
              selectedLanguage={selectedLanguage}
              isVisible={showCalendar}
              onClose={() => setShowCalendar(false)}
              onConfirm={(day: any) => {
                const date = moment(day, "YYYY-MM-DD", true).toDate();
                if (!isNaN(date.getTime())) {
                  moment.locale(selectedLanguage?.Code || "en");
                  const formattedDate = moment(date).format("YYYY/MM/DD");
                  setSelectedDate(formattedDate);
                  setShowCalendar(false);
                } else {
                  console.error("Invalid date string:", day);
                }
              }}
            />
          )}

        </View>
      </View>

      <Modal visible={dropdownVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setDropdownVisible(false)}
        />
        <View style={styles.dropdownMenu}>
          {isLoading ? (
            <Spinner
              style={{
                marginTop: deviceHeight / 10,
                alignItems: 'center',
                alignSelf: 'center',
              }}
              isVisible={true}
              size={40}
              type={'Wave'}
              color={Constants.COLOR.THEME_COLOR}
            />
          ) : (
            <FlatList
              data={dropdownType === 'branch' ? branches : status}
              keyExtractor={(item, index) =>
                item.Firm_No || index.toString()
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelection(item)}
                >
                  <Text style={styles.text}>
                    {dropdownType === 'branch' ? item.Branch_Name : item.StatusDesc}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </Modal>

      {loading ? (
        <View style={styles.loaderContainer}>
          <SpinnerIndicator />
        </View>
      ) : (
        <FlatList
          data={bookingData}
          keyExtractor={(item) => item.Booking_No}
          renderItem={({ item }) => <CardItem item={item} />}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ListEmptyComponent={() => (
            <View style={styles.EmptyListContainer}>
              {loading ? (
                <SpinnerIndicator />
              ) : (
                <View style={{ flex: 1 }}>
                  <Text style={{ color: Constants.COLOR.BLACK_COLOR, fontFamily: Constants.FONT_FAMILY.fontFamilyRegular, }}>{getLabel('aboutscr_5')}</Text>
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

export default BookingScreen;


const styles = StyleSheet.create({
  ScreenContainer: {
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  CardContainer: {
    marginVertical: 10,
    marginHorizontal: 10,
    flexDirection: 'row',
    flex: 1,
    elevation: 3,
    borderRadius: 15,
    height: 'auto',
  },
  Column1: {
    flexDirection: 'column',
    backgroundColor: Constants.COLOR.THEME_COLOR,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '30%',
    paddingBottom: 4,
    overflow: 'hidden',
  },
  ServiceContainer: {
    backgroundColor: Constants.COLOR.THEME_COLOR,
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 0.5,
    borderColor: Constants.COLOR.WHITE_COLOR
  },
  ServiceText: {
    color: Constants.COLOR.WHITE_COLOR,
    fontSize: 10,
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
  },
  CardBookingNo: {
    fontSize: Constants.FONT_SIZE.S,
    color: Constants.COLOR.BOOK_DATE_TIME_TEXT_COLOR,
    fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
    paddingHorizontal: 10,
  },
  CardMonthDate: {
    fontSize: Constants.FONT_SIZE.XS,
    color: Constants.COLOR.BOOK_DATE_TIME_TEXT_COLOR,
    paddingHorizontal: 10,
  },
  LocationContainer: {
    position: 'absolute',
    marginTop: 5,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  LocationImg: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    marginHorizontal: 5,
  },
  PlaceText: {
    color: '#AB0005',
    fontSize: Constants.FONT_SIZE.S,
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
  },
  CardDetails: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
  },
  PatientDetails: {
    fontSize: Constants.FONT_SIZE.S,
    width: '60%',
    marginBottom: 5,
    fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
  },
  RowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  SIDText: {
    fontSize: Constants.FONT_SIZE.S,
    marginRight: 5,
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
  },
  CardTextNumber: {
    fontSize: Constants.FONT_SIZE.S,
    color: Constants.COLOR.BOOK_ID_TEXT_COLOR,
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
  },
  DateContainer: {
    flexDirection: 'row',
    marginLeft: 20,
    alignItems: 'center',
  },
  CalendarIcon: {
    width: 14,
    height: 14,
    marginRight: 5,
    resizeMode: 'contain',
    tintColor: 'black',
  },
  BookDate: {
    color: Constants.COLOR.BOOK_ID_TEXT_COLOR,
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
  },
  StatusAndPayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  StatusText: {
    fontSize: Constants.FONT_SIZE.XS,
    borderRadius: 5,
    color: '#333333',
    padding: 4,
    borderWidth: 0.5,
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
  },
  ButtonPayNowView: {
    backgroundColor: '#0052CC',
    borderRadius: 5,
    marginLeft: 10,
  },
  ButtonPayNow: {
    padding: 4,
    textAlign: 'center',
    color: Constants.COLOR.WHITE_COLOR,
    fontSize: Constants.FONT_SIZE.XS,
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
  },
  CancelRemarks: {
    marginTop: 10,
  },
  CancelText: {
    color: Constants.COLOR.BLACK_COLOR,
    fontSize: Constants.FONT_SIZE.XS,
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
  },
  EmptyListContainer: {
    alignSelf: 'center',
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 6,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ececec',
    borderRadius: 5,
    paddingHorizontal: 10,
    width: '30%',
  },
  text: {
    fontSize: Constants.FONT_SIZE.XS,
    color: Constants.COLOR.BLACK_COLOR,
    flex: 1,
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
  },
  icon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    tintColor: Constants.COLOR.BLACK_COLOR,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 60,
    alignSelf: 'flex-start',
    width: '50%',
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderRadius: 5,
    elevation: 5,
    padding: 10,
    marginHorizontal: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
  },
  inputContainerDob: {
    width: '30%',
  },
  touchableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ececec',
    borderRadius: 5,
    padding: 10,
    borderWidth: 1
  },
  input: {
    flex: 1,
    fontSize: Constants.FONT_SIZE.XS,
    color: Constants.COLOR.BLACK_COLOR,
    fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
  },
  CalenderImg: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    tintColor: Constants.COLOR.BLACK_COLOR,
  },
  calendarContainer: {
    position: 'absolute',
    marginTop: 60,
    backgroundColor: Constants.COLOR.WHITE_COLOR,
    borderRadius: 5,
    elevation: 5,
    padding: 10,
    alignSelf: 'center',
  },
});

