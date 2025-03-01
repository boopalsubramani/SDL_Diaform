// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Image, Modal, Alert, TouchableWithoutFeedback } from 'react-native';
// import Constants from '../util/Constants';
// import { useCart } from '../common/CartContext';
// import { useNavigation } from '@react-navigation/native';
// import NavigationBar from '../common/NavigationBar';
// import BookTestHeader from './BookTestHeader';
// import NetInfo from '@react-native-community/netinfo';
// import ButtonBack from '../common/BackButton';
// import ButtonNext from '../common/NextButton';
// import { useAppSettings } from '../common/AppSettingContext';
// import { StackNavigationProp } from "@react-navigation/stack";
// import { RootStackParamList } from '../routes/Types';

// const deviceHeight = Dimensions.get('window').height;
// const deviceWidth = Dimensions.get('window').width;

// type NavigationProp = StackNavigationProp<RootStackParamList, "ChooseTest">;

// const ChooseTestScreen = ({ route, showHeader = true }: any) => {
//     const { selectedPatientDetails, totalCartValue: initialTotalCartValue, shouldNavigateToCalender, testData, imageUri } = route.params;
//     const navigation = useNavigation<NavigationProp>();
//     const { settings } = useAppSettings();
//     const { cartItems, setCartItems } = useCart();
//     const [selectedImage, setSelectedImage] = useState<string | null>(null);
//     const [totalCartValue, setTotalCartValue] = useState(initialTotalCartValue);
//     const [isModalVisible, setModalVisible] = useState(false);

//     const labels = settings?.Message?.[0]?.Labels || {};

//     const getLabel = (key: string) => {
//         return labels[key]?.defaultMessage || '';
//     };

//     useEffect(() => {
//         if (shouldNavigateToCalender) {
//             const timer = setTimeout(() => {
//                 handleProceedClick();
//             }, 1000);
//             return () => clearTimeout(timer);
//         }
//     }, [shouldNavigateToCalender]);

//     const handleSearchTest = () => {
//         navigation.navigate('BookTestSearch', { selectedPatientDetails });
//     };

//     const handleCartClick = () => {
//         if (cartItems.length > 0) {
//             setModalVisible(true);
//         } else {
//             Alert.alert('Alert', getLabel('labtscr_4'));
//         }
//     };


//     const handleUploadPrescription = () => {
//         navigation.navigate('UploadPrescription')
//     };

//     const calculateTotalCartValue = (updatedCartItems: any[]) => {
//         const total = updatedCartItems.reduce((acc, itemName) => {
//             const item = testData.find((test: { Service_Name: any; }) => test.Service_Name === itemName);
//             if (!item) {
//                 console.warn(`Item ${itemName} not found in testData`);
//                 return acc;
//             }
//             console.log(`Adding ${item.Amount} INR for ${itemName}`);
//             return acc + (item?.Amount || 0);
//         }, 0);
//         console.log('Total Cart Value:', total);
//         setTotalCartValue(total);
//     };

//     useEffect(() => {
//         if (route.params?.fromChoosePatient) {
//             setCartItems([]);
//             setTotalCartValue(0);
//         }
//     }, [route.params?.fromChoosePatient]);


//     useEffect(() => {
//         if (imageUri) {
//             setSelectedImage(imageUri);
//         }
//     }, [imageUri]);

//     const handleToggleCart = (itemName: string) => {
//         setCartItems(prevCartItems => {
//             const updatedCartItems = prevCartItems.includes(itemName)
//                 ? prevCartItems.filter(item => item !== itemName)
//                 : [...prevCartItems, itemName];
//             console.log('Updated Cart Items:', updatedCartItems);
//             calculateTotalCartValue(updatedCartItems);
//             return updatedCartItems;
//         });
//     };


//     const handleBack = async () => {
//         const state = await NetInfo.fetch();
//         if (!state.isConnected) {
//             Alert.alert(Constants.ALERT.TITLE.ERROR, Constants.VALIDATION_MSG.NO_INTERNET);
//             return;
//         }
//         navigation.navigate('ChoosePatient');
//     };

