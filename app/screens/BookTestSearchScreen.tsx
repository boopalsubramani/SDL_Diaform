// import React, { useEffect, useState, useCallback } from 'react';
// import { View, Text, TouchableOpacity, FlatList, TextInput, Image, Modal, Alert, StyleSheet, Dimensions, TouchableWithoutFeedback, I18nManager } from 'react-native';
// import Constants from '../util/Constants';
// import { StackNavigationProp } from "@react-navigation/stack";
// import { RootStackParamList } from '../routes/Types';
// import { useBookTestSearchMutation } from '../redux/service/BookTestSearchService';
// import { useCart } from '../common/CartContext';
// import { useNavigation } from '@react-navigation/native';
// import SpinnerIndicator from '../common/SpinnerIndicator';
// import { useDuplicateServiceBookingMutation } from '../redux/service/DuplicateServiceBookingService';
// import { useDispatch, useSelector } from 'react-redux';
// import { updateSelectedTest } from '../redux/slice/BookTestSearchSlice';
// import { useAppSettings } from '../common/AppSettingContext';
// import { RootState } from '../redux/Store';

// const deviceHeight = Dimensions.get('window').height;
// const deviceWidth = Dimensions.get('window').width;
// type NavigationProp = StackNavigationProp<RootStackParamList, "BookTestSearchScreen">;

// interface Language {
//     Alignment: 'ltr' | 'rtl';
// }

// const BookTestSearchScreen = ({ route }: any) => {
//     const dispatch = useDispatch();
//     const navigation = useNavigation<NavigationProp>();
//     const { selectedPatientDetails, serviceDetails, selectedTests = [] } = route.params;
//     const [testData, setTestData] = useState<any[]>([]);
//     const [searchText, setSearchText] = useState('');
//     const { labels } = useAppSettings();
//     const { cartItems, setCartItems, totalCartValue, setTotalCartValue, isModalVisible, setModalVisible } = useCart();
//     const [displayCartState, setDisplayCartState] = useState<{ [key: string]: boolean }>({});
//     const [cartItemDetails, setCartItemDetails] = useState<Array<any>>(selectedTests || []);
//     const [searchTestAPIReq, { data: searchTestAPIRes, isLoading }] = useBookTestSearchMutation();
//     const selectedLanguage = useSelector((state: RootState) => state.appSettings.selectedLanguage) as Language | null;


//     useEffect(() => {
//         I18nManager.forceRTL(selectedLanguage?.Alignment === 'rtl');
//     }, [selectedLanguage]);

//     const getLabel = (key: string) => {
//         return labels[key]?.defaultMessage || '';
//     };

//     const fetchTests = useCallback(() => {
//         if (searchText.trim().length > 2) {
//             const requestBody = {
//                 App_Type: "R",
//                 Firm_No: '01',
//                 Service_Type: "T",
//                 Search_Text: searchText,
//                 Ref_Type: selectedPatientDetails?.Ref_Type || 'C',
//                 Ref_Code: selectedPatientDetails?.Ref_Code || '01000104',
//                 Coverage_Percent: "0",
//                 Offer_Amount: "1",
//                 Discount_Percentage: selectedPatientDetails?.Discount_Percentage || '0',
//             };
//             searchTestAPIReq(requestBody);
//         } else {
//             setTestData([]);
//         }
//     }, [searchText, selectedPatientDetails, searchTestAPIReq, setTestData]);

//     useEffect(() => {
//         fetchTests();
//     }, [fetchTests]);

//     useEffect(() => {
//         if (searchTestAPIRes?.SuccessFlag === "true" && searchTestAPIRes?.Message) {
//             const newTests = searchTestAPIRes.Message;
//             if (newTests.length > 0) {
//                 setTestData(newTests);
//             } else {
//             }
//         } else if (searchTestAPIRes?.SuccessFlag === "false") {
//             Alert.alert('Error', searchTestAPIRes?.ErrorMessage || 'Failed to fetch tests.');
//         }
//     }, [searchTestAPIRes, setTestData]);


//     useEffect(() => {
//         const unsubscribe = navigation.addListener('focus', () => {
//             setCartItems([...cartItems]);
//             setCartItemDetails([...cartItemDetails]);
//             setTotalCartValue(cartItemDetails.reduce((total, item) => total + (item?.Amount || 0), 0));

//             setDisplayCartState(
//                 cartItems.reduce((acc, itemName) => {
//                     acc[itemName] = true;
//                     return acc;
//                 }, {})
//             );
//         });
//         return unsubscribe;
//     }, [navigation, cartItems, cartItemDetails]);


//     useEffect(() => {
//         if (serviceDetails) {
//             const updatedTests = [...selectedTests, ...serviceDetails];
//             dispatch(updateSelectedTest(updatedTests));
//         }
//     }, [serviceDetails, selectedTests, dispatch]);

//     const handleCross = () => navigation.goBack();

//     // const handleToggleCart = (itemName: string) => {
//     //     const item = testData.find(test => test.Service_Name === itemName);
//     //     if (!item) return;

//     //     setCartItems(prevCartItems => {
//     //         const isItemInCart = prevCartItems.includes(itemName);
//     //         let updatedCart = [];

