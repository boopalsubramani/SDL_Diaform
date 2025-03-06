import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, BackHandler, Dimensions, ScrollView, Image, Modal, Alert, TouchableWithoutFeedback } from 'react-native';
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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { useUser } from '../common/UserContext';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

type NavigationProp = StackNavigationProp<RootStackParamList, "ChooseTest">;

// const ChooseTestScreen = ({ route, showHeader = true }: any) => {
//     const { selectedPatientDetails, imageUri: initialImageUri, totalCartValue: initialTotalCartValue, shouldNavigateToCalender, testData = [] } = route.params;
//     const navigation = useNavigation<NavigationProp>();
//     const { settings } = useAppSettings();
//     const { cartItems, setCartItems } = useCart();
//     const [totalCartValue, setTotalCartValue] = useState(initialTotalCartValue);
//     const [isModalVisible, setModalVisible] = useState(false);
//     const [imageUri, setImageUri] = useState(initialImageUri);
//     const { imageBase64, convertImageToBase64 } = useUser();

//     const updatedCart = useSelector(
//         (state: RootState) => state.bookTestSearch.updatedCartData
//     );

//     const handleRemoveImage = () => {
//         setImageUri(null);
//     };

//     useEffect(() => {
//         if (imageUri) {
//             convertImageToBase64(imageUri);
//         }
//     }, [imageUri]);

//     useEffect(() => {
//         // Clear the cart when the component mounts or route params change
//         setCartItems([]);
//         setTotalCartValue(0);
//     }, [route.params, setCartItems]);


//     const labels = settings?.Message?.[0]?.Labels || {};

//     const getLabel = (key: string) => {
//         return labels[key]?.defaultMessage || '';
//     };

//     useEffect(() => {
//         const handleBackPress = () => true;
//         const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

//         if (shouldNavigateToCalender) {
//             const timer = setTimeout(handleProceedClick, 1000);
//             return () => clearTimeout(timer);
//         }

//         return () => backHandler.remove();
//     }, [shouldNavigateToCalender]);

//     const handleUploadPrescription = () => {
//         navigation.navigate('UploadPrescription');
//     };

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

//     const calculateTotalCartValue = (updatedCartItems: any[]) => {
//         const total = updatedCartItems.reduce((acc, itemName) => {
//             const item = testData.find((test: { Service_Name: any; }) => test.Service_Name === itemName);
//             return acc + (item?.Amount || 0);
//         }, 0);
//         setTotalCartValue(total);
//     };

//     const handleToggleCart = (itemName: string) => {
//         setCartItems(prevCartItems => {
//             const updatedCartItems = prevCartItems.includes(itemName)
//                 ? prevCartItems.filter(item => item !== itemName)
//                 : [...prevCartItems, itemName];
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
//         if (cartItems.length === 0 && !imageUri) {
//             Alert.alert("Error", "Please add at least one item to the cart or select an image.");
//             return;
//         }

//         const state = await NetInfo.fetch();
//         if (!state.isConnected) {
//             Alert.alert(Constants.ALERT.TITLE.ERROR, Constants.VALIDATION_MSG.NO_INTERNET);
//             return;
//         }

//         navigation.navigate('Calender', { selectedPatientDetails, totalCartValue, testData, selectedTests: cartItems });
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
//         return updatedCart.map((item, index) => {
//             return (
//                 <View style={styles.testItemContainer} key={index}>
//                     <Text style={styles.testName}>{item.Service_Name}</Text>
//                     <Text style={styles.testPrice}>{item.Amount} INR</Text>
//                     <TouchableOpacity onPress={() => handleToggleCart(item.Service_Name)}>
//                         <View style={styles.addToCartContainer}>
//                             <Image source={require('../images/addCart.png')} style={styles.CartIcon} />
//                             <Text style={{ fontSize: Constants.FONT_SIZE.SM, fontFamily: Constants.FONT_FAMILY.fontFamilyMedium, color: Constants.COLOR.WHITE_COLOR }}>Remove</Text>
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
//                             <Image source={require('../images/addCart.png')} style={styles.CartIconTop} />
//                         </TouchableOpacity>
//                         {cartItems.length > 0 && (
//                             <View style={styles.notificationBadge}>
//                                 <Text style={styles.notificationBadgeText}>{cartItems.length}</Text>
//                             </View>
//                         )}
//                     </View>

