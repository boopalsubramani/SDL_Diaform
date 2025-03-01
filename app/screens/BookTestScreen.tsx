
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import ChoosePatientScreen from './ChoosePatientScreen';
import ChooseTestScreen from './ChooseTestScreen';
import BookTestSearchScreen from './BookTestSearchScreen';

const BookTestScreen = ({ navigation, route }: any) => {
  const [step, setStep] = useState(1);

  // Maintain step state when navigating back
  useFocusEffect(
    useCallback(() => {
      if (route?.params?.step) {
        setStep(route.params.step);
      }
    }, [route?.params?.step])
  );

  const renderScreen = () => {
    switch (step) {
      case 1:
        return <ChoosePatientScreen />;
      case 2:
        return <ChooseTestScreen />;
      case 3:
        return <BookTestSearchScreen route={undefined} />;
      default:
        return <ChoosePatientScreen />;
    }
  };

  return (
    <View style={styles.MainContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {renderScreen()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#FBFBFB',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});

export default BookTestScreen;




// import React, { useEffect, useState } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     StyleSheet,
//     FlatList,
//     Image,
//     Alert,
//     Modal,
//     Dimensions,
//     ScrollView,
//     TouchableWithoutFeedback
// } from 'react-native';
// import Constants from '../util/Constants';
// import { useNavigation } from '@react-navigation/native';
// import NetInfo from '@react-native-community/netinfo';
// import { useFetchApiMutation } from '../redux/service/FetchApiService';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import NavigationBar from '../common/NavigationBar';
// import BookTestHeader from './BookTestHeader';
// import ButtonNext from '../common/NextButton';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import SpinnerIndicator from '../common/SpinnerIndicator';
// import { StackNavigationProp } from "@react-navigation/stack";
// import { RootStackParamList } from '../routes/Types';
// import { useUser } from '../common/UserContext';
// import { useBookTestSearchMutation } from '../redux/service/BookTestSearchService';
// import { useDuplicateServiceBookingMutation } from '../redux/service/DuplicateServiceBookingService';

// const deviceHeight = Dimensions.get('window').height;
// const deviceWidth = Dimensions.get('window').width;

// type NavigationProp = StackNavigationProp<RootStackParamList, "BookTest">;

// type PatientPhysician = {
//   code: string;
//   name: string;
// };

// const BookTestScreen = ({ showHeader = true }: any) => {
//     const { userData } = useUser();
//     const navigation = useNavigation<NavigationProp>();
//     const [codeQuery, setCodeQuery] = useState('');
//     const [nameQuery, setNameQuery] = useState('');
//     const [physicianCodeQuery, setPhysicianCodeQuery] = useState('');
//     const [physicianNameQuery, setPhysicianNameQuery] = useState('');
//     const [filteredPatients, setFilteredPatients] = useState<PatientPhysician[]>([]);
//     const [filteredPhysician, setFilteredPhysician] = useState<PatientPhysician[]>([]);
//     const [isPhysicianLoading, setIsPhysicianLoading] = useState(false);
//     const [isPatientLoading, setIsPatientLoading] = useState(false);
//     const [isPatientSelected, setIsPatientSelected] = useState(false);
//     const [selectedPatientDetails, setSelectedPatientDetails] = useState<any>(null);
//     const [selectedPhysicianDetails, setSelectedPhysicianDetails] = useState<any>(null);
//     const [isPhysicianSelected, setIsPhysicianSelected] = useState(false);
//     const [patientData, setPatientData] = useState<any>(null);
//     const [selectedImage, setSelectedImage] = useState<string | null>(null);
//     const [totalCartValue, setTotalCartValue] = useState(0);
//     const [isModalVisible, setModalVisible] = useState(false);
//     const [cartItems, setCartItems] = useState<string[]>([]);
//     const [searchText, setSearchText] = useState('');
//     const [testData, setTestData] = useState<any[]>([]);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [displayCartState, setDisplayCartState] = useState<{ [key: string]: boolean }>({});
//     const [previousCartItems, setPreviousCartItems] = useState<string[]>([]);
//     const [currentScreen, setCurrentScreen] = useState('choosePatient');

//     const [fetchAPIReq] = useFetchApiMutation();
//     const [searchTestAPIReq, { data: searchTestAPIRes, isLoading }] = useBookTestSearchMutation();
//     const [duplicateBookingServiceAPIReq, { data: duplicateBookingServiceAPIRes }] = useDuplicateServiceBookingMutation();
//     const branchCode = userData?.Branch_Code;

//     const labels = Constants?.Message?.[0]?.Labels || {};

//     const getLabel = (key: string) => {
//         return labels[key]?.defaultMessage || '';
//     };

//     useEffect(() => {
//         const fetchPatientData = async () => {
//             try {
//                 const storedData = await AsyncStorage.getItem('patientData');
//                 if (storedData) {
//                     setPatientData(JSON.parse(storedData));
//                 }
//             } catch (error) {
//                 console.error('Failed to load patient data:', error);
//             }
//         };

//         fetchPatientData();
//     }, []);

//     const fetchData = async (fetchObj: object, filterFunc: (item: any, query: string) => boolean, setFilteredData: React.Dispatch<React.SetStateAction<PatientPhysician[]>>, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, query: string) => {
//         setIsLoading(true);
//         try {
//             const response = await fetchAPIReq(fetchObj);
//             if (response?.data?.TableData?.data1) {
//                 const filteredData = response.data.TableData.data1
//                     .filter((item: any) => filterFunc(item, query))
//                     .map((item: any) => ({
//                         code: item.PtCode || item.Ref_Code,
//                         name: item.PtName || item.Ref_Name,
//                     }));
//                 setFilteredData(filteredData);
//             } else {
//                 console.warn("No data found in the response");
//             }
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handlePatientSearch = (query: string, type: string) => {
//         if (type === 'code') {
//             setCodeQuery(query);
//         } else {
//             setNameQuery(query);
//         }
//         if (query) {
//             fetchData(
//                 {
//                     Mode: 'P',
//                     Command: 'OLXV65571F',
//                     branchNo: branchCode,
//                     refType: selectedPatientDetails?.Ref_Type,
//                     refCode: selectedPatientDetails?.Ref_Code,
//                     searchText: query
//                 },
//                 (item, query) => {
//                     if (type === 'code') {
//                         return String(item.PtCode).includes(query);
//                     }
//                     if (type === 'name') {
//                         return item.PtName && item.PtName.toLowerCase().includes(query.toLowerCase());
//                     }
//                     return true;
//                 },
//                 setFilteredPatients,
//                 setIsPatientLoading,
//                 query
//             );
//         } else {
//             setFilteredPatients([]);
//         }
//     };

//     const handlePhysicianSearch = (queryPhysician: string, type: string) => {
//         setPhysicianNameQuery(queryPhysician);
//         if (queryPhysician) {
//             fetchData(
//                 {
//                     Mode: 'O',
//                     Command: 'OLXV65571F',
//                     branchNo: "08",
//                     refType: "C",
//                     refCode: selectedPhysicianDetails?.Ref_Code,
//                     searchText: queryPhysician
//                 },
//                 (item, queryPhysician) => {
//                     if (type === 'code') {
//                         return String(item.Ref_Code).includes(queryPhysician);
//                     }
//                     if (type === 'name') {
//                         return item.Ref_Name && item.Ref_Name.toLowerCase().includes(queryPhysician.toLowerCase());
//                     }
//                     return true;
//                 },
//                 setFilteredPhysician,
//                 setIsPhysicianLoading,
//                 queryPhysician
//             );
//         } else {
//             setFilteredPhysician([]);
//         }
//     };

//     const fetchPatientDetails = async (code: string) => {
//         const fetchObj = {
//             Mode: 'P',
//             Command: 'OLXV65571F',
//             branchNo: branchCode,
//             refType: selectedPatientDetails?.Ref_Type,
//             refCode: selectedPatientDetails?.Ref_Code,
//             ptCode: code
//         };
//         setIsPatientLoading(true);
//         try {
//             const response = await fetchAPIReq(fetchObj);
//             if (response?.data?.TableData?.data1) {
//                 const patientData = response.data.TableData.data1.find((item: { PtCode: string; }) => item.PtCode === code);
//                 if (patientData) {
//                     setSelectedPatientDetails(patientData);
//                 }
//             }
//         } catch (error) {
//             console.error('Error fetching patient details:', error);
//         } finally {
//             setIsPatientLoading(false);
//         }
//     };

//     const fetchPhysicianDetails = async (code: string) => {
//         const fetchObj = {
//             Mode: 'L',
//             Command: 'OLXV65571F',
//             branchNo: "08",
//             refType: "D",
//             refCode: code
//         };
//         setIsPhysicianLoading(true);
//         try {
//             const response = await fetchAPIReq(fetchObj);
//             if (response?.data?.TableData?.data1) {
//                 const physicianData = response.data.TableData.data1.find((item: { Ref_Code: string; }) => item.Ref_Code === code);
//                 if (physicianData) {
//                     setSelectedPhysicianDetails(physicianData);
//                 }
//             }
//         } catch (error) {
//             console.error('Error fetching physician details:', error);
//         } finally {
//             setIsPhysicianLoading(false);
//         }
//     };

//     const handleSelectPatient = (patient: PatientPhysician) => {
//         setCodeQuery(patient.code);
//         setNameQuery(patient.name);
//         setFilteredPatients([]);
//         setIsPatientSelected(true);
//         fetchPatientDetails(patient.code);
//     };

//     const handleSelectPhysician = (physician: PatientPhysician) => {
//         setPhysicianCodeQuery(physician.code);
//         setPhysicianNameQuery(physician.name);
//         setFilteredPhysician([]);
//         setIsPhysicianSelected(true);
//         fetchPhysicianDetails(physician.code);
//     };

//     const handlePressAdd = () => {
//         navigation.navigate('AddPatient');
//     };

//     const handleNext = async () => {
//         const state = await NetInfo.fetch();
//         if (!state.isConnected) {
//             Alert.alert(
//                 Constants.ALERT.TITLE.ERROR,
//                 Constants.VALIDATION_MSG.NO_INTERNET,
//             );
//             return;
//         }
//         if ((patientData || selectedPatientDetails)) {
//             setCurrentScreen('chooseTest');
//         } else {
//             Alert.alert(
//                 Constants.ALERT.TITLE.INFO,
//                 Constants.VALIDATION_MSG.NO_PATIENT_SELECTED,
//             );
//         }
//     };

//     useEffect(() => {
//         const fetchPatientData = async () => {
//             try {
//                 const storedData = await AsyncStorage.getItem('patientData');
//                 if (storedData) {
//                     setPatientData(JSON.parse(storedData));
//                 }
//             } catch (error) {
//                 console.error('Failed to load patient data:', error);
//             }
//         };

//         fetchPatientData();
//     }, []);

//     useEffect(() => {
//         if (searchText.trim().length > 2) {
//             const refType = selectedPatientDetails?.Ref_Type || 'C';
//             const refCode = selectedPatientDetails?.Ref_Code || '01000104';
//             const discount_percentage = selectedPatientDetails?.Discount_Percentage || '0';

//             const requestBody = {
//                 App_Type: "R",
//                 Service_Type: "T",
//                 Search_Text: searchText,
//                 Ref_Type: refType,
//                 Ref_Code: refCode,
//                 Coverage_Percent: "0",
//                 Offer_Amount: "1",
//                 Discount_Percentage: discount_percentage,
//             };
//             searchTestAPIReq(requestBody);
//         } else {
//             setTestData([]);
//             setErrorMessage('');
//         }
//     }, [searchText]);

//     useEffect(() => {
//         if (searchTestAPIRes?.SuccessFlag === "true" && searchTestAPIRes?.Message) {
//             if (searchTestAPIRes.Message.length > 0) {
//                 setTestData(searchTestAPIRes.Message);
//                 setErrorMessage('');
//             } else {
//                 setErrorMessage('No data found.');
//             }
//         } else if (searchTestAPIRes?.SuccessFlag === "false") {
//             Alert.alert('Error', searchTestAPIRes?.ErrorMessage || 'Failed to fetch tests.');
//         }
//     }, [searchTestAPIRes]);

//     useEffect(() => {
//         const unsubscribe = navigation.addListener('focus', () => {
//             const hasDuplicate = cartItems.some(item =>
//                 previousCartItems.includes(item)
//             );

//             if (hasDuplicate) {
//                 Alert.alert('Duplicate Selection', 'The selected data is the same as the previous selection.');
//             } else {
//                 setDisplayCartState({});
//             }
//         });

//         return unsubscribe;
//     }, [navigation, previousCartItems, cartItems]);

//     useEffect(() => {
//         const unsubscribe = navigation.addListener('blur', () => {
//             setPreviousCartItems([...cartItems]);
//         });
//         return unsubscribe;
//     }, [navigation, cartItems]);

//     const handleCross = () => navigation.goBack();

//     const checkDuplicateTest = async ({ item, cartArray }: any) => {
//         const payload = {
//             New_Service_Code: item.Service_Code,
//             Service_Reg_Data: cartArray.map((cartItem: { Service_Code: any; }) => ({
//                 Service_Code: cartItem.Service_Code,
//             })),
//         };
//         console.log("API Payload:", payload);
//         try {
//             const response = await duplicateBookingServiceAPIReq(payload).unwrap();
//             console.log("API Response:", response);

//             const isDuplicate = response.IsDuplicate === "true";
//             return { isDuplicate, error: isDuplicate ? { message: response.Message[0]?.Message || 'Duplicate test detected.' } : null };
//         } catch (error) {
//             console.error("API Error:", error);
//             return { isDuplicate: false, error: { message: 'Error checking for duplicates.' } };
//         }
//     };

//     const handleToggleCart = async (itemName: any) => {
//         console.log("Item to add:", itemName);
//         const item = testData.find(test => test.Service_Name === itemName);
//         if (!item) {
//             console.error("Item not found in testData");
//             return;
//         }

//         const cartItemsForCheck = cartItems.map(name => {
//             const cartItem = testData.find(test => test.Service_Name === name);
//             return cartItem ? { ...cartItem, Service_Code: cartItem.Service_Code || "" } : null;
//         }).filter(Boolean);

//         console.log("Cart items for check:", cartItemsForCheck);
//         try {
//             const response = await checkDuplicateTest({
//                 item: { ...item, Service_Code: item.Service_Code || "" },
//                 cartArray: cartItemsForCheck,
//             });

//             if (response?.isDuplicate) {
//                 Alert.alert('Duplicate Booking', response.error?.message || 'Duplicate test detected.');
//                 return;
//             }

//             console.log("Adding item to cart:", itemName);
//             setCartItems(prevCartItems => [...prevCartItems, itemName]);
//             setDisplayCartState(prevState => ({
//                 ...prevState,
//                 [itemName]: !prevState[itemName],
//             }));
//         } catch (error) {
//             console.error("Error in handleToggleCart:", error);
//             Alert.alert('Error', 'An error occurred while adding the item to the cart.');
//         }
//     };

//     const handleProceedClick = async () => {
//         if (cartItems.length > 0) {
//             const selectedTests = cartItems.map(itemName => {
//                 const item = testData.find(test => test.Service_Name === itemName);
//                 return {
//                     Service_Name: item?.Service_Name,
//                     Amount: item?.Amount,
//                     Service_Code: item?.Service_Code || "",
//                     Discount_Amount: item?.Discount_Amount,
//                     T_Bill_Amount: item?.T_Bill_Amount,
//                     T_Patient_Due: item?.T_Patient_Due,
//                 };
//             });

//             setCurrentScreen('bookTestSearch');
//         } else {
//             Alert.alert('Empty Cart', 'Please add items to the cart before proceeding.');
//         }
//     };

//     const calculateTotalCartValue = () => {
//         const total = cartItems.reduce((total, itemName) => {
//             const item = testData.find(test => test.Service_Name === itemName);
//             return total + (item?.Amount || 0);
//         }, 0);
//         setTotalCartValue(total);
//     };

//     useEffect(() => {
//         calculateTotalCartValue();
//     }, [cartItems, testData]);

//     const handleCartIconClick = () => {
//         setModalVisible(true);
//     };

//     const renderItem = ({ item }: any) => {
//         const isItemInCart = cartItems.includes(item.Service_Name);
//         const displayRemove = displayCartState[item.Service_Name] || false;

//         return (
//             <View style={styles.testItemContainer}>
//                 <Text style={styles.testName}>{item.Service_Name}</Text>
//                 <Text style={styles.testPrice}>{item.Amount} INR</Text>
//                 <TouchableOpacity
//                     style={styles.addToCartButton}
//                     onPress={() => handleToggleCart(item.Service_Name)}
//                 >
//                     <View style={styles.addToCartContainer}>
//                         <Image
//                             source={require('../images/addCart.png')}
//                             style={styles.CartIcon}
//                         />
//                         <Text>{displayRemove ? 'Remove' : 'Add Cart'}</Text>
//                     </View>
//                 </TouchableOpacity>
//             </View>
//         );
//     };

//     const renderCartItems = () => {
//         if (cartItems.length === 0) {
//             return (
//                 <View style={styles.emptyCartContainer}>
//                     <Text style={styles.emptyCartText}>{getLabel('labtscr_4')}</Text>
//                 </View>
//             );
//         }
//         return cartItems.map((item, index) => {
//             const itemData = testData.find((test: { Service_Name: string; }) => test.Service_Name === item);
//             return (
//                 <View style={styles.testItemContainer} key={index}>
//                     <Text style={styles.testName}>{item}</Text>
//                     <Text style={styles.testPrice}>{itemData?.Amount} INR</Text>
//                     <TouchableOpacity onPress={() => handleToggleCart(item)}>
//                         <View style={styles.addToCartContainer}>
//                             <Image source={require('../images/addCart.png')} style={styles.CartIcon} />
//                             <Text>Remove</Text>
//                         </View>
//                     </TouchableOpacity>
//                 </View>
//             );
//         });
//     };

//     const handleSearchTest = () => {
//         setCurrentScreen('bookTestSearch');
//     };

//     const handleUploadPrescription = () => {
//         navigation.navigate('UploadPrescription');
//     };

//     const handleBack = async () => {
//         const state = await NetInfo.fetch();
//         if (!state.isConnected) {
//             Alert.alert(
//                 Constants.ALERT.TITLE.ERROR,
//                 Constants.VALIDATION_MSG.NO_INTERNET,
//             );
//             return;
//         }
//         if (currentScreen === 'chooseTest') {
//             setCurrentScreen('choosePatient');
//         } else if (currentScreen === 'bookTestSearch') {
//             setCurrentScreen('chooseTest');
//         }
//     };

//     return (
//         <View style={styles.MainContainer}>
//             {showHeader && (
//                 <>
//                     <NavigationBar title="Book Test" />
//                     <BookTestHeader selectValue={1} />
//                 </>
//             )}
//             {currentScreen === 'choosePatient' && (
//                 <KeyboardAwareScrollView
//                     contentContainerStyle={{ flexGrow: 1 }}
//                     enableOnAndroid
//                     keyboardShouldPersistTaps="handled"
//                 >
//                     <View style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 10, backgroundColor: Constants.COLOR.LAB_SEARCH_SCREEN_BG }}>
//                         <View style={styles.header}>
//                             <Text style={styles.headerTitle}>Choose Patient</Text>
//                             {(patientData === null && selectedPatientDetails === null) && (
//                                 <TouchableOpacity onPress={handlePressAdd}>
//                                     <Text style={styles.addText}>Add</Text>
//                                 </TouchableOpacity>
//                             )}
//                         </View>
//                         <View style={styles.section}>
//                             <Text style={styles.label}>Patient</Text>
//                             <View style={styles.row}>
//                                 <TextInput
//                                     style={[styles.inputPatient, styles.inputSmall]}
//                                     placeholder="Code"
//                                     placeholderTextColor="black"
//                                     value={codeQuery}
//                                     onChangeText={(query) => handlePatientSearch(query, 'code')}
//                                 />
//                                 <TextInput
//                                     style={[styles.inputPatient, styles.inputLarge]}
//                                     placeholder="Name"
//                                     placeholderTextColor="black"
//                                     value={nameQuery}
//                                     onChangeText={(query) => handlePatientSearch(query, 'name')}
//                                 />
//                             </View>
//                             {(codeQuery !== '' || nameQuery !== '') && (
//                                 filteredPatients.length > 0 ? (
//                                     <FlatList
//                                         data={filteredPatients}
//                                         keyExtractor={(item) => item.code}
//                                         renderItem={({ item }) => (
//                                             <TouchableOpacity
//                                                 style={styles.autocompleteItem}
//                                                 onPress={() => handleSelectPatient(item)}
//                                             >
//                                                 <Text style={styles.autocompleteText}>{`${item.code} - ${item.name}`}</Text>
//                                             </TouchableOpacity>
//                                         )}
//                                         style={styles.autocompleteContainer}
//                                     />
//                                 ) : (
//                                     isPatientLoading ? (
//                                         <SpinnerIndicator />
//                                     ) : !isPatientSelected && (
//                                         <Text style={{ marginTop: 10, fontSize: 14, color: 'gray', textAlign: 'center' }}>
//                                             No matching patients found
//                                         </Text>
//                                     )
//                                 )
//                             )}
//                             {selectedPatientDetails && (
//                                 <View style={styles.selectedPatientDetails}>
//                                     <TouchableOpacity
//                                         style={styles.closeButton}
//                                         onPress={() => {
//                                             setSelectedPatientDetails(null);
//                                             setCodeQuery('');
//                                             setNameQuery('');
//                                             setFilteredPatients([]);
//                                         }}
//                                     >
//                                         <Image
//                                             source={require('../images/black_cross.png')}
//                                             style={styles.closeIcon}
//                                         />
//                                     </TouchableOpacity>
//                                     <Text style={styles.patientDetailText}>Code: {selectedPatientDetails.PtCode}</Text>
//                                     <Text style={styles.patientDetailText}>Name: {selectedPatientDetails.PtName}</Text>
//                                 </View>
//                             )}
//                             {patientData && (
//                                 <View style={styles.selectedPatientDetails}>
//                                     <TouchableOpacity
//                                         style={styles.closeButton}
//                                         onPress={() => setPatientData(null)}
//                                     >
//                                         <Image
//                                             source={require('../images/black_cross.png')}
//                                             style={styles.closeIcon}
//                                         />
//                                     </TouchableOpacity>
//                                     <Text>Name: {patientData.Pt_Name}</Text>
//                                     <Text>Phone: {patientData.Mobile_No}</Text>
//                                     <Text>Dob: {patientData.Dob}</Text>
//                                 </View>
//                             )}
//                         </View>
//                         <View style={styles.physicianSection}>
//                             <Text style={styles.label}>Physician</Text>
//                             <TextInput
//                                 style={styles.inputPatient}
//                                 placeholder="Search Physicians"
//                                 placeholderTextColor="#bab8ba"
//                                 value={physicianNameQuery}
//                                 onChangeText={(query) => handlePhysicianSearch(query, 'name')}
//                             />
//                         </View>
//                         {(physicianCodeQuery !== '' || physicianNameQuery !== '') && (
//                             filteredPhysician.length > 0 ? (
//                                 <FlatList
//                                     data={filteredPhysician}
//                                     keyExtractor={(item) => item.name}
//                                     renderItem={({ item }) => (
//                                         <TouchableOpacity
//                                             style={styles.autocompleteItem}
//                                             onPress={() => handleSelectPhysician(item)}
//                                         >
//                                             <Text style={styles.autocompleteText}>{`${item.name}`}</Text>
//                                         </TouchableOpacity>
//                                     )}
//                                     style={styles.autocompleteContainer}
//                                 />
//                             ) : (
//                                 isPhysicianLoading ? (
//                                     <SpinnerIndicator />
//                                 ) : !isPhysicianSelected && (
//                                     <Text style={{ marginTop: 10, fontSize: 14, color: 'gray', textAlign: 'center' }}>
//                                         No matching physicians found
//                                     </Text>
//                                 )
//                             )
//                         )}
//                         {selectedPhysicianDetails && (
//                             <View style={styles.selectedPatientDetails}>
//                                 <TouchableOpacity
//                                     style={styles.closeButton}
//                                     onPress={() => {
//                                         setSelectedPhysicianDetails(null);
//                                         setPhysicianCodeQuery('');
//                                         setPhysicianNameQuery('');
//                                         setFilteredPhysician([]);
//                                     }}
//                                 >
//                                     <Image
//                                         source={require('../images/black_cross.png')}
//                                         style={styles.closeIcon}
//                                     />
//                                 </TouchableOpacity>
//                                 <Text style={styles.patientDetailText}>Code: {selectedPhysicianDetails.Ref_Code}</Text>
//                                 <Text style={styles.patientDetailText}>Name: {selectedPhysicianDetails.Ref_Name}</Text>
//                             </View>
//                         )}
//                     </View>
//                 </KeyboardAwareScrollView>
//             )}
//             {currentScreen === 'chooseTest' && (
//                 <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//                     <View style={styles.innerContainer}>
//                         <View style={styles.ChooseTestView}>
//                             <Text style={styles.chooseTestText}>Choose Test</Text>
//                             <View style={styles.cartValueView}>
//                                 <Text style={styles.cartValueLabel}>{getLabel('labtscr_6')}</Text>
//                                 <Text style={styles.cartValue}>{totalCartValue} INR</Text>
//                             </View>
//                         </View>
//                         <View style={styles.searchCartView}>
//                             <TouchableOpacity onPress={handleSearchTest}>
//                                 <Image source={require('../images/search.png')} style={styles.searchIcon} />
//                             </TouchableOpacity>
//                             <Text style={styles.searchLabel}>{getLabel('labtscr_8')}</Text>
//                             <TouchableOpacity onPress={handleCartIconClick} style={styles.searchCartRightView}>
//                                 <Image source={require('../images/addCart.png')} style={styles.CartIcon} />
//                             </TouchableOpacity>
//                             {cartItems.length > 0 && (
//                                 <View style={styles.notificationBadge}>
//                                     <Text style={styles.notificationBadgeText}>{cartItems.length}</Text>
//                                 </View>
//                             )}
//                         </View>
//                         {selectedImage && (
//                             <View style={styles.uploadedImageContainer}>
//                                 <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
//                             </View>
//                         )}
//                         <View style={styles.uploadContainer}>
//                             <TouchableOpacity style={styles.uploadButtonView} onPress={handleUploadPrescription}>
//                                 <Image source={require('../images/up_arrow.png')} style={styles.uploadImage} />
//                                 <Text style={styles.uploadText}>{getLabel('labtscr_10')}</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </ScrollView>
//             )}
//             {currentScreen === 'bookTestSearch' && (
//                 <View style={styles.MainContainer}>
//                     <View style={styles.searchTestView}>
//                         <Text style={styles.headerText}>Search Test</Text>
//                         <TouchableOpacity onPress={handleCross} style={styles.closeImageStyle}>
//                             <Image source={require('../images/black_cross.png')} />
//                         </TouchableOpacity>
//                     </View>
//                     <View style={styles.inputContainer}>
//                         <Image source={require('../images/search.png')} style={styles.searchIcon} />
//                         <TextInput
//                             style={styles.inputText}
//                             placeholder="Search"
//                             placeholderTextColor="black"
//                             value={searchText}
//                             onChangeText={setSearchText}
//                         />
//                         {searchText.length > 0 && (
//                             <TouchableOpacity onPress={() => setSearchText('')}>
//                                 <Image
//                                     source={require('../images/black_cross.png')}
//                                     style={styles.CrossIconTop}
//                                 />
//                             </TouchableOpacity>
//                         )}
//                         <TouchableOpacity onPress={handleCartIconClick}>
//                             <Image source={require('../images/addCart.png')} style={styles.CartIconTop} />
//                         </TouchableOpacity>
//                         {cartItems.length > 0 && (
//                             <View style={styles.notificationBadge}>
//                                 <Text style={styles.notificationBadgeText}>{cartItems.length}</Text>
//                             </View>
//                         )}
//                     </View>
//                     <Modal
//                         animationType="slide"
//                         transparent={true}
//                         visible={isModalVisible}
//                         onRequestClose={() => setModalVisible(false)}
//                     >
//                         <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
//                             <View style={styles.modalContainer}>
//                                 <TouchableWithoutFeedback>
//                                     <View style={styles.modalBackground}>
//                                         <View style={styles.modalContent}>
//                                             {renderCartItems()}
//                                             <Text style={styles.bottomText}>Total Cart Value INR {totalCartValue}</Text>
//                                             {cartItems.length > 0 && (
//                                                 <TouchableOpacity onPress={handleProceedClick}>
//                                                     <View style={styles.SubmitButtonView}>
//                                                         <Text style={styles.ButtonText}>{getLabel('labtscr_2')}</Text>
//                                                     </View>
//                                                 </TouchableOpacity>
//                                             )}
//                                             <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
//                                                 <Text style={{ color: '#fd1a1b' }}>{getLabel('labtscr_3')}</Text>
//                                             </View>
//                                         </View>
//                                     </View>
//                                 </TouchableWithoutFeedback>
//                             </View>
//                         </TouchableWithoutFeedback>
//                     </Modal>
//                     {isLoading && (
//                         <View style={styles.spinnerContainer}>
//                             <SpinnerIndicator />
//                         </View>
//                     )}
//                     {errorMessage ? (
//                         <Text style={{ textAlign: 'center', marginTop: 20, color: 'red', fontSize: Constants.FONT_SIZE.M }}>
//                             {errorMessage}
//                         </Text>
//                     ) : (
//                         <FlatList
//                             data={testData}
//                             keyExtractor={item => `${item.RowNumber || item.Service_Name}`}
//                             renderItem={renderItem}
//                             contentContainerStyle={styles.flatListContainer}
//                             ListEmptyComponent={() => (
//                                 <Text
//                                     style={{
//                                         textAlign: 'center',
//                                         marginTop: 20,
//                                         color: 'gray',
//                                         fontSize: Constants.FONT_SIZE.M,
//                                     }}
//                                 >
//                                     No tests found. Please try again.
//                                 </Text>
//                             )}
//                         />
//                     )}
//                     {searchText.trim().length > 0 && (
//                         <View>
//                             <Text style={styles.bottomText}>
//                                 Total Cart Value INR {totalCartValue}
//                             </Text>
//                             <TouchableOpacity onPress={handleProceedClick}>
//                                 <View style={styles.SubmitButtonView}>
//                                     <Text style={styles.ButtonText}>Proceed</Text>
//                                 </View>
//                             </TouchableOpacity>
//                             <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
//                                 <Text style={{ color: '#fd1a1b' }}>
//                                     Note: *Indicates Non Discounted Test
//                                 </Text>
//                             </View>
//                         </View>
//                     )}
//                 </View>
//             )}
//             <View style={styles.navigationContainer}>
//                 <TouchableOpacity onPress={handleBack}>
//                     <ButtonNext />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={handleNext}>
//                     <ButtonNext />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };

// export default BookTestScreen;

// const styles = StyleSheet.create({
//     MainContainer: {
//         flex: 1,
//         backgroundColor: '#FBFBFB',
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         marginBottom: 16,
//     },
//     headerTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: Constants.COLOR.BLACK_COLOR,
//     },
//     addText: {
//         fontSize: 16,
//         color: '#00A3FF',
//         fontWeight: '500',
//     },
//     section: {
//         marginBottom: 24,
//     },
//     physicianSection: {
//         marginBottom: 24,
//     },
//     label: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#000',
//         marginBottom: 8,
//     },
//     row: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     inputPatient: {
//         backgroundColor: 'white',
//         borderRadius: 10,
//         padding: 12,
//     },
//     inputSmall: {
//         flex: 1,
//         marginRight: 8,
//     },
//     inputLarge: {
//         flex: 2,
//     },
//     autocompleteContainer: {
//         maxHeight: 120,
//         borderWidth: 1,
//         borderColor: '#ccc',
//         backgroundColor: '#fff',
//         borderRadius: 5,
//         marginTop: 5,
//     },
//     autocompleteItem: {
//         padding: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: '#eee',
//     },
//     autocompleteText: {
//         fontSize: 14,
//         color: '#333',
//     },
//     selectedPatientDetails: {
//         marginTop: 10,
//         padding: 16,
//         backgroundColor: '#fff',
//         borderRadius: 8,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 4,
//         elevation: 3,
//         position: 'relative',
//     },
//     closeButton: {
//         position: 'absolute',
//         top: 8,
//         right: 8,
//         zIndex: 1,
//     },
//     closeIcon: {
//         width: 14,
//         height: 14,
//         tintColor: 'gray',
//     },
//     patientDetailText: {
//         fontSize: 14,
//         color: '#000',
//         marginBottom: 8,
//     },
//     innerContainer: {
//         padding: 10,
//     },
//     ChooseTestView: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingVertical: 10,
//     },
//     chooseTestText: {
//         flex: 1,
//         fontSize: 18,
//         alignSelf: 'center',
//         color: 'black',
//     },
//     cartValueView: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     cartValueLabel: {
//         color: '#B1BE95',
//         marginRight: 10,
//         fontSize: 12,
//     },
//     cartValue: {
//         color: '#3B61A6',
//         fontSize: 16,
//     },
//     searchCartView: {
//         marginTop: 10,
//         backgroundColor: 'white',
//         flexDirection: 'row',
//         borderRadius: 10,
//         padding: 15,
//         alignItems: 'center',
//     },
//     // searchIcon: {
//     //     width: 20,
//     //     height: 20,
//     //     alignSelf: 'center',
//     // },
//     CartIcon: {
//         width: 20,
//         height: 20,
//         alignSelf: 'center',
//         marginLeft: 20,
//         marginRight: 25,
//     },
//     searchLabel: {
//         fontSize: 14,
//         alignSelf: 'center',
//         paddingHorizontal: 20,
//         color: 'black',
//     },
//     searchCartRightView: {
//         position: 'absolute',
//         right: 0,
//         flexDirection: 'row',
//         alignSelf: 'center',
//         marginEnd: 10,
//     },
//     // notificationBadge: {
//     //     right: 15,
//     //     minWidth: 20,
//     //     height: 20,
//     //     borderRadius: 10,
//     //     backgroundColor: 'red',
//     //     justifyContent: 'center',
//     //     alignItems: 'center',
//     // },
//     // notificationBadgeText: {
//     //     color: 'white',
//     //     fontSize: 12,
//     //     fontWeight: 'bold',
//     // },
//     uploadContainer: {
//         marginTop: 20,
//         paddingHorizontal: 10,
//         paddingVertical: 10,
//     },
//     uploadButtonView: {
//         padding: 12,
//         borderRadius: 25,
//         backgroundColor: '#E8ECF2',
//         flexDirection: 'row',
//         alignSelf: 'flex-end',
//         justifyContent: 'center',
//     },
//     uploadImage: {
//         width: 20,
//         height: 20,
//         alignSelf: 'center',
//     },
//     uploadText: {
//         color: '#2C579F',
//         marginLeft: 10,
//         alignSelf: 'center',
//         fontSize: 14,
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//     modalBackground: {
//         width: '100%',
//         borderTopLeftRadius: 30,
//         borderTopRightRadius: 30,
//         backgroundColor: 'white',
//     },
//     modalContent: {
//         paddingVertical: 20,
//         paddingHorizontal: 15,
//         borderTopLeftRadius: 30,
//         borderTopRightRadius: 30,
//         backgroundColor: 'white',
//     },
//     emptyCartContainer: {
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     emptyCartText: { fontSize: 16, color: 'gray' },
//     testItemContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: 10,
//     },
//     testName: {
//         width: '40%',
//         color: '#686868',
//     },
//     testPrice: { fontWeight: 'bold', width: '20%' },
//     bottomText: {
//         fontSize: 18,
//         color: Constants.COLOR.BLACK_COLOR,
//         alignSelf: 'center',
//     },
//     SubmitButtonView: {
//         borderRadius: 20,
//         width: '80%',
//         backgroundColor: Constants.COLOR.THEME_COLOR,
//         marginTop: 16,
//         alignSelf: 'center',
//     },
//     ButtonText: {
//         color: Constants.COLOR.WHITE_COLOR,
//         padding: 12,
//         alignSelf: 'center',
//     },
//     addToCartContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderWidth: 5,
//         borderColor: '#bcc0c7',
//         marginVertical: 10,
//         padding: 4,
//         borderRadius: 5,
//     },
//     navigationContainer: {
//         flexDirection: 'row',
//         position: 'absolute',
//         bottom: 0,
//         width: '100%',
//         backgroundColor: '#FBFBFB',
//         justifyContent: 'space-between',
//     },
//     uploadedImageContainer: {
//         alignItems: 'flex-end',
//         marginVertical: 10,
//     },
//     uploadedImage: {
//         width: '15%',
//         height: '30%',
//         borderRadius: 10,
//     },
//     searchTestView: {
//         flexDirection: 'row',
//         justifyContent: "space-between",
//         paddingHorizontal: 10,
//         paddingVertical: 10
//     },
//     headerText: {
//         flex: 1,
//         alignSelf: 'center',
//         fontSize: Constants.FONT_SIZE.L,
//         color: 'black'
//     },
//     closeImageStyle: {
//         width: deviceHeight / 35,
//         height: deviceHeight / 35,
//         right: 10
//     },
//     inputContainer:
//     {
//         flexDirection: 'row',
//         marginVertical: 16,
//         backgroundColor: "white",
//     },
//     searchIcon: {
//         marginVertical: 16,
//         width: deviceHeight / 50,
//         height: deviceHeight / 50,
//         alignSelf: 'center',
//         marginLeft: 8,
//     },
//     CartIconTop: {
//         marginVertical: 16,
//         marginHorizontal: 10,
//         width: deviceHeight / 50,
//         height: deviceHeight / 50,
//         alignSelf: 'center',
//     },
//     CrossIconTop: {
//         marginVertical: 16,
//         marginHorizontal: 10,
//         width: deviceHeight / 50,
//         height: deviceHeight / 50,
//         alignSelf: 'center',
//     },
//     inputText: {
//         marginHorizontal: 4,
//         flex: 1,
//         alignSelf: 'center',
//         fontSize: Constants.FONT_SIZE.M,
//         padding: 6,
//         color: 'black'
//     },
//     // CartIcon: {
//     //     marginLeft: 10,
//     //     marginRight: 15,
//     //     width: deviceHeight / 35,
//     //     height: deviceHeight / 35,
//     //     alignSelf: 'center',
//     // },
//     CrossIcon: {
//         marginRight: 15,
//         width: deviceHeight / 60,
//         height: deviceHeight / 60,
//         alignSelf: 'center',
//     },
//     notificationBadge: {
//         right: 15,
//         minWidth: 20,
//         height: 20,
//         borderRadius: 10,
//         backgroundColor: 'red',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     notificationBadgeText: {
//         color: 'white',
//         fontSize: Constants.FONT_SIZE.S,
//     },
//     addToCartButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     spinnerContainer: { position: 'absolute', top: '30%', left: '50%', transform: [{ translateX: -25 }, { translateY: -25 }] },
//     flatListContainer: {
//         paddingHorizontal: 10,
//     },
// });
