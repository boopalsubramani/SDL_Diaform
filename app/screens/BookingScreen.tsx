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
} from 'react-native';
import moment from 'moment';
import Constants from '../util/Constants';
import NavigationBar from '../common/NavigationBar';
import FilterScreen from './FilterScreen';
import { Calendar } from 'react-native-calendars';
import { useBookingListMutation } from '../redux/service/BookingListService';
import Spinner from 'react-native-spinkit';
import { useFetchApiMutation } from '../redux/service/FetchApiService';
import SpinnerIndicator from '../common/SpinnerIndicator';
import { useUser } from '../common/UserContext';

const { height: deviceHeight, } = Dimensions.get('window');
const { width, height } = Dimensions.get('window');



// const BookingScreen = ({ navigation }: any) => {
//   const { userData } = useUser();
//   const [bookingListAPIReq, bookingListAPIRes] = useBookingListMutation();
//   const [bookingData, setBookingData] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
//   const [dropdownVisible, setDropdownVisible] = useState(false);
//   const [dropdownType, setDropdownType] = useState(null);
//   const [selectedBranch, setSelectedBranch] = useState('Branch');
//   const [selectedStatus, setSelectedStatus] = useState('Status');
//   const [selectedDate, setSelectedDate] = useState('');
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [branches, setBranches] = useState([]);
//   const [status, setStatus] = useState([]);
//   const [firmNo, setFirmNo] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const [fetchAPIReq ] = useFetchApiMutation();
//   const branchCode = userData?.Branch_Code;

//   const formatDate = (date: any) => {
//     const day = String(date.getDate()).padStart(2, '0');
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   // Set the current date on component mount
//   useEffect(() => {
//     const currentDate = new Date();
//     setSelectedDate(formatDate(currentDate));
//     fetchData('branch');
//     fetchData('status');
//   }, []);

//   // Generalized fetch function for branch and status
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
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Toggle dropdown visibility and type
//   const toggleDropdown = (type: any) => {
//     setDropdownType(type);
//     setDropdownVisible(!dropdownVisible);
//   };

//   // Handle selection logic for branch and status
//   const handleSelection = (item: any) => {
//     if (dropdownType === 'branch') {
//       setSelectedBranch(item.Branch_Name);
//     } else if (dropdownType === 'status') {
//       setSelectedStatus(item.StatusDesc);
//     }
//     setDropdownVisible(false);
//   };


//   useEffect(() => {
//     // Update firmNo when selectedBranch changes
//     if (selectedBranch) {
//       const var1 = selectedBranch.substring(0, selectedBranch.indexOf('-'));
//       setFirmNo(var1);
//     }
//   }, [selectedBranch]);

//   useEffect(() => {
//     fetchBookingData();
//   }, [selectedBranch, selectedStatus, firmNo]);

//   const fetchBookingData = async () => {
//     setLoading(true);
//     try {
//       const payload = {
//         App_Type: 'R',
//         UserType: 'C',
//         Username: '01000104',
//         Branch: selectedBranch ? selectedBranch : '',
//         Status: selectedStatus ? selectedStatus : '',
//         Firm_No: firmNo,
//       };

//       const response = await bookingListAPIReq(payload).unwrap();
//       if (response?.Message?.length > 0) {
//         const allBookings = response.Message[0].Booking_Detail || [];
//         const filteredBookings = allBookings.filter(item => {
//           const branchMatch = selectedBranch === 'Branch' || item.Branch_Name === selectedBranch;
//           const statusMatch = selectedStatus === 'Status' || item.Booking_Status_Desc === selectedStatus;
//           const firmMatch = firmNo === '' || item.Firm_No === firmNo;
//           return branchMatch && statusMatch && firmMatch;
//         });
//         setBookingData(filteredBookings);
//       } else {
//         setBookingData([]);
//       }
//     } catch (error) {
//       setBookingData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (bookingListAPIRes?.data?.Message) {
//       setBookingData(bookingListAPIRes.data.Message[0].Booking_Detail);
//     }
//   }, [bookingListAPIRes]);

//   // Pull-to-refresh handler
//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await bookingListAPIReq({
//       App_Type: 'R',
//       UserType: 'C',
//       Username: '01000104',
//     });
//     setRefreshing(false);
//   };

//   const handleBookingDetail = (item: any) => {
//     navigation.navigate('BookingDetail', { booking: item });
//   };

//   const CardItem = ({ item }: any) => {
//     const formattedBookingDate = moment(item.Booking_Date, 'YYYY/MM/DD').format('MMM');
//     const formattedBookingDateAndYear = moment(item.Booking_Date, 'YYYY/MM/DD').format('D, YYYY');
//     const formattedBookingTime = moment(item.Booking_Time, 'h:mmA').format('hh:mm A');