//     const handleNext = async () => {
//         const state = await NetInfo.fetch();
//         if (!state.isConnected) {
//             Alert.alert(Constants.ALERT.TITLE.ERROR, Constants.VALIDATION_MSG.NO_INTERNET);
//             return;
//         }
//         if (cartItems.length === 0 && !selectedImage) {
//             Alert.alert('Alert', 'Please select a test or upload a prescription before proceeding.');
//             return;
//         }
//         navigation.navigate('BookTestSearch', { selectedPatientDetails });
//     };

//     const handleProceedClick = () => {
//         if (cartItems.length > 0) {
//             const selectedTests = cartItems.map(itemName => {
//                 const item = Array.isArray(testData) ? testData.find((test: { Service_Name: string; }) => test.Service_Name === itemName) : null;
//                 return {
//                     Service_Name: item?.Service_Name,
//                     Amount: item?.Amount,
//                 };
//             });
//             navigation.navigate('Calender', { selectedTests, selectedPatientDetails, totalCartValue, testData });
//         } else {
//             Alert.alert('Empty Cart', 'Please add items to the cart before proceeding.');
//         }
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
//             const itemData = Array.isArray(testData)
//                 ? testData.find((test: { Service_Name: string }) => test.Service_Name === item)
//                 : undefined;
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

//     return (
//         <View style={styles.MainContainer}>
//             {showHeader && (
//                 <>
//                     <NavigationBar title="Book Test" />
//                     <BookTestHeader selectValue={1} />
//                 </>
//             )}
//             <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//                 <View style={styles.innerContainer}>
//                     <View style={styles.ChooseTestView}>
//                         <Text style={styles.chooseTestText}>{getLabel('labtscr_5')}</Text>
//                         <View style={styles.cartValueView}>
//                             <Text style={styles.cartValueLabel}>{getLabel('labtscr_6')}</Text>
//                             <Text style={styles.cartValue}>{totalCartValue} INR</Text>
//                         </View>
//                     </View>
//                     <View style={styles.searchCartView}>
//                         <TouchableOpacity onPress={handleSearchTest}>
//                             <Image source={require('../images/search.png')} style={styles.searchIcon} />
//                         </TouchableOpacity>
//                         <Text style={styles.searchLabel}>{getLabel('labtscr_8')}</Text>
//                         <TouchableOpacity onPress={handleCartClick} style={styles.searchCartRightView}>
//                             <Image source={require('../images/addCart.png')} style={styles.CartIcon} />
//                         </TouchableOpacity>
//                         {cartItems.length > 0 && (
//                             <View style={styles.notificationBadge}>
//                                 <Text style={styles.notificationBadgeText}>{cartItems.length}</Text>
//                             </View>
//                         )}
//                     </View>
//                     {selectedImage && (
//                         <View style={styles.uploadedImageContainer}>
//                             <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
//                         </View>
//                     )}
//                     <View style={styles.uploadContainer}>
//                         <TouchableOpacity style={styles.uploadButtonView} onPress={handleUploadPrescription}>
//                             <Image source={require('../images/up_arrow.png')} style={styles.uploadImage} />
//                             <Text style={styles.uploadText}>{getLabel('labtscr_10')}</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </ScrollView>
//             {isModalVisible && (
//                 <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => setModalVisible(false)}>
//                     <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
//                         <View style={styles.modalContainer}>
//                             <TouchableWithoutFeedback>
//                                 <View style={styles.modalBackground}>
//                                     <View style={styles.modalContent}>
//                                         {renderCartItems()}
//                                         <Text style={styles.bottomText}>Total Cart Value INR {totalCartValue}</Text>
//                                         {cartItems.length > 0 && (
//                                             <TouchableOpacity onPress={handleProceedClick}>
//                                                 <View style={styles.SubmitButtonView}>
//                                                     <Text style={styles.ButtonText}>{getLabel('labtscr_2')}</Text>
//                                                 </View>
//                                             </TouchableOpacity>
//                                         )}
//                                         <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
//                                             <Text style={{ color: '#fd1a1b' }}>{getLabel('labtscr_3')}</Text>
//                                         </View>
//                                     </View>
//                                 </View>
//                             </TouchableWithoutFeedback>
//                         </View>
//                     </TouchableWithoutFeedback>
//                 </Modal>
//             )}
//             <View style={styles.navigationContainer}>
//                 <TouchableOpacity onPress={handleBack}>
//                     <ButtonBack />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={handleNext}>
//                     <ButtonNext />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };

// export default ChooseTestScreen;

// const styles = StyleSheet.create({
//     MainContainer: {
//         flex: 1,
//         backgroundColor: Constants.COLOR.LAB_SEARCH_SCREEN_BG,
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
//     searchIcon: {
//         width: 20,
//         height: 20,
//         alignSelf: 'center',
//     },
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
//     notificationBadge: {
//         position: 'absolute',
//         right: 15,
//         top: 5,
//         width: 20,
//         height: 20,
//         borderRadius: 10,
//         backgroundColor: 'red',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     notificationBadgeText: {
//         color: 'white',
//         fontSize: 12,
//         fontWeight: 'bold',
//     },
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
//     }
// });





// import React, { useState, useEffect } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Image, Modal, Alert, TouchableWithoutFeedback } from 'react-native';
// import Constants from '../util/Constants';
// import { useCart } from '../common/CartContext';
// import { useNavigation } from '@react-navigation/native';
// import NavigationBar from '../common/NavigationBar';
// import BookTestHeader from './BookTestHeader';
// import NetInfo from '@react-native-community/netinfo';
// import ButtonBack from '../common/BackButton';
// import ButtonNext from '../common/NextButton';
// import { useAppSettings } from '../common/AppSettingContext';
// import { StackNavigationProp } from "@react-navigation/stack";
// import { RootStackParamList } from '../routes/Types';

// const deviceHeight = Dimensions.get('window').height;
// const deviceWidth = Dimensions.get('window').width;

// type NavigationProp = StackNavigationProp<RootStackParamList, "ChooseTest">;

// const ChooseTestScreen = ({ route, showHeader = true }: any) => {
//     const { selectedPatientDetails, totalCartValue: initialTotalCartValue, shouldNavigateToCalender, testData, imageUri } = route.params;
//     const navigation = useNavigation<NavigationProp>();
//     const { settings } = useAppSettings();
//     const { cartItems, setCartItems } = useCart();
//     const [selectedImage, setSelectedImage] = useState<string | null>(null);
//     const [totalCartValue, setTotalCartValue] = useState(initialTotalCartValue);
//     const [isModalVisible, setModalVisible] = useState(false);

//     const labels = settings?.Message?.[0]?.Labels || {};

//     const getLabel = (key: string) => {
//         return labels[key]?.defaultMessage || '';
//     };

//     useEffect(() => {
//         if (shouldNavigateToCalender) {
//             const timer = setTimeout(() => {
//                 handleProceedClick();
//             }, 1000);
//             return () => clearTimeout(timer);
//         }
//     }, [shouldNavigateToCalender]);

//     const handleSearchTest = () => {
//         navigation.navigate('BookTestSearch', { selectedPatientDetails });
//     };

//     const handleCartClick = () => {
//         if (cartItems.length > 0) {
//             setModalVisible(true);
//         } else {
//             Alert.alert('Alert', getLabel('labtscr_4'));
//         }
//     };

//     useEffect(() => {
//         console.log('Updated Cart Items:', cartItems);
//     }, [cartItems]);

//     const handleUploadPrescription = () => {
//         navigation.navigate('UploadPrescription')
//     };

//     const calculateTotalCartValue = () => {
//         const total = cartItems.reduce((sum, item) => sum + (item?.Amount || 0), 0);
//         setTotalCartValue(total);
//     };

//     useEffect(() => {
//         calculateTotalCartValue();
//     }, [cartItems, testData]);