//     //         if (isItemInCart) {
//     //             updatedCart = prevCartItems.filter(name => name !== itemName);
//     //             setCartItemDetails(prevDetails => prevDetails.filter(detail => detail.Service_Code !== item.Service_Code));
//     //         } else {
//     //             updatedCart = [...prevCartItems, itemName];
//     //             setCartItemDetails(prevDetails => {
//     //                 if (prevDetails.some(cartItem => cartItem.Service_Code === item.Service_Code)) {
//     //                     Alert.alert("Alert", `${item.Service_Name} is already in the cart.`);
//     //                     return prevDetails;
//     //                 }
//     //                 return [...prevDetails, item];
//     //             });
//     //         }

//     //         return updatedCart;
//     //     });

//     //     setDisplayCartState(prev => ({ ...prev, [itemName]: !prev[itemName] }));
//     //     calculateTotalCartValue();
//     // };

//       const handleToggleCart = (item: any) => {
//         setCartItems((prevCart) => {
//             const isAlreadyInCart = prevCart.some(cartItem => cartItem.Service_Code === item.Service_Code);
//             if (isAlreadyInCart) {
//                 return prevCart.filter(cartItem => cartItem.Service_Code !== item.Service_Code);
//             } else {
//                 return [...prevCart, item];
//             }
//         });
//     };


//     const handleProceedClick = () => {
//         if (cartItems.length > 0) {
//             const selectedTests = cartItemDetails.map(item => ({
//                 Service_Name: item.Service_Name || "Unknown",
//                 Amount: item.Amount ?? 0,
//                 Service_Code: item.Service_Code || "",
//                 Discount_Amount: item.Discount_Amount ?? 0,
//                 T_Bill_Amount: item.T_Bill_Amount ?? 0,
//                 T_Patient_Due: item.T_Patient_Due ?? 0,
//             }));

//             dispatch(updateSelectedTest(cartItemDetails));

//             navigation.navigate('ChooseTest', {
//                 selectedTests,
//                 selectedPatientDetails,
//                 totalCartValue: cartItemDetails.reduce((total, item) => total + (item?.Amount || 0), 0), // Ensure correct value
//                 testData,
//                 shouldNavigateToCalender: true,
//             });
//         } else {
//             Alert.alert('Empty Cart', 'Please add items to the cart before proceeding.');
//         }
//     };

//     const calculateTotalCartValue = useCallback(() => {
//         const total = cartItemDetails.reduce((total, item) => total + (item?.Amount || 0), 0);
//         setTotalCartValue(total);
//     }, [cartItemDetails]);

//     useEffect(() => {
//         calculateTotalCartValue();
//     }, [cartItemDetails, testData, cartItems]);

//     const handleCartIconClick = () => setModalVisible(true);

//     const renderItem = ({ item }: any) => {
//         const itemDetails = cartItemDetails.find(detail => detail.Service_Name === item.Service_Name) || item;
//         const isItemInCart = cartItems.includes(item.Service_Name);

//         return (
//             <View style={styles.testItemContainer}>
//                 <Text style={styles.testName}>{itemDetails.Service_Name}</Text>
//                 <Text style={styles.testPrice}>{itemDetails.Amount ? `${itemDetails.Amount} INR` : 'N/A'}</Text>

//                 <TouchableOpacity
//                     style={styles.addToCartButton}
//                     onPress={() => handleToggleCart(item.Service_Name)}
//                 >
//                     <View style={styles.addToCartContainer}>
//                         <Image source={require('../images/addCart.png')} style={styles.CartIcon} />
//                         <Text style={{ fontSize: Constants.FONT_SIZE.SM, fontFamily: Constants.FONT_FAMILY.fontFamilyMedium, color: Constants.COLOR.WHITE_COLOR }}>
//                             {isItemInCart ? getLabel('sealiscell_1') : getLabel('sealiscell_2')}
//                         </Text>
//                     </View>
//                 </TouchableOpacity>
//             </View>
//         );
//     };

//     return (
//         <View style={styles.MainContainer}>
//             <View style={styles.searchTestView}>
//                 <Text style={styles.headerText}>{getLabel('labtsrc_9')}</Text>
//                 <TouchableOpacity onPress={handleCross} style={styles.closeImageStyle}>
//                     <Image source={require('../images/black_cross.png')} />
//                 </TouchableOpacity>
//             </View>

//             <View style={styles.inputContainer}>
//                 <Image source={require('../images/search.png')} style={styles.searchIcon} />
//                 <TextInput
//                     style={styles.inputText}
//                     placeholder={getLabel('labtsrc_9')}
//                     placeholderTextColor="black"
//                     value={searchText}
//                     onChangeText={setSearchText}
//                 />
//                 {searchText.length > 0 && (
//                     <TouchableOpacity onPress={() => setSearchText('')}>
//                         <Image source={require('../images/black_cross.png')} style={styles.CrossIconTop} />
//                     </TouchableOpacity>
//                 )}
//                 <TouchableOpacity onPress={handleCartIconClick}>
//                     <Image source={require('../images/addCart.png')} style={styles.CartIconTop} />
//                 </TouchableOpacity>
//                 {cartItems.length > 0 && (
//                     <View style={styles.notificationBadge}>
//                         <Text style={styles.notificationBadgeText}>{cartItems.length}</Text>
//                     </View>
//                 )}
//             </View>

