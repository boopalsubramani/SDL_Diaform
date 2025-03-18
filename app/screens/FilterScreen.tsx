import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Modal,
    FlatList,
    Dimensions,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Constants from '../util/Constants';
import { useFetchApiMutation } from '../redux/service/FetchApiService';
import Spinner from 'react-native-spinkit';

const { width, height } = Dimensions.get('window');
const deviceHeight = Dimensions.get('window').height;


const FilterScreen = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [dropdownType, setDropdownType] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState('Branch');
    const [selectedStatus, setSelectedStatus] = useState('Status');
    const [selectedDate, setSelectedDate] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [branches, setBranches] = useState([]);
    const [status, setStatus] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    //Api call
    const [fetchAPIReq, fetchAPIRes] = useFetchApiMutation();

    const formatDate = (date: any) => {
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
    const fetchData = async (type: 'branch' | 'status', branchNo = '01') => {
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
    const toggleDropdown = (type: any) => {
        setDropdownType(type);
        setDropdownVisible(!dropdownVisible);
    };

    // Handle selection logic for branch and status
    const handleSelection = (item: any) => {
        if (dropdownType === 'branch') {
            setSelectedBranch(item.Branch_Name);
            fetchData('branch', item.Branch_No);
        } else if (dropdownType === 'status') {
            setSelectedStatus(item.StatusDesc);
        }
        setDropdownVisible(false);
    };


    return (
        <View>
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
                            keyExtractor={(item, index) => item.Firm_No || index.toString()}
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
        </View>
    );
};

const styles = StyleSheet.create({
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

export default FilterScreen;