//     useEffect(() => {
//         if (route.params?.fromChoosePatient) {
//             setCartItems([]);
//             setTotalCartValue(0);
//         }
//     }, [route.params?.fromChoosePatient]);


//     useEffect(() => {
//         if (imageUri) {
//             setSelectedImage(imageUri);
//         }
//     }, [imageUri]);


//     // const handleToggleCart = (test: { Service_Name: string }) => {
//     //     if (!test || typeof test.Service_Name !== 'string') {
//     //         console.warn('Invalid cart item:', test);
//     //         return;
//     //     }

//     //     setCartItems(prevCartItems => {
//     //         const updatedCartItems = prevCartItems.includes(test.Service_Name)
//     //             ? prevCartItems.filter(item => item !== test.Service_Name)
//     //             : [...prevCartItems, test.Service_Name];

//     //         console.log('Updated Cart Items:', updatedCartItems);
//     //         calculateTotalCartValue(updatedCartItems);
//     //         return updatedCartItems;
//     //     });
//     // };
//     const handleToggleCart = (test: { Service_Name: string; Amount?: number }) => {
//         if (!test || typeof test.Service_Name !== 'string') {
//             console.warn('Invalid cart item:', test);
//             return;
//         }

//         setCartItems(prevCartItems => {
//             const isItemInCart = prevCartItems.some(item => item.Service_Name === test.Service_Name);

//             const updatedCartItems = isItemInCart
//                 ? prevCartItems.filter(item => item.Service_Name !== test.Service_Name)
//                 : [...prevCartItems, test];

//             console.log('Updated Cart Items:', updatedCartItems);
//             calculateTotalCartValue(updatedCartItems);
//             return updatedCartItems;
//         });
//     };



//     const handleBack = async () => {
//         const state = await NetInfo.fetch();
//         if (!state.isConnected) {
//             Alert.alert(Constants.ALERT.TITLE.ERROR, Constants.VALIDATION_MSG.NO_INTERNET);
//             return;
//         }
//         navigation.navigate('ChoosePatient');
//     };

//     const handleNext = async () => {
//         const state = await NetInfo.fetch();
//         if (!state.isConnected) {
//             Alert.alert(Constants.ALERT.TITLE.ERROR, Constants.VALIDATION_MSG.NO_INTERNET);
//             return;
//         }
//         if (cartItems.length === 0 && !selectedImage) {
//             Alert.alert('Alert', 'Please select a test or upload a prescription before proceeding.');
//             return;
//         }
//         navigation.navigate('BookTestSearch', { selectedPatientDetails });
//     };

//     // const handleProceedClick = () => {
//     //     if (cartItems.length > 0) {
//     //         const selectedTests = cartItems.map(itemName => {
//     //             const item = Array.isArray(testData) ? testData.find((test: { Service_Name: string; }) => test.Service_Name === itemName) : null;
//     //             return {
//     //                 Service_Name: item?.Service_Name,
//     //                 Amount: item?.Amount,
//     //             };
//     //         });
//     //         navigation.navigate('Calender', { selectedTests, selectedPatientDetails, totalCartValue, testData });
//     //     } else {
//     //         Alert.alert('Empty Cart', 'Please add items to the cart before proceeding.');
//     //     }
//     // };

//         const handleProceedClick = () => {
//             if (cartItems.length > 0) {
//                 navigation.navigate('Calender', {
//                     selectedTests: cartItems,
//                     selectedPatientDetails,
//                     totalCartValue,
//                     testData,
//                 });
//             } else {
//                 Alert.alert('Empty Cart', 'Please add items to the cart before proceeding.');
//             }
//         };

//     const renderCartItems = () => {
//         if (cartItems.length === 0) {
//             return (
//                 <View style={styles.emptyCartContainer}>
//                     <Text style={styles.emptyCartText}>{getLabel('labtscr_4')}</Text>
//                 </View>
//             );
//         }

//         return cartItems.map((item, index) => {
//             // Ensure 'item' is an object
//             const itemData = typeof item === 'object' && item !== null ? item :
//                 (Array.isArray(testData) ? testData.find((test: { Service_Name: string }) => test.Service_Name === item) : null);

