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
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import Constants from '../util/Constants';
import NavigationBar from '../common/NavigationBar';
import FilterScreen from './FilterScreen';
import { useBookingListMutation } from '../redux/service/BookingListService';
import Spinner from 'react-native-spinkit';

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

const BookingScreen = ({ navigation }: any) => {
  const [bookingListAPIReq, bookingListAPIRes] = useBookingListMutation();
  const [bookingData, setBookingData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false); 

  // Fetch booking data
  const fetchBookingData = async () => {
    setLoading(true);
    await bookingListAPIReq({
      App_Type: 'R',
      UserType: 'C',
      Username: '01000104',
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchBookingData();
  }, []);

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

  const handlePaynow = (dueAmount: number) => {
    navigation.navigate('Wallet', { dueAmount });
  };

  const handleBookingDetail = (item: any) => {
    navigation.navigate('BookingDetail', { booking: item });
  };

  const CardItem = ({ item }: any) => {
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
      <FilterScreen />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Constants.COLOR.BOOK_SHADOW_BG} />
        </View>
      ) : (
        <FlatList
          data={bookingData}
          keyExtractor={(item) => item.Booking_No}
          renderItem={({ item }) => <CardItem item={item} />}
          refreshing={refreshing} // Pull-to-refresh state
          onRefresh={handleRefresh} // Pull-to-refresh handler
          ListEmptyComponent={() => (
            <View style={styles.EmptyListContainer}>
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
            </View>
          )}
        />
      )}
    </View>
  );
};

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
});

export default BookingScreen;