//     const isCollectionCompleted = item.Booking_Status_Desc === 'Collection Completed';

//     return (
//       <TouchableOpacity onPress={() => handleBookingDetail(item)}>
//         <View
//           style={[
//             styles.CardContainer,
//             { backgroundColor: item.BookingType_ColorCode },
//             isCollectionCompleted && {
//               borderColor: '#71b4d2',
//               borderWidth: 2,
//             },
//           ]}
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
//               <Text style={styles.StatusText} numberOfLines={1}>
//                 {item.Booking_Status_Desc}
//               </Text>
//               <TouchableOpacity style={styles.ButtonPayNowView}>
//                 <Text style={styles.ButtonPayNow}>Pay Now</Text>
//               </TouchableOpacity>
//             </View>

//             {item.Booking_Status_Desc === 'Cancel' && (
//               <View style={styles.CancelRemarks}>
//                 <Text style={styles.CancelText}>
//                   Remarks: {item.Remarks || 'No remarks available'}
//                 </Text>
//               </View>
//             )}
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.ScreenContainer}>
//       <NavigationBar title="Bookings" />
//       {/* <FilterScreen /> */}

//       <View style={styles.filterBar}>
//         {/* Branch Dropdown */}
//         <TouchableOpacity
//           onPress={() => toggleDropdown('branch')}
//           style={styles.dropdown}
//         >
//           <Text style={styles.text}>{selectedBranch}</Text>
//           <Image
//             source={
//               dropdownType === 'branch' && dropdownVisible
//                 ? require('../images/arrowUp.png')
//                 : require('../images/arrowDown.png')
//             }
//             style={styles.icon}
//           />
//         </TouchableOpacity>

//         {/* Status Dropdown */}
//         <TouchableOpacity
//           onPress={() => toggleDropdown('status')}
//           style={styles.dropdown}
//         >
//           <Text style={styles.text}>{selectedStatus}</Text>
//           <Image
//             source={
//               dropdownType === 'status' && dropdownVisible
//                 ? require('../images/arrowUp.png')
//                 : require('../images/arrowDown.png')
//             }
//             style={styles.icon}
//           />
//         </TouchableOpacity>

//         {/* Date Picker */}
//         <View style={styles.inputContainerDob}>
//           <TouchableOpacity
//             style={styles.touchableContainer}
//             onPress={() => setShowCalendar(true)}
//           >
//             <Text style={styles.input}>
//               {selectedDate || 'Select DOB'}
//             </Text>
//             <Image
//               source={require('../images/calendar.png')}
//               style={styles.CalenderImg}
//             />
//           </TouchableOpacity>
//           {showCalendar && (
//             <Modal transparent animationType="fade">
//               <TouchableOpacity
//                 style={styles.overlay}
//                 onPress={() => setShowCalendar(false)}
//               />
//               <View style={styles.calendarContainer}>
//                 <Calendar
//                   onDayPress={(day) => {
//                     const formattedDate = formatDate(
//                       new Date(day.year, day.month - 1, day.day)
//                     );
//                     setSelectedDate(formattedDate);
//                     setShowCalendar(false);
//                   }}
//                 />
//               </View>
//             </Modal>
//           )}
//         </View>
//       </View>

//       {/* Dropdown Modal */}
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
//               <SpinnerIndicator />
//             </View>
//           )}
//         />
//       )}
//     </View>
//   );
// };

// export default BookingScreen;