//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={isModalVisible}
//                 onRequestClose={() => setModalVisible(false)}
//             >
//                 <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
//                     <View style={styles.modalContainer}>
//                         <TouchableWithoutFeedback>
//                             <View style={styles.modalBackground}>
//                                 <View style={styles.modalContent}>
//                                     {cartItemDetails.length === 0 ? (
//                                         <View style={styles.emptyCartContainer}>
//                                             <Text style={styles.emptyCartText}>Cart is Empty</Text>
//                                         </View>
//                                     ) : (
//                                         cartItemDetails.map((item, index) => {
//                                             return (
//                                                 <View style={styles.testItemContainer} key={index}>
//                                                     <Text style={styles.testName}>{item?.Service_Name}</Text>
//                                                     <Text style={styles.testPrice}>{item?.Amount} INR</Text>
//                                                     <TouchableOpacity onPress={() => handleToggleCart(item.Service_Name)}>
//                                                         <View style={styles.addToCartContainer}>
//                                                             <Image source={require('../images/addCart.png')} style={styles.CartIcon} />
//                                                             <Text style={{ fontSize: Constants.FONT_SIZE.SM, fontFamily: Constants.FONT_FAMILY.fontFamilyMedium, color: Constants.COLOR.WHITE_COLOR }}>{getLabel('sealiscell_1')}</Text>
//                                                         </View>
//                                                     </TouchableOpacity>
//                                                 </View>
//                                             );
//                                         })
//                                     )}
//                                     <Text style={styles.bottomText}>Total Cart Value INR {totalCartValue}</Text>
//                                     {cartItemDetails.length > 0 && (
//                                         <TouchableOpacity onPress={handleProceedClick}>
//                                             <View style={styles.SubmitButtonView}>
//                                                 <Text style={styles.ButtonText}>{getLabel('labtsrc_6')}</Text>
//                                             </View>
//                                         </TouchableOpacity>
//                                     )}
//                                     <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
//                                         <Text style={{ color: '#fd1a1b', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular }}>{getLabel('labtsrc_7')}</Text>
//                                     </View>
//                                 </View>
//                             </View>
//                         </TouchableWithoutFeedback>
//                     </View>
//                 </TouchableWithoutFeedback>
//             </Modal>

//             {isLoading ? (
//                 <View style={styles.spinnerContainer}>
//                     <SpinnerIndicator />
//                 </View>
//             ) : (
//                 <>
//                     {testData.length === 0 ? (
//                         <Text style={{ textAlign: 'center', marginTop: 20, fontSize: Constants.FONT_SIZE.M, fontFamily: Constants.FONT_FAMILY.fontFamilyRegular }}>
//                             No tests found. Please try again.
//                         </Text>
//                     ) : (
//                         <FlatList
//                             data={testData}
//                             keyExtractor={item => `${item.RowNumber || item.Service_Name}`}
//                             renderItem={renderItem}
//                             contentContainerStyle={styles.flatListContainer}
//                         />
//                     )}
//                 </>
//             )}


//             {searchText.trim().length > 0 && (
//                 <View>
//                     <Text style={styles.bottomText}>Total Cart Value INR {totalCartValue}</Text>
//                     <TouchableOpacity onPress={handleProceedClick}>
//                         <View style={styles.SubmitButtonView}>
//                             <Text style={styles.ButtonText}>{getLabel('labtsrc_6')}</Text>
//                         </View>
//                     </TouchableOpacity>
//                     <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
//                         <Text style={{ color: '#fd1a1b', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular }}>{getLabel('labtsrc_7')}</Text>
//                     </View>
//                 </View>
//             )}
//         </View>
//     );
// };

// export default BookTestSearchScreen;