//                     {/* Move the selected image above upload prescription */}
//                     {imageBase64 && (
//                         <View style={styles.imageContainer}>
//                             <Image
//                                 source={{ uri: `data:image/png;base64,${imageBase64}` }}
//                                 style={styles.selectedImage}
//                             />
//                             <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
//                                 <Image source={require('../images/black_cross.png')} style={styles.crossIcon} />
//                             </TouchableOpacity>
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
//                                         {updatedCart.length > 0 && (
//                                             <TouchableOpacity onPress={handleProceedClick}>
//                                                 <View style={styles.SubmitButtonView}>
//                                                     <Text style={styles.ButtonText}>{getLabel('labtscr_2')}</Text>
//                                                 </View>
//                                             </TouchableOpacity>
//                                         )}
//                                         <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
//                                             <Text style={{ color: '#fd1a1b', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular }}>{getLabel('labtscr_3')}</Text>
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

const ChooseTestScreen = ({ route, showHeader = true }: any) => {
    const { selectedPatientDetails, selectedTests = [], totalCartValue: initialTotalCartValue, shouldNavigateToCalender, testData = [] } = route.params;
    const navigation = useNavigation<NavigationProp>();
    const { settings } = useAppSettings();
    const { cartItems, setCartItems } = useCart();
    const [totalCartValue, setTotalCartValue] = useState(initialTotalCartValue);
    const [isModalVisible, setModalVisible] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const { imageBase64, convertImageToBase64 } = useUser();

    const updatedCart = useSelector(
        (state: RootState) => state.bookTestSearch.updatedCartData
    );

    const handleRemoveImage = () => {
        setImageUri(null);
    };

    useEffect(() => {
        if (imageUri) {
            convertImageToBase64(imageUri);
        }
    }, [imageUri]);

    useEffect(() => {
        // Initialize cart items from selectedTests
        setCartItems(selectedTests.map(test => test.Service_Name));
        setTotalCartValue(initialTotalCartValue);
    }, [route.params, setCartItems, selectedTests, initialTotalCartValue]);

    const labels = settings?.Message?.[0]?.Labels || {};

    const getLabel = (key: string) => {
        return labels[key]?.defaultMessage || '';
    };

    useEffect(() => {
        const handleBackPress = () => true;
        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        if (shouldNavigateToCalender) {
            const timer = setTimeout(handleProceedClick, 1000);
            return () => clearTimeout(timer);
        }

        return () => backHandler.remove();
    }, [shouldNavigateToCalender]);

    const handleUploadPrescription = () => {
        navigation.navigate('UploadPrescription');
    };

    const handleSearchTest = () => {
        const updatedTotal = calculateTotalCartValue(cartItems);  // Ensure total is correct

        navigation.navigate('BookTestSearch', { selectedPatientDetails, selectedTests: updatedCart, totalCartValue: updatedTotal });
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
            // const updateTotal = calculateTotalCartValue(updatedCartItems);
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
        if (cartItems.length === 0 && !imageUri) {
            Alert.alert("Error", "Please add at least one item to the cart or select an image.");
            return;
        }

        const state = await NetInfo.fetch();
        if (!state.isConnected) {
            Alert.alert(Constants.ALERT.TITLE.ERROR, Constants.VALIDATION_MSG.NO_INTERNET);
            return;
        }

        navigation.navigate('Calender', { selectedPatientDetails, totalCartValue, testData, selectedTests: cartItems });
    };

    const handleProceedClick = () => {
        if (updatedCart.length > 0) {
            const selectedTests = updatedCart.map(itemName => {
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

                    {/* Move the selected image above upload prescription */}
                    {imageBase64 && (
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: `data:image/png;base64,${imageBase64}` }}
                                style={styles.selectedImage}
                            />
                            <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
                                <Image source={require('../images/black_cross.png')} style={styles.crossIcon} />
                            </TouchableOpacity>
                        </View>
                    )}

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
        fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold
    },
    uploadContainer: {

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
    imageContainer: {
        position: 'relative',
        alignSelf: 'flex-end',
        paddingHorizontal: 10,
        marginTop: 10,
    },
    selectedImage: {
        width: 30,
        height: 30,
    },
    removeImageButton: {
        position: 'absolute',
        top: -5,
        right: 5,
        backgroundColor: Constants.COLOR.THEME_COLOR,
        borderRadius: 15,
        width: 10,
        height: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    crossIcon: {
        width: 5,
        height: 5,
        tintColor: 'white',
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



