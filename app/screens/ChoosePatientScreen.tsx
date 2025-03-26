
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, Alert, I18nManager, Dimensions } from 'react-native';
import Constants from '../util/Constants';
import { useNavigation } from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import { useFetchApiMutation } from '../redux/service/FetchApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationBar from '../common/NavigationBar';
import BookTestHeader from './BookTestHeader';
import ButtonNext from '../common/NextButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SpinnerIndicator from '../common/SpinnerIndicator';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '../routes/Types';
import { useUser } from '../common/UserContext';
import { useAppSettings } from '../common/AppSettingContext';



type NavigationProp = StackNavigationProp<RootStackParamList, "AddPatient">;

type PatientPhysician = {
    code: string;
    name: string;
};

const { width, height } = Dimensions.get('window');

const ChoosePatientScreen = ({ showHeader = true }: any) => {
    const { userData } = useUser();
    const { labels, selectedLanguage } = useAppSettings();
    const navigation = useNavigation<NavigationProp>();
    const [codeQuery, setCodeQuery] = useState('');
    const [nameQuery, setNameQuery] = useState('');
    const [physicianCodeQuery, setPhysicianCodeQuery] = useState('');
    const [physicianNameQuery, setPhysicianNameQuery] = useState('');
    const [filteredPatients, setFilteredPatients] = useState<PatientPhysician[]>([]);
    const [filteredPhysician, setFilteredPhysician] = useState<PatientPhysician[]>([]);
    const [isPhysicianLoading, setIsPhysicianLoading] = useState(false);
    const [isPatientLoading, setIsPatientLoading] = useState(false);
    const [isPatientSelected, setIsPatientSelected] = useState(false);
    const [selectedPatientDetails, setSelectedPatientDetails] = useState<any>(null);
    const [selectedPhysicianDetails, setSelectedPhysicianDetails] = useState<any>(null);
    const [isPhysicianSelected, setIsPhysicianSelected] = useState(false);
    const [patientData, setPatientData] = useState<any>(null);


    console.log('SelectedPatientDetails', selectedPatientDetails)
    console.log('selectedPhysicianDetails', selectedPhysicianDetails)
    console.log('patientData', patientData)

    const getLabel = (key: string) => {
        return labels[key]?.defaultMessage || '';
    };

    // Fetch API hook
    const [fetchAPIReq] = useFetchApiMutation();
    const branchCode = userData?.Branch_Code;

    // Reusable search and fetch logic
    const fetchData = async (fetchObj: object, filterFunc: (item: any, query: string) => boolean, setFilteredData: React.Dispatch<React.SetStateAction<PatientPhysician[]>>, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, query: string) => {
        setIsLoading(true);
        try {
            const response = await fetchAPIReq(fetchObj);
            if (response?.data?.TableData?.data1) {
                const filteredData = response.data.TableData.data1
                    .filter((item: any) => filterFunc(item, query))
                    .map((item: any) => ({
                        code: item.PtCode || item.Ref_Code,
                        name: item.PtName || item.Ref_Name,
                    }));
                setFilteredData(filteredData);
            } else {
                console.warn("No data found in the response");
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle patient search
    const handlePatientSearch = (query: string, type: string) => {
        if (type === 'code') {
            setCodeQuery(query);
        } else {
            setNameQuery(query);
        }
        if (query) {
            fetchData(
                {
                    Mode: 'P',
                    Command: 'OLXV65571F',
                    branchNo: branchCode,
                    refType: selectedPatientDetails?.Ref_Type,
                    refCode: selectedPatientDetails?.Ref_Code,
                    searchText: query
                },
                (item, query) => {
                    if (type === 'code') {
                        return String(item.PtCode).includes(query);
                    }
                    if (type === 'name') {
                        return item.PtName && item.PtName.toLowerCase().includes(query.toLowerCase());
                    }
                    return true;
                },
                setFilteredPatients,
                setIsPatientLoading,
                query
            );
        } else {
            setFilteredPatients([]);
        }
    };

    // Handle physician search
    const handlePhysicianSearch = (queryPhysician: string, type: string) => {
        console.log('type', type)
        setPhysicianNameQuery(queryPhysician);
        if (queryPhysician) {
            fetchData(
                {
                    Mode: 'O',
                    Command: 'OLXV65571F',
                    branchNo: "08",
                    refType: "C",
                    refCode: selectedPhysicianDetails?.Ref_Code,
                    searchText: queryPhysician
                },
                (item, queryPhysician) => {
                    if (type === 'code') {
                        return String(item.Ref_Code).includes(queryPhysician);
                    }
                    if (type === 'name') {
                        return item.Ref_Name && item.Ref_Name.toLowerCase().includes(queryPhysician.toLowerCase());
                    }
                    return true;
                },
                setFilteredPhysician,
                setIsPhysicianLoading,
                queryPhysician
            );
        } else {
            setFilteredPhysician([]);
        }
    };

    const fetchPatientDetails = async (code: string) => {
        const fetchObj = {
            Mode: 'P',
            Command: 'OLXV65571F',
            branchNo: branchCode,
            refType: selectedPatientDetails?.Ref_Type,
            refCode: selectedPatientDetails?.Ref_Code,
            ptCode: code
        };
        setIsPatientLoading(true);
        try {
            const response = await fetchAPIReq(fetchObj);
            if (response?.data?.TableData?.data1) {
                const patientData = response.data.TableData.data1.find((item: { PtCode: string; }) => item.PtCode === code);
                if (patientData) {
                    setSelectedPatientDetails(patientData);
                }
            }
        } catch (error) {
            console.error('Error fetching patient details:', error);
        } finally {
            setIsPatientLoading(false);
        }
    };

    const fetchPhysicianDetails = async (code: string) => {
        const fetchObj = {
            Mode: 'L',
            Command: 'OLXV65571F',
            branchNo: "08",
            refType: "D",
            refCode: code
        };
        setIsPhysicianLoading(true);
        try {
            const response = await fetchAPIReq(fetchObj);
            if (response?.data?.TableData?.data1) {
                const physicianData = response.data.TableData.data1.find((item: { Ref_Code: string; }) => item.Ref_Code === code);
                if (physicianData) {
                    setSelectedPhysicianDetails(physicianData);
                }
            }
        } catch (error) {
            console.error('Error fetching physician details:', error);
        } finally {
            setIsPhysicianLoading(false);
        }
    };

    const handleSelectPatient = (patient: PatientPhysician) => {
        setCodeQuery(patient.code);
        setNameQuery(patient.name);
        setFilteredPatients([]);
        setIsPatientSelected(true);
        fetchPatientDetails(patient.code);
    };

    const handleSelectPhysician = (physician: PatientPhysician) => {
        console.log('physician', physician);

        setPhysicianCodeQuery(physician.code);
        setPhysicianNameQuery(physician.name);
        setFilteredPhysician([]);
        setIsPhysicianSelected(true);
        fetchPhysicianDetails(physician.code);
    };

    const handlePressAdd = () => {
        navigation.navigate('AddPatient');
    };

    const handleNext = async () => {
        const state = await NetInfo.fetch();
        if (!state.isConnected) {
            Alert.alert(
                Constants.ALERT.TITLE.ERROR,
                Constants.VALIDATION_MSG.NO_INTERNET,
            );
            return;
        }
        if ((patientData || selectedPatientDetails)) {
            navigation.navigate('ChooseTest', {
                selectedPatientDetails: selectedPatientDetails ?? patientData,
                selectedTests: [],
                totalCartValue: 0,
                shouldNavigateToCalender: false,
                fromChoosePatient: true,
                patientData,
            });
        } else {
            Alert.alert(
                Constants.ALERT.TITLE.INFO,
                Constants.VALIDATION_MSG.NO_PATIENT_SELECTED,
            );
        }
    };

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const storedData = await AsyncStorage.getItem('patientData');
                if (storedData) {
                    setPatientData(JSON.parse(storedData));
                }
            } catch (error) {
                console.error('Failed to load patient data:', error);
            }
        };

        fetchPatientData();
    }, []);

    useEffect(() => {
        if (selectedLanguage.Alignment === 'rtl') {
            I18nManager.forceRTL(true);
        } else {
            I18nManager.forceRTL(false);
        }
    }, [selectedLanguage]);

    return (
        <View style={styles.MainContainer}>
            {showHeader && (
                <>
                    <NavigationBar title="Book Test" />
                    <BookTestHeader selectValue={1} />
                </>
            )}
            <KeyboardAwareScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                enableOnAndroid
                keyboardOpeningTime={0}
                extraScrollHeight={10}
            >
                <View style={{ paddingHorizontal: 10, paddingVertical: 10, backgroundColor: Constants.COLOR.WHITE_COLOR }}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.headerTitle, { textAlign: selectedLanguage.Alignment === 'rtl' ? 'right' : 'left' }]} >{getLabel('patinfo_4')}</Text>
                        {(patientData === null && selectedPatientDetails === null) && (
                            <TouchableOpacity onPress={handlePressAdd}>
                                <Text style={styles.addText}>{getLabel('patinfo_5')}</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Patient Search Section */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Patient</Text>
                        <View style={styles.row}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.placeholderText}>Code</Text>
                                <TextInput
                                    style={[styles.inputPatient, styles.inputSmall]}
                                    value={codeQuery}
                                    onChangeText={(query) => handlePatientSearch(query, 'code')}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styles.placeholderText}>Name</Text>
                                <TextInput
                                    style={[styles.inputPatient, styles.inputLarge]}
                                    value={nameQuery}
                                    onChangeText={(query) => handlePatientSearch(query, 'name')}
                                />
                            </View>
                        </View>


                        {(codeQuery !== '' || nameQuery !== '') && (
                            filteredPatients.length > 0 ? (
                                <FlatList
                                    data={filteredPatients}
                                    keyExtractor={(item) => item.code}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={styles.autocompleteItem}
                                            onPress={() => handleSelectPatient(item)}
                                        >
                                            <Text style={styles.autocompleteText}>{`${item.code} - ${item.name}`}</Text>
                                        </TouchableOpacity>
                                    )}
                                    style={styles.autocompleteContainer}
                                />
                            ) : (
                                isPatientLoading ? (
                                    <SpinnerIndicator />
                                ) : !isPatientSelected && (
                                    <Text style={{ marginTop: 10, fontSize: 14, color: 'gray', textAlign: 'center' }}>
                                        No matching patients found
                                    </Text>
                                )
                            )
                        )}

                        {selectedPatientDetails && (
                            <View style={styles.selectedPatientDetails}>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => {
                                        setSelectedPatientDetails(null);
                                        setCodeQuery('');
                                        setNameQuery('');
                                        setFilteredPatients([]);
                                    }}
                                >
                                    <Image
                                        source={require('../images/black_cross.png')}
                                        style={styles.closeIcon}
                                    />
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={[styles.patientDetailText, { fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold, flex: 1, }]}>Code:</Text>
                                    <Text style={[styles.patientDetailText, { width: '80%' }]}>{selectedPatientDetails.PtCode}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={[styles.patientDetailText, { fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold, flex: 1, }]}>Name:</Text>
                                    <Text style={[styles.patientDetailText, { width: '80%' }]}> {selectedPatientDetails.PtName}</Text>
                                </View>
                            </View>
                        )}
                        {patientData && (
                            <View style={styles.selectedPatientDetails}>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setPatientData(null)}
                                >
                                    <Image
                                        source={require('../images/black_cross.png')}
                                        style={styles.closeIcon}
                                    />
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={[styles.patientDetailText, { fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold, width: '50%' }]}>Name:</Text>
                                    <Text style={[styles.patientDetailText, {}]}>{patientData.Pt_Name}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={[styles.patientDetailText, { fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold, width: '50%' }]}>Phone:</Text>
                                    <Text style={[styles.patientDetailText, {}]}>{patientData.Mobile_No}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={[styles.patientDetailText, { fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold, width: '50%' }]}>Dob:</Text>
                                    <Text style={[styles.patientDetailText, {}]}>{patientData.Dob}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={[styles.patientDetailText, { fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold, width: '50%' }]}>Patient_Type:</Text>
                                    <Text style={[styles.patientDetailText, {}]}>{patientData.Patient_Type}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={[styles.patientDetailText, { fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold, width: '50%' }]}>IP_No:</Text>
                                    <Text style={[styles.patientDetailText, {}]}>{patientData.IP_No}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={[styles.patientDetailText, { fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold, width: '50%' }]}>Ward_Code:</Text>
                                    <Text style={[styles.patientDetailText, {}]}>{patientData.Ward_Code}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={[styles.patientDetailText, { fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold, width: '50%' }]}>Ref_No:</Text>
                                    <Text style={[styles.patientDetailText, {}]}>{patientData.Ref_No}</Text>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Physician Search Section */}
                    <View style={styles.physicianSection}>
                        <Text style={styles.label}>{getLabel('patinfo_6')}</Text>
                        <View style={styles.inputContainer}>
                            <Text style={styles.placeholderText}>Search Physicians</Text>
                            <TextInput
                                style={styles.inputPatient}
                                value={physicianNameQuery}
                                onChangeText={(query) => handlePhysicianSearch(query, 'name')}
                            />
                        </View>
                    </View>

                    {(physicianCodeQuery !== '' || physicianNameQuery !== '') && (
                        filteredPhysician.length > 0 ? (
                            <FlatList
                                data={filteredPhysician}
                                keyExtractor={(item) => item.name}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.autocompleteItem}
                                        onPress={() => handleSelectPhysician(item)}
                                    >
                                        <Text style={styles.autocompleteText}>{`${item.name}`}</Text>
                                    </TouchableOpacity>
                                )}
                                style={styles.autocompleteContainer}
                            />
                        ) : (
                            isPhysicianLoading ? (
                                <SpinnerIndicator />
                            ) : !isPhysicianSelected && (
                                <Text style={{ marginTop: 10, fontSize: 14, color: 'gray', textAlign: 'center' }}>
                                    No matching physicians found
                                </Text>
                            )
                        )
                    )}
                    {selectedPhysicianDetails && (
                        <View style={styles.selectedPatientDetails}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => {
                                    setSelectedPhysicianDetails(null);
                                    setPhysicianCodeQuery('');
                                    setPhysicianNameQuery('');
                                    setFilteredPhysician([]);
                                }}
                            >
                                <Image
                                    source={require('../images/black_cross.png')}
                                    style={styles.closeIcon}
                                />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', }}>
                                <Text style={[styles.patientDetailText, { fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold, flex: 1 }]}>Code:</Text>
                                <Text style={[styles.patientDetailText, { width: '80%', }]}>{selectedPhysicianDetails.Ref_Code}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', }}>
                                <Text style={[styles.patientDetailText, { fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold, flex: 1 }]}>Name:</Text>
                                <Text style={[styles.patientDetailText, { width: '80%', }]}> {selectedPhysicianDetails.Ref_Name}</Text>
                            </View>
                        </View>
                    )}
                </View>
            </KeyboardAwareScrollView >
            <View style={styles.navigationContainer}>
                <TouchableOpacity onPress={handleNext}>
                    <ButtonNext />
                </TouchableOpacity>
            </View>
        </View >
    );
};

