
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image, Alert } from 'react-native';
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


type NavigationProp = StackNavigationProp<RootStackParamList, "AddPatient">;

type PatientPhysician = {
    code: string;
    name: string;
};

const ChoosePatientScreen = ({ showHeader = true }: any) => {
    const { userData } = useUser();
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

    // Fetch API hook
    const [fetchAPIReq] = useFetchApiMutation();
    const branchCode = userData?.Branch_Code;
    console.log("============branchCode====", branchCode);

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
        if ((patientData || selectedPatientDetails) && selectedPhysicianDetails) {
            navigation.navigate('ChooseTest', {
                selectedPatientDetails: selectedPatientDetails ?? patientData,
                selectedTests: [],
                totalCartValue: 0,
                shouldNavigateToCalender: false,
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
                <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 10, backgroundColor: Constants.COLOR.LAB_SEARCH_SCREEN_BG }}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Choose Patient</Text>
                        {(patientData === null && selectedPatientDetails === null) && (
                            <TouchableOpacity onPress={handlePressAdd}>
                                <Text style={styles.addText}>Add</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Patient Search Section */}
                    <View style={styles.section}>
                        <Text style={styles.label}>Patient</Text>
                        <View style={styles.row}>
                            <TextInput
                                style={[styles.inputPatient, styles.inputSmall]}
                                placeholder="Code"
                                placeholderTextColor="black"
                                value={codeQuery}
                                onChangeText={(query) => handlePatientSearch(query, 'code')}
                            />
                            <TextInput
                                style={[styles.inputPatient, styles.inputLarge]}
                                placeholder="Name"
                                placeholderTextColor="black"
                                value={nameQuery}
                                onChangeText={(query) => handlePatientSearch(query, 'name')}
                            />
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
                                <Text style={styles.patientDetailText}>Code: {selectedPatientDetails.PtCode}</Text>
                                <Text style={styles.patientDetailText}>Name: {selectedPatientDetails.PtName}</Text>
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
                                <Text>Name: {patientData.Pt_Name}</Text>
                                <Text>Phone: {patientData.Mobile_No}</Text>
                                <Text>Dob: {patientData.Dob}</Text>
                            </View>
                        )}
                    </View>

                    {/* Physician Search Section */}
                    <View style={styles.physicianSection}>
                        <Text style={styles.label}>Physician</Text>
                        <TextInput
                            style={styles.inputPatient}
                            placeholder="Search Physicians"
                            placeholderTextColor="#bab8ba"
                            value={physicianNameQuery}
                            onChangeText={(query) => handlePhysicianSearch(query, 'name')}
                        />
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
                            <Text style={styles.patientDetailText}>Code: {selectedPhysicianDetails.Ref_Code}</Text>
                            <Text style={styles.patientDetailText}>Name: {selectedPhysicianDetails.Ref_Name}</Text>
                        </View>
                    )}
                </View>
            </KeyboardAwareScrollView>
            <View style={styles.navigationContainer}>
                <TouchableOpacity onPress={handleNext}>
                    <ButtonNext />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ChoosePatientScreen;



const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: '#FBFBFB',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Constants.COLOR.BLACK_COLOR,
    },
    addText: {
        fontSize: 16,
        color: '#00A3FF',
        fontWeight: '500',
    },

    section: {
        marginBottom: 24,
    },
    physicianSection: {

    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputPatient: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 12,
    },
    inputSmall: {
        flex: 1,
        marginRight: 8,
    },
    inputLarge: {
        flex: 2,
    },
    autocompleteContainer: {
        maxHeight: 120,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
        borderRadius: 5,
        marginTop: 5,
    },
    autocompleteItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    autocompleteText: {
        fontSize: 14,
        color: '#333',
    },
    selectedPatientDetails: {
        marginTop: 10,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
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
        tintColor: 'gray',
    },
    patientDetailText: {
        fontSize: 14,
        color: '#000',
        marginBottom: 8,
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