//             if (!itemData) {
//                 console.warn(`Cart item "${JSON.stringify(item)}" not found in testData.`);
//                 return null;
//             }

//             return (
//                 <View style={styles.testItemContainer} key={index}>
//                     <Text style={styles.testName}>{itemData.Service_Name}</Text>
//                     <Text style={styles.testPrice}>{`${itemData.Amount ?? 0} INR`}</Text>
//                     <TouchableOpacity onPress={() => handleToggleCart(itemData)}>
//                         <View style={styles.addToCartContainer}>
//                             <Image source={require('../images/addCart.png')} style={styles.CartIcon} />
//                             <Text>Remove</Text>
//                         </View>
//                     </TouchableOpacity>
//                 </View>
//             );
//         });
//     };

//     return (
//         <View style={styles.MainContainer}>
//             {showHeader && (
//                 <>
//                     <NavigationBar title="Book Test" />
//                     <BookTestHeader selectValue={1} />
//                 </>
//             )}
//             <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
//                 <View style={styles.innerContainer}>
//                     <View style={styles.ChooseTestView}>
//                         <Text style={styles.chooseTestText}>{getLabel('labtscr_5')}</Text>
//                         <View style={styles.cartValueView}>
//                             <Text style={styles.cartValueLabel}>{getLabel('labtscr_6')}</Text>
//                             <Text style={styles.cartValue}>{isNaN(totalCartValue) ? "0" : totalCartValue} INR</Text>
//                         </View>
//                     </View>
//                     <View style={styles.searchCartView}>
//                         <TouchableOpacity onPress={handleSearchTest}>
//                             <Image source={require('../images/search.png')} style={styles.searchIcon} />
//                         </TouchableOpacity>
//                         <Text style={styles.searchLabel}>{getLabel('labtscr_8')}</Text>
//                         <TouchableOpacity onPress={handleCartClick} style={styles.searchCartRightView}>
//                             <Image source={require('../images/addCart.png')} style={styles.CartIcon} />
//                         </TouchableOpacity>
//                         {cartItems.length > 0 && (
//                             <View style={styles.notificationBadge}>
//                                 <Text style={styles.notificationBadgeText}>{cartItems.length}</Text>
//                             </View>
//                         )}
//                     </View>
//                     {selectedImage && (
//                         <View style={styles.uploadedImageContainer}>
//                             <Image source={{ uri: selectedImage }} style={styles.uploadedImage} />
//                         </View>
//                     )}
//                     <View style={styles.uploadContainer}>
//                         <TouchableOpacity style={styles.uploadButtonView} onPress={handleUploadPrescription}>
//                             <Image source={require('../images/up_arrow.png')} style={styles.uploadImage} />
//                             <Text style={styles.uploadText}>{getLabel('labtscr_10')}</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </ScrollView>
//             {isModalVisible && (
//                 <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => setModalVisible(false)}>
//                     <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
//                         <View style={styles.modalContainer}>
//                             <TouchableWithoutFeedback>
//                                 <View style={styles.modalBackground}>
//                                     <View style={styles.modalContent}>
//                                         {renderCartItems()}
//                                         <Text style={styles.bottomText}>Total Cart Value INR {totalCartValue}</Text>
//                                         {cartItems.length > 0 && (
//                                             <TouchableOpacity onPress={handleProceedClick}>
//                                                 <View style={styles.SubmitButtonView}>
//                                                     <Text style={styles.ButtonText}>{getLabel('labtscr_2')}</Text>
//                                                 </View>
//                                             </TouchableOpacity>
//                                         )}
//                                         <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
//                                             <Text style={{ color: '#fd1a1b' }}>{getLabel('labtscr_3')}</Text>
//                                         </View>
//                                     </View>
//                                 </View>
//                             </TouchableWithoutFeedback>
//                         </View>
//                     </TouchableWithoutFeedback>
//                 </Modal>
//             )}
//             <View style={styles.navigationContainer}>
//                 <TouchableOpacity onPress={handleBack}>
//                     <ButtonBack />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={handleNext}>
//                     <ButtonNext />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };

// export default ChooseTestScreen;

// const styles = StyleSheet.create({
//     MainContainer: {
//         flex: 1,
//         backgroundColor: Constants.COLOR.LAB_SEARCH_SCREEN_BG,
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
//     searchIcon: {
//         width: 20,
//         height: 20,
//         alignSelf: 'center',
//     },
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
//     notificationBadge: {
//         position: 'absolute',
//         right: 15,
//         top: 5,
//         width: 20,
//         height: 20,
//         borderRadius: 10,
//         backgroundColor: 'red',
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     notificationBadgeText: {
//         color: 'white',
//         fontSize: 12,
//         fontWeight: 'bold',
//     },
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
//     }
// });





import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Image, Modal, Alert, TouchableWithoutFeedback } from 'react-native';
import Constants from '../util/Constants';
import { useCart } from '../common/CartContext';
import { useNavigation } from '@react-navigation/native';
import NavigationBar from '../common/NavigationBar';
import BookTestHeader from './BookTestHeader';
import NetInfo from '@react-native-community/netinfo';
import ButtonBack from '../common/BackButton';
import ButtonNext from '../common/NextButton';
import { useAppSettings } from '../common/AppSettingContext';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '../routes/Types';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

type NavigationProp = StackNavigationProp<RootStackParamList, "ChooseTest">;