export default ChoosePatientScreen;

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: Constants.COLOR.WHITE_COLOR,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: Constants.FONT_SIZE.M,
        fontFamily: Constants.FONT_FAMILY.fontFamilyMedium,
        color: '#3C3636',
    },
    addText: {
        fontSize: Constants.FONT_SIZE.M,
        fontFamily: Constants.FONT_FAMILY.fontFamilyMedium,
        color: Constants.COLOR.THEME_COLOR,
    },
    section: {
        marginBottom: 24,
    },
    physicianSection: {

    },
    label: {
        fontSize: Constants.FONT_SIZE.M,
        fontFamily: Constants.FONT_FAMILY.fontFamilyMedium,
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    inputPatient: {
        borderRadius: 10,
        borderWidth: 0.5,
        height: height * 0.06,
        paddingHorizontal: 10,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
        fontSize: Constants.FONT_SIZE.S,
        zIndex: 0,
    },
    inputContainer: {
        position: 'relative',
        marginBottom: 10,
        flex: 1,
    },
    placeholderText: {
        position: 'absolute',
        top: -10,
        left: 10,
        zIndex: 1,
        backgroundColor: Constants.COLOR.WHITE_COLOR,
        paddingHorizontal: 5,
        fontSize: Constants.FONT_SIZE.SM,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
        color: Constants.COLOR.BOOK_ID_TEXT_COLOR
    },
    inputSmall: {
        flex: 1,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
        fontSize: Constants.FONT_SIZE.SM
    },
    inputLarge: {
        flex: 2,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
        fontSize: Constants.FONT_SIZE.SM
    },
    autocompleteContainer: {
        maxHeight: 150,
        borderWidth: 0.5,
        borderColor: Constants.COLOR.BLACK_COLOR,
        backgroundColor: '#ECEEF5',
        borderRadius: 10,
        marginTop: 5,
    },
    autocompleteItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    autocompleteText: {
        fontSize: Constants.FONT_SIZE.SM,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular
    },
    selectedPatientDetails: {
        marginTop: 10,
        padding: 16,
        backgroundColor: '#ECEEF5',
        shadowColor: Constants.COLOR.THEME_COLOR,
        elevation: 3,
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 1,
    },
    closeIcon: {
        width: 14,
        height: 14,
        resizeMode: 'contain',
    },
    patientDetailText: {
        fontSize: Constants.FONT_SIZE.SM,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular
    },
    navigationContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#FBFBFB',
        justifyContent: 'flex-end',
    },
});