// const styles = StyleSheet.create({
//     MainContainer: { flex: 1, backgroundColor: Constants.COLOR.WHITE_COLOR },
//     searchTestView: { flexDirection: 'row', justifyContent: "space-between", paddingHorizontal: 10, paddingVertical: 10 },
//     headerText: { flex: 1, alignSelf: 'center', fontSize: Constants.FONT_SIZE.M, fontFamily: Constants.FONT_FAMILY.fontFamilyMedium },
//     closeImageStyle: { width: deviceHeight / 45, height: deviceHeight / 45, right: 10 },
//     inputContainer: { flexDirection: 'row', marginVertical: 16, borderWidth: 0.5, borderColor: Constants.COLOR.THEME_COLOR },
//     searchIcon: { marginVertical: 16, width: deviceHeight / 50, height: deviceHeight / 50, alignSelf: 'center', marginLeft: 8 },
//     CartIconTop: { marginVertical: 16, marginHorizontal: 25, width: deviceHeight / 50, height: deviceHeight / 50, alignSelf: 'center' },
//     CrossIconTop: { marginVertical: 16, marginHorizontal: 10, width: deviceHeight / 50, height: deviceHeight / 50, alignSelf: 'center' },
//     inputText: { marginHorizontal: 4, flex: 1, alignSelf: 'center', fontSize: Constants.FONT_SIZE.SM, fontFamily: Constants.FONT_FAMILY.fontFamilyRegular, padding: 6, color: 'black' },
//     CartIcon: { marginLeft: 10, marginRight: 15, width: deviceHeight / 35, height: deviceHeight / 35, alignSelf: 'center', tintColor: Constants.COLOR.WHITE_COLOR },
//     notificationBadge: {
//         position: 'absolute',
//         right: 5,
//         top: 5,
//         width: 20,
//         height: 20,
//         borderRadius: 10,
//         backgroundColor: Constants.COLOR.THEME_COLOR,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     notificationBadgeText: {
//         color: Constants.COLOR.WHITE_COLOR,
//         fontSize: Constants.FONT_SIZE.SM,
//         fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold
//     },
//     addToCartButton: { flexDirection: 'row', alignItems: 'center' },
//     spinnerContainer: { flex: 1, justifyContent: 'center' },
//     modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
//     modalBackground: { width: '100%', borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: 'white' },
//     modalContent: { paddingVertical: 20, paddingHorizontal: 15, borderTopRightRadius: 30 },
//     emptyCartContainer: { alignItems: 'center', justifyContent: 'center' },
//     emptyCartText: { fontSize: Constants.FONT_SIZE.M, fontFamily: Constants.FONT_FAMILY.fontFamilyRegular },
//     testItemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 },
//     testName: { width: '40%', color: '#3C3636', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular },
//     testPrice: { width: '20%', fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold, fontSize: Constants.FONT_SIZE.M },
//     bottomText: { fontSize: Constants.FONT_SIZE.M, alignSelf: 'center', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular },
//     SubmitButtonView: { borderRadius: 25, width: deviceWidth / 1.2, backgroundColor: Constants.COLOR.THEME_COLOR, marginTop: 16, alignSelf: 'center' },
//     ButtonText: { color: Constants.COLOR.WHITE_COLOR, fontFamily: Constants.FONT_FAMILY.fontFamilyMedium, fontSize: Constants.FONT_SIZE.M, padding: 12, alignSelf: 'center' },
//     addToCartContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Constants.COLOR.THEME_COLOR, marginVertical: 10, padding: 6, borderRadius: 5, },
//     flatListContainer: { paddingHorizontal: 10 },
// });












import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, Alert, Dimensions, I18nManager } from 'react-native';
import { useBookTestSearchMutation } from '../redux/service/BookTestSearchService';
import SpinnerIndicator from '../common/SpinnerIndicator';
import Constants from '../util/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { useAppSettings } from '../common/AppSettingContext';
import { Modal } from 'react-native';
import { addToCart, removeFromCart, updateSelectedTest } from '../redux/slice/BookTestSearchSlice';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../routes/Types';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
type NavigationProp = StackNavigationProp<RootStackParamList, "BookTestSearchScreen">;

interface Language {
    Alignment: 'ltr' | 'rtl';
}

// const BookTestSearchScreen = ({ route }: any) => {
//     const dispatch = useDispatch();
//     const navigation = useNavigation<NavigationProp>();
//     const { labels } = useAppSettings();
//     const [searchText, setSearchText] = useState('');
//     const [testData, setTestData] = useState<any[]>([]);
//     const [isModalVisible, setModalVisible] = useState(false);
//     const { selectedPatientDetails, selectedTests = [], selectedDate,
//         selectedTime,
//         bookingResponse,
//         selectedTestDetails,
//         fromBookingScreen,
//         serviceDetails, } = route.params;
//     const [cartItemDetails] = useState<Array<any>>(selectedTests || []);
//     const [searchTestAPIReq, { data: searchTestAPIRes, isLoading }] = useBookTestSearchMutation();
//     const selectedLanguage = useSelector((state: RootState) => state.appSettings.selectedLanguage) as Language | null;
//     const cartItems = useSelector((state: RootState) => state.bookTestSearch.updatedCartData);
//     const totalCartValue = useSelector((state: RootState) => state.bookTestSearch.totalCartValue);

//     useEffect(() => {
//         I18nManager.forceRTL(selectedLanguage?.Alignment === 'rtl');
//     }, [selectedLanguage]);

//     const getLabel = (key: string) => {
//         return labels[key]?.defaultMessage || '';
//     };

//     const fetchTests = useCallback(() => {
//         if (searchText.trim().length > 2) {
//             const requestBody = {
//                 App_Type: "R",
//                 Firm_No: '01',
//                 Service_Type: "T",
//                 Search_Text: searchText,
//                 Ref_Type: selectedPatientDetails?.Ref_Type || 'C',
//                 Ref_Code: selectedPatientDetails?.Ref_Code || '01000104',
//                 Coverage_Percent: "0",
//                 Offer_Amount: "1",
//                 Discount_Percentage: selectedPatientDetails?.Discount_Percentage || '0',
//             };
//             searchTestAPIReq(requestBody);
//         } else {
//             setTestData([]);
//         }
//     }, [searchText, selectedPatientDetails, searchTestAPIReq]);

//     useEffect(() => {
//         fetchTests();
//     }, [fetchTests]);

//     const handleCross = () => navigation.goBack();

//     useEffect(() => {
//         if (searchTestAPIRes?.SuccessFlag === "true" && searchTestAPIRes?.Message) {
//             setTestData(searchTestAPIRes.Message);
//         } else if (searchTestAPIRes?.SuccessFlag === "false") {
//             Alert.alert('Error', searchTestAPIRes?.ErrorMessage || 'Failed to fetch tests.');
//         }
//     }, [searchTestAPIRes]);


