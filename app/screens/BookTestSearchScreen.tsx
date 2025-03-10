import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Image, Modal, Alert, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Constants from '../util/Constants';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '../routes/Types';
import { useBookTestSearchMutation } from '../redux/service/BookTestSearchService';
import { useCart } from '../common/CartContext';
import { useNavigation } from '@react-navigation/native';
import SpinnerIndicator from '../common/SpinnerIndicator';
import { useDuplicateServiceBookingMutation } from '../redux/service/DuplicateServiceBookingService';
import { useUser } from '../common/UserContext';
import { useDispatch, useSelector } from 'react-redux';
import { updateSelectedTest } from '../redux/slice/BookTestSearchSlice';
import { useAppSettings } from '../common/AppSettingContext';
import { RootState } from '../redux/Store';


const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
type NavigationProp = StackNavigationProp<RootStackParamList, "BookTestSearchScreen">;


// const BookTestSearchScreen = ({ route }: any) => {
//     const dispatch = useDispatch();
//     const navigation = useNavigation<NavigationProp>();
//     const { selectedPatientDetails, serviceDetails, selectedTests = [] } = route.params;
//     const [testData, setTestData] = useState<any[]>([]);
//     const [searchText, setSearchText] = useState('');
//     const { settings } = useAppSettings();
//     const [errorMessage, setErrorMessage] = useState('');
//     const { cartItems, setCartItems, totalCartValue, setTotalCartValue, isModalVisible, setModalVisible } = useCart();
//     const [displayCartState, setDisplayCartState] = useState<{ [key: string]: boolean }>({});
//     const [previousCartItems, setPreviousCartItems] = useState<string[]>([]);
//     const [cartItemDetails, setCartItemDetails] = useState<Array<any>>([]);

//     const [searchTestAPIReq, { data: searchTestAPIRes, isLoading }] = useBookTestSearchMutation();
//     const [duplicateBookingServiceAPIReq] = useDuplicateServiceBookingMutation();

//     const labels = settings?.Message?.[0]?.Labels || {};


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
//             setErrorMessage('');
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
//                 setErrorMessage('');
//             } else {
//                 setErrorMessage('No data found.');
//             }
//         } else if (searchTestAPIRes?.SuccessFlag === "false") {
//             Alert.alert('Error', searchTestAPIRes?.ErrorMessage || 'Failed to fetch tests.');
//         }
//     }, [searchTestAPIRes, setTestData]);

//     const handleFocus = useCallback(() => {
//         const hasDuplicate = cartItems.some(item => previousCartItems.includes(item));
//         if (hasDuplicate) {
//             Alert.alert('Duplicate Selection', 'The selected data is the same as the previous selection.');
//         } else {
//             setDisplayCartState({});
//         }
//     }, [cartItems, previousCartItems]);

//     useEffect(() => {
//         const unsubscribe = navigation.addListener('focus', () => {
//             // Update the local state with the global cart state
//             setCartItems(cartItems);
//             setCartItemDetails(cartItemDetails);
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
//         const unsubscribe = navigation.addListener('blur', () => {
//             setPreviousCartItems([...cartItems]);
//         });
//         return unsubscribe;
//     }, [navigation, cartItems]);

//     useEffect(() => {
//         if (serviceDetails) {
//             // Update the cart with the passed service details
//             const updatedTests = [...selectedTests, ...serviceDetails];
//             dispatch(updateSelectedTest(updatedTests));
//         }
//     }, [serviceDetails, selectedTests, dispatch]);

//     const handleCross = () => navigation.goBack();

//     const checkDuplicateTest = async ({ item, cartArray }: any) => {
//         const payload = {
//             New_Service_Code: item.Service_Code,
//             Service_Reg_Data: cartArray.map((cartItem: { Service_Code: any; }) => ({
//                 Service_Code: cartItem.Service_Code,
//             })),
//         };
//         try {
//             const response = await duplicateBookingServiceAPIReq(payload).unwrap();
//             return { isDuplicate: response.IsDuplicate === "true", error: response.IsDuplicate === "true" ? { message: response.Message[0]?.Message || 'Duplicate test detected.' } : null };
//         } catch (error) {
//             return { isDuplicate: false, error: { message: 'Error checking for duplicates.' } };
//         }
//     };



//     // const handleToggleCart = async (itemName: string) => {
//     //     const item = testData.find((test: { Service_Name: string }) => test.Service_Name === itemName);
//     //     if (!item) return;

