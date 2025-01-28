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
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import NavigationBar from '../common/NavigationBar';
import Constants from '../util/Constants';
import { useFetchApiMutation } from '../redux/service/FetchApiService';
import Spinner from 'react-native-spinkit';


const deviceHeight = Dimensions.get('window').height;


const CollectionScreen = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedPayMode, setSelectedPayMode] = useState({
    PayMode: '',
    PayDescription: 'Pay Mode',
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [payModes, setPayModes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [fetchAPIReq] = useFetchApiMutation();

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const currentDate = new Date();
    setSelectedDate(formatDate(currentDate));
    fetchPayModeList();
  }, []);

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

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationBar title="Collection" />
      <View style={styles.container}>
        <TouchableOpacity onPress={toggleDropdown} style={styles.dropdown}>
          <Text style={styles.text}>{selectedPayMode.PayDescription}</Text>
          <Image
            source={
              dropdownVisible
                ? require('../images/arrowUp.png')
                : require('../images/arrowDown.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowCalendar(true)}
          style={styles.dropdown}
        >
          <Text style={styles.text}>{selectedDate}</Text>
          <Image source={require('../images/calendar.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Dropdown Modal */}
      <Modal visible={dropdownVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.overlay} onPress={() => setDropdownVisible(false)} />
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
              data={payModes}
              keyExtractor={(item) => item.PayMode}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedPayMode(item);
                    setDropdownVisible(false);
                  }}
                >
                  <Text style={styles.text}>{item.PayDescription}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </Modal>

      {/* Calendar Modal */}
      <Modal visible={showCalendar} transparent animationType="slide">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setShowCalendar(false)}
        />
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={(day) => {
              setSelectedDate(day.dateString.split('-').reverse().join('/')); // Format: DD/MM/YYYY
              setShowCalendar(false);
            }}
            markedDates={{
              [selectedDate.split('/').reverse().join('-')]: {
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    width: '45%',
  },
  text: { fontSize: 16, color: '#333', flex: 1 },
  icon: { width: 15, height: 15, resizeMode: 'contain', tintColor: 'black' },
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  dropdownMenu: {
    position: 'absolute',
    top: '16%',
    left: '5%',
    width: '40%',
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 5,
    padding: 10,
  },
  dropdownItem: { paddingVertical: 8 },
  calendarContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
});

export default CollectionScreen;