//     const handleToggleCart = (item: any) => {
//         const isAlreadyInCart = cartItems.some(cartItem => cartItem.Service_Code === item.Service_Code);
//         if (isAlreadyInCart) {
//             Alert.alert('Info', `${item.Service_Name} is already in the cart.`);
//             // dispatch(removeFromCart(item));
//         } else {
//             dispatch(addToCart(item));
//         }
//     };

//     useEffect(() => {
//         dispatch(updateSelectedTest(cartItems));
//     }, [cartItems, dispatch]);

//     useEffect(() => {
//         if (route.params?.selectedTests) {
//             dispatch(updateSelectedTest(route.params.selectedTests));
//         }
//     }, [route.params?.selectedTests, dispatch]);


//     const handleProceed = () => {
//         if (cartItems.length > 0) {
//             const selectedTests = cartItems.map(item => ({
//                 Service_Name: item.Service_Name || "Unknown",
//                 Amount: item.Amount ?? 0,
//                 Service_Code: item.Service_Code || "",
//                 Discount_Amount: item.Discount_Amount ?? 0,
//                 T_Bill_Amount: item.T_Bill_Amount ?? 0,
//                 T_Patient_Due: item.T_Patient_Due ?? 0,
//             }));
//             dispatch(updateSelectedTest(cartItems));
//             navigation.navigate('ChooseTest', {
//                 selectedTests,
//                 selectedPatientDetails,
//                 totalCartValue: cartItems.reduce((total, item) => total + (item?.Amount || 0), 0),
//                 testData,
//                 shouldNavigateToCalender: true,
//             });
//         } else {
//             Alert.alert('Empty Cart', 'Please add items to the cart before proceeding.');
//         }
//     };

//     const renderItem = ({ item }: any) => {
//         const itemDetails = cartItemDetails.find(detail => detail.Service_Name === item.Service_Name) || item;
//         const isItemInCart = cartItems.some(cartItem => cartItem.Service_Code === item.Service_Code);

//         return (
//             <View style={styles.testItemContainer}>
//                 <Text style={styles.testName}>{itemDetails.Service_Name}</Text>
//                 <Text style={styles.testPrice}>{itemDetails.Amount ? `${itemDetails.Amount} INR` : 'N/A'}</Text>

//                 <TouchableOpacity
//                     style={[styles.addToCartButton, isItemInCart ? styles.removeButton : styles.addButton]}
//                     onPress={() => handleToggleCart(item)}>
//                     <View style={styles.addToCartContainer}>
//                         <Image source={isItemInCart ? require('../images/removeCart.png') : require('../images/addCart.png')} style={styles.CartIcon} />
//                         <Text style={styles.cartButtonText}>
//                             {isItemInCart ? getLabel('remove_from_cart') : getLabel('add_to_cart')}
//                         </Text>
//                     </View>
//                 </TouchableOpacity>
//             </View>
//         );
//     };

//     return (
//         <View style={styles.MainContainer}>
//             <View style={styles.searchTestView}>
//                 <Text style={styles.headerText}>{getLabel('labtsrc_9')}</Text>
//                 <TouchableOpacity onPress={handleCross} style={styles.closeImageStyle}>
//                     <Image source={require('../images/black_cross.png')} />
//                 </TouchableOpacity>
//             </View>
//             <View style={styles.inputContainer}>
//                 <Image source={require('../images/search.png')} style={styles.searchIcon} />
//                 <TextInput
//                     // style={styles.inputText}
//                     style={[styles.inputText, {
//                         textAlign: (selectedLanguage?.Alignment ?? 'ltr') === 'rtl' ? 'right' : 'left'

//                     }]}
//                     placeholder={getLabel('labtsrc_9')}
//                     placeholderTextColor="black"
//                     value={searchText}
//                     onChangeText={setSearchText}
//                 />
//                 {searchText.length > 0 && (
//                     <TouchableOpacity onPress={() => setSearchText('')}>
//                         <Image source={require('../images/black_cross.png')} style={styles.CrossIconTop} />
//                     </TouchableOpacity>
//                 )}
//                 <TouchableOpacity onPress={() => setModalVisible(true)}>
//                     <Image source={require('../images/addCart.png')} style={styles.CartIconTop} />
//                 </TouchableOpacity>
//                 {cartItems.length > 0 && (
//                     <View style={styles.notificationBadge}>
//                         <Text style={styles.notificationBadgeText}>{cartItems.length}</Text>
//                     </View>
//                 )}
//             </View>

//             {isLoading ? (
//                 <SpinnerIndicator />
//             ) : (
//                 <FlatList
//                     data={testData}
//                     keyExtractor={item => item.Service_Code}
//                     renderItem={renderItem}
//                     contentContainerStyle={styles.flatListContainer}
//                     ListFooterComponent={
//                         cartItems.length > 0 ? (
//                             <View>
//                                 <Text style={styles.bottomText}>Total Cart Value INR {totalCartValue}</Text>
//                                 <TouchableOpacity style={styles.SubmitButtonView} onPress={handleProceed}>
//                                     <Text style={styles.ButtonText}>{getLabel('labtsrc_6')}</Text>
//                                 </TouchableOpacity>
//                                 <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
//                                     <Text style={{ color: '#fd1a1b', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular }}>{getLabel('labtsrc_7')}</Text>
//                                 </View>
//                             </View>
//                         ) : null
//                     }
//                 />
//             )}