//     //     setCartItems(prevCartItems => {
//     //         const isItemInCart = prevCartItems.includes(itemName);
//     //         return isItemInCart ? prevCartItems.filter(name => name !== itemName) : [...prevCartItems, itemName];
//     //     });


//     //     setCartItemDetails(prevDetails => {
//     //         const newDetails = [...prevDetails]; // Ensure it's an array
//     //         const itemIndex = newDetails.findIndex(detail => detail.Service_Name === itemName);

//     //         if (itemIndex !== -1) {
//     //             newDetails.splice(itemIndex, 1); // Remove item if already in cart
//     //         } else {
//     //             newDetails.push(item); // Add item if not in cart
//     //         }
//     //         return newDetails;
//     //     });

//     //     setDisplayCartState(prevState => ({
//     //         ...prevState,
//     //         [itemName]: !prevState[itemName],
//     //     }));
//     // };

//     const handleToggleCart = async (itemName: string) => {
//         const item = testData.find((test: { Service_Name: string }) => test.Service_Name === itemName);
//         if (!item) return;

//         // Check if the item is already in the cart
//         const isItemInCart = cartItems.includes(itemName);

//         if (isItemInCart) {
//             // Remove the item from the cart
//             setCartItems(prevCartItems => prevCartItems.filter(name => name !== itemName));
//             setCartItemDetails(prevDetails => prevDetails.filter(detail => detail.Service_Name !== itemName));
//         } else {
//             // Check for duplicates before adding
//             const { isDuplicate, error } = await checkDuplicateTest({ item, cartArray: cartItemDetails });
//             if (isDuplicate) {
//                 Alert.alert('Duplicate Item', error.message || 'This item is already in the cart.');
//                 return;
//             }

//             // Add the item to the cart
//             setCartItems(prevCartItems => [...prevCartItems, itemName]);
//             setCartItemDetails(prevDetails => [...prevDetails, item]);
//         }

//         setDisplayCartState(prevState => ({
//             ...prevState,
//             [itemName]: !prevState[itemName],
//         }));
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
//             console.log("Cart Items before navigation:", cartItems);
//             console.log("Cart Items Details before navigation:", cartItemDetails);
//             console.log("Selected Tests before navigation:", selectedTests);

//             navigation.navigate('ChooseTest', {
//                 selectedTests,
//                 selectedPatientDetails,
//                 totalCartValue,
//                 testData,
//                 shouldNavigateToCalender: true,
//             });
//         } else {
//             Alert.alert('Empty Cart', 'Please add items to the cart before proceeding.');
//         }
//     };

//     const calculateTotalCartValue = useCallback(() => {
//         const total = cartItemDetails.reduce((total, item) => {
//             return total + (item?.Amount || 0);
//         }, 0);

//         setTotalCartValue(total);
//     }, [cartItemDetails, setTotalCartValue]);

//     useEffect(() => {
//         calculateTotalCartValue();
//     }, [cartItemDetails, testData]);

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
//                             {isItemInCart ? 'Remove' : 'Add Cart'}
//                         </Text>
//                     </View>
//                 </TouchableOpacity>
//             </View>
//         );
//     };





//     return (
//         <View style={styles.MainContainer}>
//             <View style={styles.searchTestView}>
//                 <Text style={styles.headerText}>Search Test</Text>
//                 <TouchableOpacity onPress={handleCross} style={styles.closeImageStyle}>
//                     <Image source={require('../images/black_cross.png')} />
//                 </TouchableOpacity>
//             </View>

//             <View style={styles.inputContainer}>
//                 <Image source={require('../images/search.png')} style={styles.searchIcon} />
//                 <TextInput
//                     style={styles.inputText}
//                     placeholder="Search"
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
//                                                             <Text style={{ fontSize: Constants.FONT_SIZE.SM, fontFamily: Constants.FONT_FAMILY.fontFamilyMedium, color: Constants.COLOR.WHITE_COLOR }}>Remove</Text>
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
//                                                 <Text style={styles.ButtonText}>Proceed</Text>
//                                             </View>
//                                         </TouchableOpacity>
//                                     )}
//                                     <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
//                                         <Text style={{ color: '#fd1a1b', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular }}>Note: *Indicates Non Discounted Test</Text>
//                                     </View>
//                                 </View>
//                             </View>
//                         </TouchableWithoutFeedback>
//                     </View>
//                 </TouchableWithoutFeedback>
//             </Modal>