// Define the type for the item object
interface BookingItem {
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

const BookingScreen = ({ navigation }: any) => {
  const { userData } = useUser();
  const [bookingListAPIReq, bookingListAPIRes] = useBookingListMutation();
  const [bookingData, setBookingData] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownType, setDropdownType] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState('Branch');
  const [selectedStatus, setSelectedStatus] = useState('Status');
  const [selectedDate, setSelectedDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);
  const [status, setStatus] = useState<any[]>([]);
  const [firmNo, setFirmNo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [fetchAPIReq] = useFetchApiMutation();
  const branchCode = userData?.Branch_Code;

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Set the current date on component mount
  useEffect(() => {
    const currentDate = new Date();
    setSelectedDate(formatDate(currentDate));
    fetchData('branch');
    fetchData('status');
  }, []);

  // Generalized fetch function for branch and status
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

  // Toggle dropdown visibility and type
  const toggleDropdown = (type: string) => {
    setDropdownType(type);
    setDropdownVisible(!dropdownVisible);
  };

  // Handle selection logic for branch and status
  const handleSelection = (item: any) => {
    if (dropdownType === 'branch') {
      setSelectedBranch(item.Branch_Name);
    } else if (dropdownType === 'status') {
      setSelectedStatus(item.StatusDesc);
    }
    setDropdownVisible(false);
  };

  useEffect(() => {
    // Update firmNo when selectedBranch changes
    if (selectedBranch) {
      const var1 = selectedBranch.substring(0, selectedBranch.indexOf('-'));
      setFirmNo(var1);
    }
  }, [selectedBranch]);

  useEffect(() => {
    fetchBookingData();
  }, [selectedBranch, selectedStatus, firmNo]);

  const fetchBookingData = async () => {
    setLoading(true);
    try {
      const payload = {
        App_Type: 'R',
        UserType: 'C',
        Username: '01000104',
        Branch: selectedBranch ? selectedBranch : '',
        Status: selectedStatus ? selectedStatus : '',
        Firm_No: firmNo,
      };

      const response = await bookingListAPIReq(payload).unwrap();
      if (response?.Message?.length > 0) {
        const allBookings = response.Message[0].Booking_Detail || [];
        const filteredBookings = allBookings.filter(item => {
          const branchMatch = selectedBranch === 'Branch' || item.Branch_Name === selectedBranch;
          const statusMatch = selectedStatus === 'Status' || item.Booking_Status_Desc === selectedStatus;
          const firmMatch = firmNo === '' || item.Firm_No === firmNo;
          return branchMatch && statusMatch && firmMatch;
        });
        setBookingData(filteredBookings);
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

  useEffect(() => {
    if (bookingListAPIRes?.data?.Message) {
      setBookingData(bookingListAPIRes.data.Message[0].Booking_Detail);
    }
  }, [bookingListAPIRes]);

  // Pull-to-refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    await bookingListAPIReq({
      App_Type: 'R',
      UserType: 'C',
      Username: '01000104',
    });
    setRefreshing(false);
  };

  const handleBookingDetail = (item: BookingItem) => {
    navigation.navigate('BookingDetail', { booking: item });
  };

  const CardItem = ({ item }: { item: BookingItem }) => {
    const formattedBookingDate = moment(item.Booking_Date, 'YYYY/MM/DD').format('MMM');
    const formattedBookingDateAndYear = moment(item.Booking_Date, 'YYYY/MM/DD').format('D, YYYY');
    const formattedBookingTime = moment(item.Booking_Time, 'h:mmA').format('hh:mm A');

    const isCollectionCompleted = item.Booking_Status_Desc === 'Collection Completed';

    return (
      <TouchableOpacity onPress={() => handleBookingDetail(item)}>
        <View
          style={[
            styles.CardContainer,
            { backgroundColor: item.BookingType_ColorCode },
            isCollectionCompleted && {
              borderColor: '#71b4d2',
              borderWidth: 2,
            },
          ]}
        >
          <View style={styles.Column1}>
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
              <Text style={styles.StatusText} numberOfLines={1}>
                {item.Booking_Status_Desc}
              </Text>
              <TouchableOpacity style={styles.ButtonPayNowView}>
                <Text style={styles.ButtonPayNow}>Pay Now</Text>
              </TouchableOpacity>
            </View>

            {item.Booking_Status_Desc === 'Cancel' && (
              <View style={styles.CancelRemarks}>
                <Text style={styles.CancelText}>
                  Remarks: {item.Remarks || 'No remarks available'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.ScreenContainer}>
      <NavigationBar title="Bookings" />
      {/* <FilterScreen /> */}

      <View style={styles.filterBar}>
        {/* Branch Dropdown */}
        <TouchableOpacity
          onPress={() => toggleDropdown('branch')}
          style={styles.dropdown}
        >
          <Text style={styles.text}>{selectedBranch}</Text>
          <Image
            source={
              dropdownType === 'branch' && dropdownVisible
                ? require('../images/arrowUp.png')
                : require('../images/arrowDown.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* Status Dropdown */}
        <TouchableOpacity
          onPress={() => toggleDropdown('status')}
          style={styles.dropdown}
        >
          <Text style={styles.text}>{selectedStatus}</Text>
          <Image
            source={
              dropdownType === 'status' && dropdownVisible
                ? require('../images/arrowUp.png')
                : require('../images/arrowDown.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>

        {/* Date Picker */}
        <View style={styles.inputContainerDob}>
          <TouchableOpacity
            style={styles.touchableContainer}
            onPress={() => setShowCalendar(true)}
          >
            <Text style={styles.input}>
              {selectedDate || 'Select DOB'}
            </Text>
            <Image
              source={require('../images/calendar.png')}
              style={styles.CalenderImg}
            />
          </TouchableOpacity>
          {showCalendar && (
            <Modal transparent animationType="fade">
              <TouchableOpacity
                style={styles.overlay}
                onPress={() => setShowCalendar(false)}
              />
              <View style={styles.calendarContainer}>
                <Calendar
                  onDayPress={(day) => {
                    const formattedDate = formatDate(
                      new Date(day.year, day.month - 1, day.day)
                    );
                    setSelectedDate(formattedDate);
                    setShowCalendar(false);
                  }}
                />
              </View>
            </Modal>
          )}
        </View>
      </View>

      {/* Dropdown Modal */}
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
              {bookingData?.length === 0 ? (
                <Text style={styles.NoDataText}>No data found</Text>
              ) : (
                <SpinnerIndicator />
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
    backgroundColor: '#f8f8f8',
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
    borderRadius: 30,
    height: Platform.OS === 'android' ? deviceHeight / 6.5 : undefined,
    borderWidth: 0.5,
  },
  Column1: {
    flexDirection: 'column',
    backgroundColor: '#3c3636',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '30%',
    paddingBottom: 4,
    overflow: 'hidden',
  },
  ServiceContainer: {
    backgroundColor: '#6b6767',
    alignItems: 'center',
    width: '100%',
  },
  ServiceText: {
    color: 'white',
    fontSize: 10,
  },
  CardBookingNo: {
    fontSize: Constants.FONT_SIZE.SM,
    color: Constants.COLOR.BOOK_DATE_TIME_TEXT_COLOR,
    fontWeight: '600',
    paddingHorizontal: 10,
  },
  CardMonthDate: {
    fontSize: Constants.FONT_SIZE.SM,
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
    width: deviceHeight / 50,
    height: deviceHeight / 50,
    marginHorizontal: 5,
  },
  PlaceText: {
    color: '#ba2f33',
    fontSize: 12,
  },
  CardDetails: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  PatientDetails: {
    fontWeight: '600',
    marginBottom: 10,
  },
  RowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  SIDText: {
    fontSize: Constants.FONT_SIZE.S,
    marginRight: 5,
  },
  CardTextNumber: {
    fontSize: Constants.FONT_SIZE.S,
    color: Constants.COLOR.BOOK_ID_TEXT_COLOR,
  },
  DateContainer: {
    flexDirection: 'row',
    marginLeft: 20,
    alignItems: 'center',
  },
  CalendarIcon: {
    width: 16,
    height: 16,
    marginRight: 5,
    resizeMode: 'contain',
    tintColor: 'black',
  },
  BookDate: {
    color: Constants.COLOR.BOOK_ID_TEXT_COLOR,
    fontSize: Constants.FONT_SIZE.S,
  },
  StatusAndPayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    alignItems: 'center',
  },
  StatusText: {
    fontSize: Constants.FONT_SIZE.S,
    borderRadius: 5,
    padding: 5,
    borderWidth: 0.5,
  },
  ButtonPayNowView: {
    backgroundColor: Constants.COLOR.BOOK_PAY_BG,
    borderRadius: 5,
    marginLeft: 10,
  },
  ButtonPayNow: {
    padding: 6,
    textAlign: 'center',
    color: 'white',
    fontSize: Constants.FONT_SIZE.S,
  },
  CancelRemarks: {
    marginTop: 10,
  },
  CancelText: {
    color: 'red',
    fontSize: Constants.FONT_SIZE.S,
  },
  EmptyListContainer: {
    alignSelf: 'center',
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: width * 0.03,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ececec',
    borderRadius: 5,
    padding: width * 0.02,
    width: '30%',
  },
  text: {
    fontSize: width * 0.03,
    color: Constants.COLOR.BLACK_COLOR,
    flex: 1,
    fontFamily: 'Poppins-Regular',
  },
  icon: {
    width: width * 0.04,
    height: width * 0.04,
    resizeMode: 'contain',
    tintColor: Constants.COLOR.BLACK_COLOR,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownMenu: {
    position: 'absolute',
    marginTop: height * 0.15,
    alignSelf: 'flex-start',
    width: '50%',
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 5,
    padding: width * 0.03,
    marginHorizontal: 10,
  },
  dropdownItem: {
    paddingVertical: height * 0.01,
  },
  inputContainerDob: {
    width: '30%',
  },
  touchableContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ececec',
    borderRadius: 5,
    padding: width * 0.02,
  },
  input: {
    flex: 1,
    fontSize: width * 0.03,
    color: Constants.COLOR.BLACK_COLOR,
    fontFamily: 'Poppins-Regular',
  },
  CalenderImg: {
    width: width * 0.04,
    height: width * 0.04,
    resizeMode: 'contain',
    tintColor: Constants.COLOR.BLACK_COLOR,
  },
  calendarContainer: {
    position: 'absolute',
    marginTop: height * 0.15,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 5,
    padding: 10,
    alignSelf: 'center',
  },
});