//             <Modal
//                 visible={isModalVisible}
//                 transparent={true}
//                 animationType="slide"
//                 onRequestClose={() => setModalVisible(false)}
//             >
//                 <View style={styles.modalContainer}>
//                     <View style={styles.modalContent}>
//                         {cartItems.length > 0 ? (
//                             <FlatList
//                                 data={cartItems}
//                                 keyExtractor={(item) => item.Service_Code}
//                                 renderItem={({ item }) => {
//                                     const isItemInCart = cartItems.some(cartItem => cartItem.Service_Code === item.Service_Code);

//                                     return (
//                                         <View style={styles.cartItem}>
//                                             <Text style={styles.testName}>{item.Service_Name}</Text>
//                                             <Text style={styles.testPrice}>{item.Amount} INR</Text>

//                                             <TouchableOpacity
//                                                 style={[styles.addToCartButton, isItemInCart ? styles.removeButton : styles.addButton]}
//                                                 // onPress={() => handleToggleCart(item)}
//                                                 onPress={() => dispatch(removeFromCart(item))}
//                                             >
//                                                 <View style={styles.addToCartContainer}>
//                                                     <Image source={isItemInCart ? require('../images/removeCart.png') : require('../images/addCart.png')} style={styles.CartIcon} />
//                                                     <Text style={styles.cartButtonText}>
//                                                         {isItemInCart ? getLabel('remove_from_cart') : getLabel('add_to_cart')}
//                                                     </Text>
//                                                 </View>
//                                             </TouchableOpacity>
//                                         </View>
//                                     );
//                                 }}
//                                 ListFooterComponent={
//                                     <View>
//                                         <Text style={styles.bottomText}>Total Cart Value INR {totalCartValue}</Text>
//                                         <TouchableOpacity style={styles.SubmitButtonView} onPress={handleProceed}>
//                                             <Text style={styles.ButtonText}>Proceed</Text>
//                                         </TouchableOpacity>
//                                         <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
//                                             <Text style={{ color: '#fd1a1b', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular }}>{getLabel('labtsrc_7')}</Text>
//                                         </View>
//                                     </View>
//                                 }
//                             />
//                         ) : (
//                             <View style={styles.emptyCartContainer}>
//                                 <Text style={styles.emptyCartText}>Cart is Empty</Text>
//                             </View>
//                         )}

//                         <TouchableOpacity onPress={() => setModalVisible(false)}>
//                             <Image source={require('../images/black_cross.png')} style={styles.CrossIconTop} />
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// export default BookTestSearchScreen;




