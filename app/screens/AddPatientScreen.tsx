
import React, { useState } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFetchApiMutation } from '../redux/service/FetchApiService';
import { useUser } from '../common/UserContext';
import CalendarModal from '../common/Calender';

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
    const [dropDownVisible, setDropdownVisible] = useState(false);
    const [dropDownVisibleRelation] = useState(false);
    const [dropDownVisibleTitle, setDropdownVisibleTitle] = useState(false);
    const [genderData, setGenderData] = useState<GenderData[]>([]);
    const [titleData, setTitleData] = useState<TitleData[]>([]);
    const [patientType, setPatientType] = useState('OP');
    const [IP_No, setIPNo] = useState('');
    const [Ward_Code, setWardCode] = useState('');
    const [Bed_No, setBedNo] = useState('');
    const [Ref_No, setRefNo] = useState('');
    const [dropDownVisibleType, setDropdownVisibleType] = useState(false);

    // Fetch API for gender and patient_relation
    const [fetchAPIReq] = useFetchApiMutation();

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

    const handleDateSelect = (dateString: any) => {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date > today) {
            Alert.alert('Invalid Date', 'You cannot select a future date.');
            return;
        }
        const formattedDate = `${date.getFullYear()}/${padZero(date.getMonth() + 1)}/${padZero(date.getDate())}`;
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
        if (phoneNumber.length !== 10) {
            Alert.alert('Error', 'Phone Number must be exactly 10 digits.');
            return;
        }
        if (!title) {
            Alert.alert('Error', 'Title is required.');
            return;
        }
        if (!firstName) {
            Alert.alert('Error', 'First Name is required.');
            return;
        }
        if (!surName) {
            Alert.alert('Error', 'Sur Name is required.');
            return;
        }
        if (!selectedDate) {
            Alert.alert('Error', 'Date of Birth is required.');
            return;
        }
        if (!sex) {
            Alert.alert('Error', 'Sex is required.');
            return;
        }

        const addMemberObj = {
            Dob: selectedDate,
            Gender: sex,
            Mobile_No: phoneNumber,
            Pt_Name: firstName,
            Patient_Type: patientType,
            IP_No,
            Ward_Code,
            Bed_No,
            Ref_No,
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
                    <Text style={styles.placeholder}>Phone Number *</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="number-pad"
                        maxLength={10}
                        // onChangeText={setPhoneNumber}
                        onChangeText={(text) => {
                            const sanitizedText = text.replace(/[^0-9]/g, ''); // Allow only numbers
                            setPhoneNumber(sanitizedText);
                        }}
                        value={phoneNumber}
                    />
                    <TouchableOpacity style={styles.touchableContainer}>
                        <Image source={require('../images/search.png')} style={styles.SearchImg} />
                    </TouchableOpacity>
                </View>

                <View style={styles.dropdownContainer}>
                    <TouchableOpacity style={styles.touchableContainer} onPress={handleTitleArrow}>
                        <Text style={styles.input}>{title || 'Title *'}</Text>
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
                                            // setTitleCode(item.TitleCode);
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
                    <Text style={styles.placeholder}>First Name *</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setFirstName}
                        value={firstName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.placeholder}>Middle Name</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setMiddleName}
                        value={middleName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.placeholder}>Sur Name *</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setSurName}
                        value={surName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.placeholder}>National ID Card</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setNationalId}
                        value={nationalId}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.placeholder}>Passport Number</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setPassport}
                        value={passport}
                    />
                </View>

                <View style={styles.inputContainerDob}>
                    <Text style={styles.placeholder}>Select DOB *</Text>
                    <TouchableOpacity style={styles.touchableContainer} onPress={() => setShowCalendar(true)}>
                        <Text style={styles.input}>{selectedDate || ''}</Text>
                        <Image source={require('../images/calendar.png')} style={styles.CalenderImg} />
                    </TouchableOpacity>
                    {showCalendar && (
                        <CalendarModal
                            isVisible={showCalendar}
                            onConfirm={handleDateSelect}
                            onCancel={() => setShowCalendar(false)}
                            mode="date"
                            maximumDate={new Date()}
                        />

                    )}
                </View>

                <View style={styles.dropdownContainer}>
                    <TouchableOpacity style={styles.touchableContainer} onPress={handleGenderArrow}>
                        <Text style={styles.input}>{sex || 'Sex *'}</Text>
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

                <View style={styles.dropdownContainer}>
                    <TouchableOpacity style={styles.touchableContainer} onPress={() => setDropdownVisibleType(!dropDownVisibleType)}>
                        <Text style={styles.input}>{patientType || 'Patient Type *'}</Text>
                        <Image source={require('../images/downArrow.png')} style={styles.downArrow} />
                    </TouchableOpacity>
                    {dropDownVisibleType && (
                        <View style={styles.dropdownCard}>
                            <ScrollView>
                                {['OP', 'IP'].map((type, index) => (
                                    <TouchableOpacity key={index} onPress={() => {
                                        setPatientType(type);
                                        setDropdownVisibleType(false);
                                    }}>
                                        <Text style={styles.dropdownItem}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.placeholder}>IP No.</Text>
                    <TextInput style={styles.input} onChangeText={setIPNo} value={IP_No} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.placeholder}>Ward Code</Text>
                    <TextInput style={styles.input} onChangeText={setWardCode} value={Ward_Code} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.placeholder}>Bed No.</Text>
                    <TextInput style={styles.input} onChangeText={setBedNo} value={Bed_No} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.placeholder}>Ref No.</Text>
                    <TextInput style={styles.input} onChangeText={setRefNo} value={Ref_No} />
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
        paddingVertical: 20,
    },
    headerText: {
        fontSize: Constants.FONT_SIZE.M,
        fontFamily: Constants.FONT_FAMILY.fontFamilyMedium,
    },
    input: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderWidth: 0.5,
        borderRadius: 10,
        borderColor: Constants.COLOR.THEME_COLOR,
        margin: 10,
        color: Constants.COLOR.BOOK_ID_TEXT_COLOR,
        fontFamily: Constants.FONT_FAMILY.fontFamilyMedium,
        fontSize: Constants.FONT_SIZE.M,
    },
    placeholder: {
        position: 'absolute',
        left: 20,
        paddingHorizontal: 5,
        fontSize: Constants.FONT_SIZE.SM,
        color: Constants.COLOR.BOOK_ID_TEXT_COLOR,
        fontFamily: Constants.FONT_FAMILY.fontFamilyMedium,
        backgroundColor: Constants.COLOR.WHITE_COLOR,
        zIndex: 1,
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
        tintColor: Constants.COLOR.BOOK_ID_TEXT_COLOR,
    },
    SubmitButtonView: {
        backgroundColor: Constants.COLOR.THEME_COLOR,
        borderRadius: 25,
        marginTop: 30,
        marginHorizontal: 10,
        marginBottom: 100,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
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
        backgroundColor: '#ECEEF5',
        borderColor: Constants.COLOR.THEME_COLOR,
        borderWidth: 0.5,
        borderRadius: 10,
        alignSelf: 'center',
        width: '95%',
        overflow: 'hidden',
        maxHeight: 200,
    },
    dropdownScrollView: {
        height: 200,
    },
    dropdownItem: {
        paddingVertical: 5,
        paddingHorizontal: 5,
        fontSize: Constants.FONT_SIZE.SM,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
    },
    inputContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignSelf: 'center',
        marginVertical: 10,
    },
    inputContainerDob: {
        alignSelf: 'center',
        width: '100%',
        marginVertical: 10,
    },
    SearchImg: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        position: 'absolute',
        right: 30,
        tintColor: Constants.COLOR.BOOK_ID_TEXT_COLOR,
    },
    CalenderImg: {
        width: 20,
        height: 20,
        position: 'absolute',
        right: 30,
        tintColor: Constants.COLOR.BOOK_ID_TEXT_COLOR,
    },
});