const ChooseTestScreen = ({ route, showHeader = true }: any) => {
    const { selectedPatientDetails, totalCartValue: initialTotalCartValue, shouldNavigateToCalender, testData = [] } = route.params;
    const navigation = useNavigation<NavigationProp>();
    const { settings } = useAppSettings();
    const { cartItems, setCartItems } = useCart();
    const [totalCartValue, setTotalCartValue] = useState(initialTotalCartValue);
    const [isModalVisible, setModalVisible] = useState(false);

    const updatedCart = useSelector(
        (state: RootState) => state.bookTestSearch.updatedCartData
    );

    console.log('0000000000000000updatedCart00000000', updatedCart);

    const labels = settings?.Message?.[0]?.Labels || {};

    const getLabel = (key: string) => {
        return labels[key]?.defaultMessage || '';
    };

    useEffect(() => {
        if (shouldNavigateToCalender) {
            const timer = setTimeout(() => {
                handleProceedClick();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [shouldNavigateToCalender]);

    const handleUploadPrescription = () => {
        navigation.navigate('UploadPrescription');
    };

    const handleSearchTest = () => {
        navigation.navigate('BookTestSearch', { selectedPatientDetails });
    };

    const handleCartClick = () => {
        if (cartItems.length > 0) {
            setModalVisible(true);
        } else {
            Alert.alert('Alert', getLabel('labtscr_4'));
        }
    };

    const calculateTotalCartValue = (updatedCartItems: any[]) => {
        const total = updatedCartItems.reduce((acc, itemName) => {
            const item = testData.find((test: { Service_Name: any; }) => test.Service_Name === itemName);
            return acc + (item?.Amount || 0);
        }, 0);
        setTotalCartValue(total);
    };

    const handleToggleCart = (itemName: string) => {
        setCartItems(prevCartItems => {
            const updatedCartItems = prevCartItems.includes(itemName)
                ? prevCartItems.filter(item => item !== itemName)
                : [...prevCartItems, itemName];
            calculateTotalCartValue(updatedCartItems);
            return updatedCartItems;
        });
    };

    const handleBack = async () => {
        const state = await NetInfo.fetch();
        if (!state.isConnected) {
            Alert.alert(Constants.ALERT.TITLE.ERROR, Constants.VALIDATION_MSG.NO_INTERNET);
            return;
        }
        navigation.navigate('ChoosePatient');
    };

    const handleNext = async () => {
        const state = await NetInfo.fetch();
        if (!state.isConnected) {
            Alert.alert(Constants.ALERT.TITLE.ERROR, Constants.VALIDATION_MSG.NO_INTERNET);
            return;
        }
        navigation.navigate('BookTestSearch', { selectedPatientDetails });
    };

    const handleProceedClick = () => {
        if (cartItems.length > 0) {
            const selectedTests = cartItems.map(itemName => {
                const item = Array.isArray(testData) ? testData.find((test: { Service_Name: string; }) => test.Service_Name === itemName) : null;
                return {
                    Service_Name: item?.Service_Name,
                    Amount: item?.Amount,
                };
            });
            navigation.navigate('Calender', { selectedTests, selectedPatientDetails, totalCartValue, testData });
        } else {
            Alert.alert('Empty Cart', 'Please add items to the cart before proceeding.');
        }
    };

    const renderCartItems = () => {
        if (cartItems.length === 0) {
            return (
                <View style={styles.emptyCartContainer}>
                    <Text style={styles.emptyCartText}>{getLabel('labtscr_4')}</Text>
                </View>
            );
        }
        return updatedCart.map((item, index) => {
            return (
                <View style={styles.testItemContainer} key={index}>
                    <Text style={styles.testName}>{item.Service_Name}</Text>
                    <Text style={styles.testPrice}>{item.Amount} INR</Text>
                    <TouchableOpacity onPress={() => handleToggleCart(item.Service_Name)}>
                        <View style={styles.addToCartContainer}>
                            <Image source={require('../images/addCart.png')} style={styles.CartIcon} />
                            <Text style={{ fontSize: Constants.FONT_SIZE.SM, fontFamily: Constants.FONT_FAMILY.fontFamilyMedium, color: Constants.COLOR.WHITE_COLOR }}>Remove</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        });
    };

    return (
        <View style={styles.MainContainer}>
            {showHeader && (
                <>
                    <NavigationBar title="Book Test" />
                    <BookTestHeader selectValue={1} />
                </>
            )}
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.innerContainer}>
                    <View style={styles.ChooseTestView}>
                        <Text style={styles.chooseTestText}>{getLabel('labtscr_5')}</Text>
                        <View style={styles.cartValueView}>
                            <Text style={styles.cartValueLabel}>{getLabel('labtscr_6')}</Text>
                            <Text style={styles.cartValue}>{totalCartValue} INR</Text>
                        </View>
                    </View>
                    <View style={styles.searchCartView}>
                        <TouchableOpacity onPress={handleSearchTest}>
                            <Image source={require('../images/search.png')} style={styles.searchIcon} />
                        </TouchableOpacity>
                        <Text style={styles.searchLabel}>{getLabel('labtscr_8')}</Text>
                        <TouchableOpacity onPress={handleCartClick} style={styles.searchCartRightView}>
                            <Image source={require('../images/addCart.png')} style={styles.CartIconTop} />
                        </TouchableOpacity>
                        {cartItems.length > 0 && (
                            <View style={styles.notificationBadge}>
                                <Text style={styles.notificationBadgeText}>{cartItems.length}</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.uploadContainer}>
                        <TouchableOpacity style={styles.uploadButtonView} onPress={handleUploadPrescription}>
                            <Image source={require('../images/up_arrow.png')} style={styles.uploadImage} />
                            <Text style={styles.uploadText}>{getLabel('labtscr_10')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            {isModalVisible && (
                <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={() => setModalVisible(false)}>
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                        <View style={styles.modalContainer}>
                            <TouchableWithoutFeedback>
                                <View style={styles.modalBackground}>
                                    <View style={styles.modalContent}>
                                        {renderCartItems()}
                                        <Text style={styles.bottomText}>Total Cart Value INR {totalCartValue}</Text>
                                        {updatedCart.length > 0 && (
                                            <TouchableOpacity onPress={handleProceedClick}>
                                                <View style={styles.SubmitButtonView}>
                                                    <Text style={styles.ButtonText}>{getLabel('labtscr_2')}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                        <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                                            <Text style={{ color: '#fd1a1b', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular }}>{getLabel('labtscr_3')}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            )}
            <View style={styles.navigationContainer}>
                <TouchableOpacity onPress={handleBack}>
                    <ButtonBack />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleNext}>
                    <ButtonNext />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ChooseTestScreen;

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        backgroundColor: Constants.COLOR.WHITE_COLOR,
    },
    innerContainer: {
        flex: 1,
        backgroundColor: Constants.COLOR.WHITE_COLOR,
    },
    ChooseTestView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    chooseTestText: {
        flex: 1,
        fontSize: Constants.FONT_SIZE.M,
        alignSelf: 'center',
        fontFamily: Constants.FONT_FAMILY.fontFamilyMedium
    },
    cartValueView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartValueLabel: {
        color: '#B1BE95',
        marginRight: 10,
        alignItems: 'center',
        fontSize: Constants.FONT_SIZE.S,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular
    },
    cartValue: {
        color: Constants.COLOR.THEME_COLOR,
        fontSize: Constants.FONT_SIZE.M,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular
    },
    searchCartView: {
        marginTop: 10,
        marginHorizontal: 10,
        flexDirection: 'row',
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: Constants.COLOR.THEME_COLOR,
        paddingLeft: 20,
        paddingRight: 10,
        paddingTop: 15,
        paddingBottom: 15,
    },
    searchIcon: {
        width: deviceHeight / 35,
        height: deviceHeight / 35,
        alignSelf: 'center',
    },
    CartIconTop: { marginVertical: 16, marginHorizontal: 10, width: deviceHeight / 50, height: deviceHeight / 50, alignSelf: 'center' },

    CartIcon: { marginLeft: 10, marginRight: 15, width: deviceHeight / 35, height: deviceHeight / 35, alignSelf: 'center', tintColor: Constants.COLOR.WHITE_COLOR },

    searchLabel: {
        fontSize: Constants.FONT_SIZE.SM,
        alignSelf: 'center',
        paddingHorizontal: 20,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
        color: '#3C3636'
    },
    searchCartRightView: {
        position: 'absolute',
        right: 0,
        flexDirection: 'row',
        alignSelf: 'center',
        marginEnd: 10,
    },
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
        fontFamily:Constants.FONT_FAMILY.fontFamilySemiBold
    },
    uploadContainer: {
        marginTop: 20,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    uploadButtonView: {
        marginTop: 20,
        padding: 12,
        borderRadius: 25,
        backgroundColor: '#ECEEF5',
        flexDirection: 'row',
        alignSelf: 'flex-end',
        justifyContent: 'center',
    },
    uploadImage: {
        width: deviceHeight / 35,
        height: deviceHeight / 35,
        alignItems: 'center',
        tintColor: Constants.COLOR.THEME_COLOR
    },
    uploadText: {
        color: Constants.COLOR.THEME_COLOR,
        marginLeft: 10,
        alignItems: 'center',
        fontSize: Constants.FONT_SIZE.SM,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalBackground: {
        width: '100%',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: 'white',
    },
    modalContent: {
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: 'white',
    },
    emptyCartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyCartText: { fontSize: Constants.FONT_SIZE.M, fontFamily: Constants.FONT_FAMILY.fontFamilyRegular },
    testItemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 },

    testName: { width: '40%', color: '#3C3636', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular },
    testPrice: { width: '20%', fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold, fontSize: Constants.FONT_SIZE.M },

    bottomText: {
        fontSize: Constants.FONT_SIZE.M,
        alignSelf: 'center',
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular
    },

    SubmitButtonView: { borderRadius: 25, width: deviceWidth / 1.2, backgroundColor: Constants.COLOR.THEME_COLOR, marginTop: 16, alignSelf: 'center' },

    ButtonText: { color: Constants.COLOR.WHITE_COLOR, fontFamily: Constants.FONT_FAMILY.fontFamilyMedium, fontSize: Constants.FONT_SIZE.M, padding: 12, alignSelf: 'center' },

    addToCartContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Constants.COLOR.THEME_COLOR, marginVertical: 10, padding: 6, borderRadius: 5, },

    navigationContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#FBFBFB',
        justifyContent: 'space-between',
    },
});