const BookTestSearchScreen = ({ route }: any) => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp>();
    const { labels } = useAppSettings();
    const [searchText, setSearchText] = useState('');
    const [testData, setTestData] = useState<any[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);

    // Accessing parameters from route.params
    const {
        selectedPatientDetails,
        selectedTests = [],
        bookingDetails, 
    } = route.params;

    // Initialize cartItemDetails with selectedTests from route.params
    const [cartItemDetails, setCartItemDetails] = useState<Array<any>>(selectedTests);

    const [searchTestAPIReq, { data: searchTestAPIRes, isLoading }] = useBookTestSearchMutation();
    const selectedLanguage = useSelector((state: RootState) => state.appSettings.selectedLanguage) as Language | null;
    const cartItems = useSelector((state: RootState) => state.bookTestSearch.updatedCartData);
    const totalCartValue = useSelector((state: RootState) => state.bookTestSearch.totalCartValue);

    useEffect(() => {
        I18nManager.forceRTL(selectedLanguage?.Alignment === 'rtl');
    }, [selectedLanguage]);

    const getLabel = (key: string) => {
        return labels[key]?.defaultMessage || '';
    };

    const fetchTests = useCallback(() => {
        if (searchText.trim().length > 2) {
            const requestBody = {
                App_Type: "R",
                Firm_No: '01',
                Service_Type: "T",
                Search_Text: searchText,
                Ref_Type: selectedPatientDetails?.Ref_Type || 'C',
                Ref_Code: selectedPatientDetails?.Ref_Code || '01000104',
                Coverage_Percent: "0",
                Offer_Amount: "1",
                Discount_Percentage: selectedPatientDetails?.Discount_Percentage || '0',
            };
            searchTestAPIReq(requestBody);
        } else {
            setTestData([]);
        }
    }, [searchText, selectedPatientDetails, searchTestAPIReq]);

    useEffect(() => {
        fetchTests();
    }, [fetchTests]);

    const handleCross = () => navigation.goBack();

    useEffect(() => {
        if (searchTestAPIRes?.SuccessFlag === "true" && searchTestAPIRes?.Message) {
            setTestData(searchTestAPIRes.Message);
        } else if (searchTestAPIRes?.SuccessFlag === "false") {
            Alert.alert('Error', searchTestAPIRes?.ErrorMessage || 'Failed to fetch tests.');
        }
    }, [searchTestAPIRes]);

    const handleToggleCart = (item: any) => {
        const isAlreadyInCart = cartItems.some(cartItem => cartItem.Service_Code === item.Service_Code);
        if (isAlreadyInCart) {
            Alert.alert('Info', `${item.Service_Name} is already in the cart.`);
        } else {
            dispatch(addToCart(item));
        }
    };

    useEffect(() => {
        // Update the cart with the initial selectedTests
        dispatch(updateSelectedTest(cartItemDetails));
    }, [cartItemDetails, dispatch]);

    useEffect(() => {
        if (route.params?.selectedTests) {
            dispatch(updateSelectedTest(route.params.selectedTests));
        }
    }, [route.params?.selectedTests, dispatch]);

    const handleProceed = () => {
        if (cartItems.length > 0) {
            const selectedTests = cartItems.map(item => ({
                Service_Name: item.Service_Name || "Unknown",
                Amount: item.Amount ?? 0,
                Service_Code: item.Service_Code || "",
                Discount_Amount: item.Discount_Amount ?? 0,
                T_Bill_Amount: item.T_Bill_Amount ?? 0,
                T_Patient_Due: item.T_Patient_Due ?? 0,
            }));
            dispatch(updateSelectedTest(cartItems));
            navigation.navigate('ChooseTest', {
                selectedTests,
                selectedPatientDetails,
                totalCartValue: cartItems.reduce((total, item) => total + (item?.Amount || 0), 0),
                testData,
                shouldNavigateToCalender: true,
            });
        } else {
            Alert.alert('Empty Cart', 'Please add items to the cart before proceeding.');
        }
    };

    const renderItem = ({ item }: any) => {
        const itemDetails = cartItemDetails.find(detail => detail.Service_Name === item.Service_Name) || item;
        const isItemInCart = cartItems.some(cartItem => cartItem.Service_Code === item.Service_Code);

        return (
            <View style={styles.testItemContainer}>
                <Text style={styles.testName}>{itemDetails.Service_Name}</Text>
                <Text style={styles.testPrice}>{itemDetails.Amount ? `${itemDetails.Amount} INR` : 'N/A'}</Text>

                <TouchableOpacity
                    style={[styles.addToCartButton, isItemInCart ? styles.removeButton : styles.addButton]}
                    onPress={() => handleToggleCart(item)}>
                    <View style={styles.addToCartContainer}>
                        <Image source={isItemInCart ? require('../images/removeCart.png') : require('../images/addCart.png')} style={styles.CartIcon} />
                        <Text style={styles.cartButtonText}>
                            {isItemInCart ? getLabel('remove_from_cart') : getLabel('add_to_cart')}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.MainContainer}>
            <View style={styles.searchTestView}>
                <Text style={styles.headerText}>{getLabel('labtsrc_9')}</Text>
                <TouchableOpacity onPress={handleCross} style={styles.closeImageStyle}>
                    <Image source={require('../images/black_cross.png')} />
                </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
                <Image source={require('../images/search.png')} style={styles.searchIcon} />
                <TextInput
                    style={[styles.inputText, {
                        textAlign: (selectedLanguage?.Alignment ?? 'ltr') === 'rtl' ? 'right' : 'left'
                    }]}
                    placeholder={getLabel('labtsrc_9')}
                    placeholderTextColor="black"
                    value={searchText}
                    onChangeText={setSearchText}
                />
                {searchText.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchText('')}>
                        <Image source={require('../images/black_cross.png')} style={styles.CrossIconTop} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Image source={require('../images/addCart.png')} style={styles.CartIconTop} />
                </TouchableOpacity>
                {cartItems.length > 0 && (
                    <View style={styles.notificationBadge}>
                        <Text style={styles.notificationBadgeText}>{cartItems.length}</Text>
                    </View>
                )}
            </View>

            {/* Display booking details */}
            {bookingDetails && (
                <View style={styles.bookingDataContainer}>
                    <Text style={styles.bookingDataText}>Booking No: {bookingDetails.Booking_Date}</Text>
                    <Text style={styles.bookingDataText}>Booking Date: {bookingDetails.Booking_Date}</Text>
                    <Text style={styles.bookingDataText}>Patient Name: {bookingDetails.Pt_Name}</Text>
                    <Text style={styles.bookingDataText}>Total Bill Amount: {bookingDetails.Total_Bill_Amount} INR</Text>
                    {/* Add other necessary fields here */}
                </View>
            )}

            {isLoading ? (
                <SpinnerIndicator />
            ) : (
                <FlatList
                    data={testData}
                    keyExtractor={item => item.Service_Code}
                    renderItem={renderItem}
                    contentContainerStyle={styles.flatListContainer}
                    ListFooterComponent={
                        cartItems.length > 0 ? (
                            <View>
                                <Text style={styles.bottomText}>Total Cart Value INR {totalCartValue}</Text>
                                <TouchableOpacity style={styles.SubmitButtonView} onPress={handleProceed}>
                                    <Text style={styles.ButtonText}>{getLabel('labtsrc_6')}</Text>
                                </TouchableOpacity>
                                <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                                    <Text style={{ color: '#fd1a1b', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular }}>{getLabel('labtsrc_7')}</Text>
                                </View>
                            </View>
                        ) : null
                    }
                />
            )}

            <Modal
                visible={isModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {cartItems.length > 0 ? (
                            <FlatList
                                data={cartItems}
                                keyExtractor={(item) => item.Service_Code}
                                renderItem={({ item }) => {
                                    const isItemInCart = cartItems.some(cartItem => cartItem.Service_Code === item.Service_Code);

                                    return (
                                        <View style={styles.cartItem}>
                                            <Text style={styles.testName}>{item.Service_Name}</Text>
                                            <Text style={styles.testPrice}>{item.Amount} INR</Text>

                                            <TouchableOpacity
                                                style={[styles.addToCartButton, isItemInCart ? styles.removeButton : styles.addButton]}
                                                onPress={() => dispatch(removeFromCart(item))}
                                            >
                                                <View style={styles.addToCartContainer}>
                                                    <Image source={isItemInCart ? require('../images/removeCart.png') : require('../images/addCart.png')} style={styles.CartIcon} />
                                                    <Text style={styles.cartButtonText}>
                                                        {isItemInCart ? getLabel('remove_from_cart') : getLabel('add_to_cart')}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                }}
                                ListFooterComponent={
                                    <View>
                                        <Text style={styles.bottomText}>Total Cart Value INR {totalCartValue}</Text>
                                        <TouchableOpacity style={styles.SubmitButtonView} onPress={handleProceed}>
                                            <Text style={styles.ButtonText}>Proceed</Text>
                                        </TouchableOpacity>
                                        <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                                            <Text style={{ color: '#fd1a1b', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular }}>{getLabel('labtsrc_7')}</Text>
                                        </View>
                                    </View>
                                }
                            />
                        ) : (
                            <View style={styles.emptyCartContainer}>
                                <Text style={styles.emptyCartText}>Cart is Empty</Text>
                            </View>
                        )}

                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Image source={require('../images/black_cross.png')} style={styles.CrossIconTop} />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default BookTestSearchScreen;








const styles = StyleSheet.create({
    MainContainer: { flex: 1, backgroundColor: Constants.COLOR.WHITE_COLOR },
    searchTestView: { flexDirection: 'row', justifyContent: "space-between", paddingHorizontal: 10, paddingVertical: 10 },
    headerText: { flex: 1, alignSelf: 'center', fontSize: Constants.FONT_SIZE.M, fontFamily: Constants.FONT_FAMILY.fontFamilyMedium },
    closeImageStyle: { width: deviceHeight / 45, height: deviceHeight / 45, right: 10 },
    inputContainer: { flexDirection: 'row', marginVertical: 16, borderWidth: 0.5, borderColor: Constants.COLOR.THEME_COLOR },
    searchIcon: { marginVertical: 16, width: deviceHeight / 50, height: deviceHeight / 50, alignSelf: 'center', marginLeft: 8 },
    CartIconTop: { marginVertical: 16, marginHorizontal: 20, width: deviceHeight / 50, height: deviceHeight / 50, alignSelf: 'center', resizeMode: 'contain' },
    CrossIconTop: { marginVertical: 16, marginHorizontal: 10, width: deviceHeight / 50, height: deviceHeight / 50, alignSelf: 'center', resizeMode: 'contain' },
    inputText: { marginHorizontal: 4, flex: 1, alignSelf: 'center', fontSize: Constants.FONT_SIZE.SM, fontFamily: Constants.FONT_FAMILY.fontFamilyRegular, padding: 6, color: 'black' },
    CartIcon: { resizeMode: 'contain', width: deviceHeight / 35, height: deviceHeight / 35, tintColor: Constants.COLOR.WHITE_COLOR, alignItems: 'center', marginLeft: 15 },
    notificationBadge: {
        position: 'absolute',
        right: 5,
        top: 5,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Constants.COLOR.THEME_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationBadgeText: {
        color: Constants.COLOR.WHITE_COLOR,
        fontSize: Constants.FONT_SIZE.SM,
        fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        alignItems: 'center',
        borderBottomColor: '#ddd',
    },
    addToCartButton: { marginTop: 10, borderRadius: 5, width: '20%', },
    spinnerContainer: { flex: 1, justifyContent: 'center' },
    modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: {
        backgroundColor: 'white',
        paddingVertical: 20, paddingHorizontal: 15, borderTopRightRadius: 30, borderTopLeftRadius: 30
    },
    emptyCartContainer: { alignItems: 'center', justifyContent: 'center' },
    emptyCartText: { fontSize: Constants.FONT_SIZE.M, fontFamily: Constants.FONT_FAMILY.fontFamilyRegular },
    testItemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 },
    testName: { width: '50%', color: '#3C3636', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular },
    testPrice: { width: '30%', fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold, fontSize: Constants.FONT_SIZE.M },
    bottomText: { fontSize: Constants.FONT_SIZE.M, alignSelf: 'center', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular },
    SubmitButtonView: { borderRadius: 25, width: deviceWidth / 1.2, backgroundColor: Constants.COLOR.THEME_COLOR, marginTop: 16, alignSelf: 'center' },
    ButtonText: { color: Constants.COLOR.WHITE_COLOR, fontFamily: Constants.FONT_FAMILY.fontFamilyMedium, fontSize: Constants.FONT_SIZE.M, padding: 12, alignSelf: 'center' },
    addToCartContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Constants.COLOR.THEME_COLOR, marginVertical: 10, padding: 6, borderRadius: 5, },
    flatListContainer: { paddingHorizontal: 10, },
    cartButtonText: { fontSize: 14, color: 'white', fontWeight: 'bold' },
    addButton: { flex: 1 },
    removeButton: { flex: 1 },
    alreadyInCartContainer: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#d3d3d3', // Light grey background
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 5,
    },
    alreadyInCartText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black', // Dark grey text
    },
});