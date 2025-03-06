import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    Dimensions,
} from 'react-native';
import Constants from '../util/Constants';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFetchApiMutation } from '../redux/service/FetchApiService';
import { useUser } from '../common/UserContext';
const deviceHeight = Dimensions.get('window').height;

// Define Types for Data
interface TitleData {
    Title_Desc: string;
    TitleCode: string;
}

interface GenderData {
    GenderDesc: string;
}

interface Day {
    year: number;
    month: number;
    day: number;
}

const AddPatientScreen = ({ navigation }: any) => {
    const { userData } = useUser();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [title, setTitle] = useState('');
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [surName, setSurName] = useState('');
    const [nationalId, setNationalId] = useState('');
    const [passport, setPassport] = useState('');
    const [sex, setSex] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [titleCode, setTitleCode] = useState('');
    const [dropDownVisible, setDropdownVisible] = useState(false);
    const [dropDownVisibleRelation, setDropdownVisibleRelation] = useState(false);
    const [dropDownVisibleTitle, setDropdownVisibleTitle] = useState(false);
    const [genderData, setGenderData] = useState<GenderData[]>([]);
    const [titleData, setTitleData] = useState<TitleData[]>([]);

    // Fetch API for gender and patient_relation
    const [fetchAPIReq, fetchAPIRes] = useFetchApiMutation();

    const branchCode = userData?.Branch_Code;

    const fetchData = async (type: 'T' | 'G', setData: Function) => {
        try {
            const requestObj = {
                Mode: type,
                Command: 'OLXV65571F',
                branchNo: branchCode,
            };
            const response = await fetchAPIReq(requestObj).unwrap();
            if (response?.TableData?.data1) {
                setData(response.TableData.data1);
            } else {
                console.error(`Error fetching data for type ${type}: Invalid response`);
            }
        } catch (error) {
            console.error(`Failed to fetch data for type ${type}:`, error);
        }
    };

    const handleDateSelect = (day: Day) => {
        const formattedDate = `${day.year}/${padZero(day.month)}/${padZero(day.day)}`;
        setSelectedDate(formattedDate);
        setShowCalendar(false);
    };

    const handleTitleArrow = async () => {
        if (!dropDownVisibleTitle) {
            await fetchData('T', setTitleData);
        }
        setDropdownVisibleTitle(!dropDownVisibleTitle);
    };

    const handleGenderArrow = async () => {
        if (!dropDownVisible) {
            await fetchData('G', setGenderData);
        }
        setDropdownVisible(!dropDownVisible);
    };

    const handleSubmit = async () => {
        if (
            firstName === '' ||
            middleName === '' ||
            surName === '' ||
            nationalId === '' ||
            passport === '' ||
            sex === '' ||
            selectedDate === '' ||
            phoneNumber === ''
        ) {
            Alert.alert('Error', 'Please fill in all fields before submitting.');
            return;
        }
        const addMemberObj = {
            Dob: selectedDate,
            Gender: sex,
            Mobile_No: phoneNumber,
            Pt_Name: firstName,
        };
        try {
            await AsyncStorage.setItem('patientData', JSON.stringify(addMemberObj));
            Alert.alert('Success', 'Member added successfully.');
            navigation.navigate('ChoosePatient');
        } catch (error) {
            console.error('Failed to save data:', error);
        }
    };

    const handleCross = () => {
        navigation.goBack('');
    };

    const padZero = (num: number): string => {
        return num < 10 ? `0${num}` : `${num}`;
    };

    return (
        <View style={styles.MainContainer}>
            <View style={styles.AddMemberView}>
                <Text style={styles.headerText}>Add Patient</Text>
                <TouchableOpacity onPress={handleCross}>
                    <Image source={require('../images/black_cross.png')} />
                </TouchableOpacity>
            </View>

            <ScrollView scrollEnabled={!dropDownVisible && !dropDownVisibleTitle && !dropDownVisibleRelation}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Phone Number"
                        keyboardType="number-pad"
                        onChangeText={setPhoneNumber}
                        value={phoneNumber}
                    />
                    <TouchableOpacity style={styles.touchableContainer}>
                        <Image source={require('../images/search.png')} style={styles.SearchImg} />
                    </TouchableOpacity>
                </View>

                <View style={styles.dropdownContainer}>
                    <TouchableOpacity style={styles.touchableContainer} onPress={handleTitleArrow}>
                        <Text style={styles.input}>{title || 'Title'}</Text>
                        <Image source={require('../images/downArrow.png')} style={styles.downArrow} />
                    </TouchableOpacity>
                    {dropDownVisibleTitle && (
                        <View style={styles.dropdownCard}>
                            <ScrollView style={styles.dropdownScrollView}>
                                {titleData.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            setTitle(item.Title_Desc);
                                            setTitleCode(item.TitleCode);
                                            setDropdownVisibleTitle(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownItem}>{item.Title_Desc}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="First Name"
                        onChangeText={setFirstName}
                        value={firstName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Middle Name"
                        onChangeText={setMiddleName}
                        value={middleName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Sur Name"
                        onChangeText={setSurName}
                        value={surName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="National ID Card"
                        onChangeText={setNationalId}
                        value={nationalId}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Passport Number"
                        onChangeText={setPassport}
                        value={passport}
                    />
                </View>

                <View style={styles.inputContainerDob}>
                    <TouchableOpacity style={styles.touchableContainer} onPress={() => setShowCalendar(true)}>
                        <Text style={styles.input}>{selectedDate || 'Select DOB'}</Text>
                        <Image source={require('../images/calendar.png')} style={styles.CalenderImg} />
                    </TouchableOpacity>
                    {showCalendar && (
                        <Calendar
                            onDayPress={handleDateSelect}
                            maxDate={new Date().toISOString().split('T')[0]}
                        />
                    )}
                </View>

                <View style={styles.dropdownContainer}>
                    <TouchableOpacity style={styles.touchableContainer} onPress={handleGenderArrow}>
                        <Text style={styles.input}>{sex || 'Sex'}</Text>
                        <Image source={require('../images/downArrow.png')} style={styles.downArrow} />
                    </TouchableOpacity>
                    {dropDownVisible && (
                        <View style={styles.dropdownCard}>
                            <ScrollView>
                                {genderData.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            setSex(item.GenderDesc);
                                            setDropdownVisible(false);
                                        }}
                                    >
                                        <Text style={styles.dropdownItem}>{item.GenderDesc}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>

                <TouchableOpacity onPress={handleSubmit}>
                    <View style={styles.SubmitButtonView}>
                        <Text style={styles.ButtonText}>Submit</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default AddPatientScreen;


const styles = StyleSheet.create({
    MainContainer: {
        backgroundColor: Constants.COLOR.WHITE_COLOR,
        flex: 1
    },
    AddMemberView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 20
    },
    headerText: {
        fontSize: Constants.FONT_SIZE.M,
        fontFamily: Constants.FONT_FAMILY.fontFamilyMedium,
    },
    input: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F7FA',
        borderWidth: 0.5,
        borderColor: Constants.COLOR.THEME_COLOR,
        margin: 15,
        fontFamily: Constants.FONT_FAMILY.fontFamilyMedium,
        fontSize: Constants.FONT_SIZE.M,
        borderRadius: 16,
    },
    dropdownContainer: {
        width: '100%',
        alignSelf: 'center',
        position: 'relative',
    },
    downArrow: {
        width: 14,
        height: 14,
        resizeMode: "contain",
        position: 'absolute',
        right: 30,
        alignSelf: 'center',
        tintColor: '#9e9e9e',
    },
    SubmitButtonView: {
        backgroundColor: Constants.COLOR.THEME_COLOR,
        borderRadius: 25,
        marginTop: 30,
        marginHorizontal: 10,
        marginBottom: 100,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 11,
    },
    ButtonText: {
        color: Constants.COLOR.WHITE_COLOR,
        fontSize: Constants.FONT_SIZE.M,
        fontFamily: Constants.FONT_FAMILY.fontFamilyMedium
    },
    touchableContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdownCard: {
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderWidth: 0.5,
        borderRadius: 5,
        alignSelf: 'center',
        width: '90%',
        overflow: 'hidden',
        maxHeight: 200,
    },
    dropdownScrollView: {
        height: 200,
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    inputContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignSelf: 'center',
    },
    inputContainerDob: {
        alignSelf: 'center',
        width: '100%',
    },
    SearchImg: {
        width: 20,
        height: 20,
        position: 'absolute',
        right: 30,
        tintColor: 'black',
    },
    CalenderImg: {
        width: 20,
        height: 20,
        position: 'absolute',
        right: 30,
        tintColor: 'red',
    },
});