//             {isLoading && (
//                 <View style={styles.spinnerContainer}>
//                     <SpinnerIndicator />
//                 </View>
//             )}

//             {errorMessage ? (
//                 <Text style={{ textAlign: 'center', marginTop: 20, color: 'red', fontSize: Constants.FONT_SIZE.M }}>
//                     {errorMessage}
//                 </Text>
//             ) : (
//                 <FlatList
//                     data={testData}
//                     keyExtractor={item => `${item.RowNumber || item.Service_Name}`}
//                     renderItem={renderItem}
//                     contentContainerStyle={styles.flatListContainer}
//                     ListEmptyComponent={() => (
//                         <Text style={{ textAlign: 'center', marginTop: 20, fontSize: Constants.FONT_SIZE.M, fontFamily: Constants.FONT_FAMILY.fontFamilyRegular }}>
//                             No tests found. Please try again.
//                         </Text>
//                     )}
//                 />
//             )}

//             {searchText.trim().length > 0 && (
//                 <View>
//                     <Text style={styles.bottomText}>Total Cart Value INR {totalCartValue}</Text>
//                     <TouchableOpacity onPress={handleProceedClick}>
//                         <View style={styles.SubmitButtonView}>
//                             <Text style={styles.ButtonText}>Proceed</Text>
//                         </View>
//                     </TouchableOpacity>
//                     <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
//                         <Text style={{ color: '#fd1a1b', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular }}>{getLabel('labtscr_3')}</Text>
//                     </View>
//                 </View>
//             )}
//         </View>
//     );
// };

// export default BookTestSearchScreen;



const BookTestSearchScreen = ({ route }: any) => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp>();
    const { selectedPatientDetails, serviceDetails, selectedTests = [] } = route.params;
    const [testData, setTestData] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    const { settings } = useAppSettings();
    const [errorMessage, setErrorMessage] = useState('');
    const { cartItems, setCartItems, totalCartValue, setTotalCartValue, isModalVisible, setModalVisible } = useCart();
    const [displayCartState, setDisplayCartState] = useState<{ [key: string]: boolean }>({});
    const [cartItemDetails, setCartItemDetails] = useState<Array<any>>(selectedTests || []);

    const [searchTestAPIReq, { data: searchTestAPIRes, isLoading }] = useBookTestSearchMutation();

    const labels = settings?.Message?.[0]?.Labels || {};

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
            setErrorMessage('');
        }
    }, [searchText, selectedPatientDetails, searchTestAPIReq, setTestData]);

    useEffect(() => {
        fetchTests();
    }, [fetchTests]);

    useEffect(() => {
        if (searchTestAPIRes?.SuccessFlag === "true" && searchTestAPIRes?.Message) {
            const newTests = searchTestAPIRes.Message;
            if (newTests.length > 0) {
                setTestData(newTests);
                setErrorMessage('');
            } else {
                setErrorMessage('No data found.');
            }
        } else if (searchTestAPIRes?.SuccessFlag === "false") {
            Alert.alert('Error', searchTestAPIRes?.ErrorMessage || 'Failed to fetch tests.');
        }
    }, [searchTestAPIRes, setTestData]);


    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setCartItems([...cartItems]);
            setCartItemDetails([...cartItemDetails]);
            setTotalCartValue(cartItemDetails.reduce((total, item) => total + (item?.Amount || 0), 0));

            setDisplayCartState(
                cartItems.reduce((acc, itemName) => {
                    acc[itemName] = true;
                    return acc;
                }, {})
            );
        });
        return unsubscribe;
    }, [navigation, cartItems, cartItemDetails]);


    useEffect(() => {
        if (serviceDetails) {
            const updatedTests = [...selectedTests, ...serviceDetails];
            dispatch(updateSelectedTest(updatedTests));
        }
    }, [serviceDetails, selectedTests, dispatch]);

    const handleCross = () => navigation.goBack();

    const handleToggleCart = (itemName: string) => {
        const item = testData.find(test => test.Service_Name === itemName);
        if (!item) return;

        setCartItems(prevCartItems => {
            const isItemInCart = prevCartItems.includes(itemName);
            let updatedCart = [];

            if (isItemInCart) {
                updatedCart = prevCartItems.filter(name => name !== itemName);
                setCartItemDetails(prevDetails => prevDetails.filter(detail => detail.Service_Code !== item.Service_Code));
            } else {
                updatedCart = [...prevCartItems, itemName];
                setCartItemDetails(prevDetails => {
                    if (prevDetails.some(cartItem => cartItem.Service_Code === item.Service_Code)) {
                        Alert.alert("Alert", `${item.Service_Name} is already in the cart.`);
                        return prevDetails;
                    }
                    return [...prevDetails, item];
                });
            }

            return updatedCart;
        });

        setDisplayCartState(prev => ({ ...prev, [itemName]: !prev[itemName] }));
        calculateTotalCartValue();
    };

    const handleProceedClick = () => {
        if (cartItems.length > 0) {
            const selectedTests = cartItemDetails.map(item => ({
                Service_Name: item.Service_Name || "Unknown",
                Amount: item.Amount ?? 0,
                Service_Code: item.Service_Code || "",
                Discount_Amount: item.Discount_Amount ?? 0,
                T_Bill_Amount: item.T_Bill_Amount ?? 0,
                T_Patient_Due: item.T_Patient_Due ?? 0,
            }));

            dispatch(updateSelectedTest(cartItemDetails));

            navigation.navigate('ChooseTest', {
                selectedTests,
                selectedPatientDetails,
                totalCartValue: cartItemDetails.reduce((total, item) => total + (item?.Amount || 0), 0), // Ensure correct value
                testData,
                shouldNavigateToCalender: true,
            });
        } else {
            Alert.alert('Empty Cart', 'Please add items to the cart before proceeding.');
        }
    };

    const calculateTotalCartValue = useCallback(() => {
        const total = cartItemDetails.reduce((total, item) => total + (item?.Amount || 0), 0);
        setTotalCartValue(total);
    }, [cartItemDetails]);

    useEffect(() => {
        calculateTotalCartValue();
    }, [cartItemDetails, testData, cartItems]);

    const handleCartIconClick = () => setModalVisible(true);

    const renderItem = ({ item }: any) => {
        const itemDetails = cartItemDetails.find(detail => detail.Service_Name === item.Service_Name) || item;
        const isItemInCart = cartItems.includes(item.Service_Name);

        return (
            <View style={styles.testItemContainer}>
                <Text style={styles.testName}>{itemDetails.Service_Name}</Text>
                <Text style={styles.testPrice}>{itemDetails.Amount ? `${itemDetails.Amount} INR` : 'N/A'}</Text>

                <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={() => handleToggleCart(item.Service_Name)}
                >
                    <View style={styles.addToCartContainer}>
                        <Image source={require('../images/addCart.png')} style={styles.CartIcon} />
                        <Text style={{ fontSize: Constants.FONT_SIZE.SM, fontFamily: Constants.FONT_FAMILY.fontFamilyMedium, color: Constants.COLOR.WHITE_COLOR }}>
                            {isItemInCart ? 'Remove' : 'Add Cart'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.MainContainer}>
            <View style={styles.searchTestView}>
                <Text style={styles.headerText}>Search Test</Text>
                <TouchableOpacity onPress={handleCross} style={styles.closeImageStyle}>
                    <Image source={require('../images/black_cross.png')} />
                </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
                <Image source={require('../images/search.png')} style={styles.searchIcon} />
                <TextInput
                    style={styles.inputText}
                    placeholder="Search"
                    placeholderTextColor="black"
                    value={searchText}
                    onChangeText={setSearchText}
                />
                {searchText.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchText('')}>
                        <Image source={require('../images/black_cross.png')} style={styles.CrossIconTop} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleCartIconClick}>
                    <Image source={require('../images/addCart.png')} style={styles.CartIconTop} />
                </TouchableOpacity>
                {cartItems.length > 0 && (
                    <View style={styles.notificationBadge}>
                        <Text style={styles.notificationBadgeText}>{cartItems.length}</Text>
                    </View>
                )}
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableWithoutFeedback>
                            <View style={styles.modalBackground}>
                                <View style={styles.modalContent}>
                                    {cartItemDetails.length === 0 ? (
                                        <View style={styles.emptyCartContainer}>
                                            <Text style={styles.emptyCartText}>Cart is Empty</Text>
                                        </View>
                                    ) : (
                                        cartItemDetails.map((item, index) => {
                                            return (
                                                <View style={styles.testItemContainer} key={index}>
                                                    <Text style={styles.testName}>{item?.Service_Name}</Text>
                                                    <Text style={styles.testPrice}>{item?.Amount} INR</Text>
                                                    <TouchableOpacity onPress={() => handleToggleCart(item.Service_Name)}>
                                                        <View style={styles.addToCartContainer}>
                                                            <Image source={require('../images/addCart.png')} style={styles.CartIcon} />
                                                            <Text style={{ fontSize: Constants.FONT_SIZE.SM, fontFamily: Constants.FONT_FAMILY.fontFamilyMedium, color: Constants.COLOR.WHITE_COLOR }}>Remove</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            );
                                        })
                                    )}
                                    <Text style={styles.bottomText}>Total Cart Value INR {totalCartValue}</Text>
                                    {cartItemDetails.length > 0 && (
                                        <TouchableOpacity onPress={handleProceedClick}>
                                            <View style={styles.SubmitButtonView}>
                                                <Text style={styles.ButtonText}>Proceed</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                                        <Text style={{ color: '#fd1a1b', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular }}>Note: *Indicates Non Discounted Test</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {isLoading ? (
                <View style={styles.spinnerContainer}>
                    <SpinnerIndicator />
                </View>
            ) : (
                <>
                    {testData.length === 0 ? (
                        <Text style={{ textAlign: 'center', marginTop: 20, fontSize: Constants.FONT_SIZE.M, fontFamily: Constants.FONT_FAMILY.fontFamilyRegular }}>
                            No tests found. Please try again.
                        </Text>
                    ) : (
                        <FlatList
                            data={testData}
                            keyExtractor={item => `${item.RowNumber || item.Service_Name}`}
                            renderItem={renderItem}
                            contentContainerStyle={styles.flatListContainer}
                        />
                    )}
                </>
            )}


            {searchText.trim().length > 0 && (
                <View>
                    <Text style={styles.bottomText}>Total Cart Value INR {totalCartValue}</Text>
                    <TouchableOpacity onPress={handleProceedClick}>
                        <View style={styles.SubmitButtonView}>
                            <Text style={styles.ButtonText}>Proceed</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                        <Text style={{ color: '#fd1a1b', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular }}>{getLabel('labtscr_3')}</Text>
                    </View>
                </View>
            )}
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
    CartIconTop: { marginVertical: 16, marginHorizontal: 25, width: deviceHeight / 50, height: deviceHeight / 50, alignSelf: 'center' },
    CrossIconTop: { marginVertical: 16, marginHorizontal: 10, width: deviceHeight / 50, height: deviceHeight / 50, alignSelf: 'center' },
    inputText: { marginHorizontal: 4, flex: 1, alignSelf: 'center', fontSize: Constants.FONT_SIZE.SM, fontFamily: Constants.FONT_FAMILY.fontFamilyRegular, padding: 6, color: 'black' },
    CartIcon: { marginLeft: 10, marginRight: 15, width: deviceHeight / 35, height: deviceHeight / 35, alignSelf: 'center', tintColor: Constants.COLOR.WHITE_COLOR },
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
    addToCartButton: { flexDirection: 'row', alignItems: 'center' },
    spinnerContainer: {flex:1,justifyContent:'center' },
    modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalBackground: { width: '100%', borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: 'white' },
    modalContent: { paddingVertical: 20, paddingHorizontal: 15, borderTopRightRadius: 30 },
    emptyCartContainer: { alignItems: 'center', justifyContent: 'center' },
    emptyCartText: { fontSize: Constants.FONT_SIZE.M, fontFamily: Constants.FONT_FAMILY.fontFamilyRegular },
    testItemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 },
    testName: { width: '40%', color: '#3C3636', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular },
    testPrice: { width: '20%', fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold, fontSize: Constants.FONT_SIZE.M },
    bottomText: { fontSize: Constants.FONT_SIZE.M, alignSelf: 'center', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular },
    SubmitButtonView: { borderRadius: 25, width: deviceWidth / 1.2, backgroundColor: Constants.COLOR.THEME_COLOR, marginTop: 16, alignSelf: 'center' },
    ButtonText: { color: Constants.COLOR.WHITE_COLOR, fontFamily: Constants.FONT_FAMILY.fontFamilyMedium, fontSize: Constants.FONT_SIZE.M, padding: 12, alignSelf: 'center' },
    addToCartContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: Constants.COLOR.THEME_COLOR, marginVertical: 10, padding: 6, borderRadius: 5, },
    flatListContainer: { paddingHorizontal: 10 },
});
