import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Image, Modal, Alert, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import Constants from '../util/Constants';
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from '../routes/Types';
import { useBookTestSearchMutation } from '../redux/service/BookTestSearchService';
import { useCart } from '../common/CartContext';
import { useNavigation } from '@react-navigation/native';
import SpinnerIndicator from '../common/SpinnerIndicator';
import { useDuplicateServiceBookingMutation } from '../redux/service/DuplicateServiceBookingService';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
type NavigationProp = StackNavigationProp<RootStackParamList, "BookTestSearchScreen">;


// const BookTestSearchScreen = ({ route }: any) => {
//     const navigation = useNavigation<NavigationProp>();
//     const { selectedPatientDetails } = route.params;
//     const [searchText, setSearchText] = useState('');
//     const [testData, setTestData] = useState<any[]>([]);
//     const [errorMessage, setErrorMessage] = useState('');
//     const { cartItems, setCartItems, totalCartValue, setTotalCartValue, isModalVisible, setModalVisible } = useCart();
//     console.log('cartItems', cartItems);
//     console.log('testData', testData);

//     // API request hook
//     const [searchTestAPIReq, { data: searchTestAPIRes, isLoading }] = useBookTestSearchMutation();

//     useEffect(() => {
//         if (searchText.trim().length > 2) {

//             const refType = selectedPatientDetails?.Ref_Type;
//             const refCode = selectedPatientDetails?.Ref_Code;
//             const discount_percentage = selectedPatientDetails?.Discount_Percentage;

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
//             console.log('API Response:', searchTestAPIRes);
//             if (searchTestAPIRes.Message.length > 0) {
//                 setTestData(searchTestAPIRes.Message);
//                 setErrorMessage('');
//             } else {
//                 setErrorMessage('No data found.');
//             }
//         } else if (searchTestAPIRes?.SuccessFlag === "false") {
//             console.error('API Error:', searchTestAPIRes?.ErrorMessage);
//             Alert.alert('Error', searchTestAPIRes?.ErrorMessage || 'Failed to fetch tests.');
//         }
//     }, [searchTestAPIRes]);

//     const handleCross = () => navigation.goBack();

//     const handleProceedClick = () => {
//         if (cartItems.length > 0) {
//             const selectedTests = cartItems.map(itemName => {
//                 const item = testData.find(test => test.Service_Name === itemName);
//                 return {
//                     Service_Name: item?.Service_Name,
//                     Amount: item?.Amount,
//                 };
//             });
//             console.log("Selected Tests:", selectedTests);
//             navigation.navigate('ChooseTest', { selectedTests, selectedPatientDetails, totalCartValue, shouldNavigateToCalender: true, testData });
//         } else {
//             Alert.alert('Empty Cart', 'Please add items to the cart before proceeding.');
//         }
//     };

//     const handleToggleCart = (itemName: string) => {
//         setCartItems(prevCartItems =>
//             prevCartItems.includes(itemName)
//                 ? prevCartItems.filter(item => item !== itemName)
//                 : [...prevCartItems, itemName]
//         );
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
//                         <Text>{isItemInCart ? 'Remove' : 'Add Cart'}</Text>
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
//                         <Image
//                             source={require('../images/black_cross.png')}
//                             style={styles.CrossIconTop}
//                         />
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
//                                     {cartItems.length === 0 ? (
//                                         <View style={styles.emptyCartContainer}>
//                                             <Text style={styles.emptyCartText}>Cart is Empty</Text>
//                                         </View>
//                                     ) : (
//                                         cartItems.map((item, index) => {
//                                             const itemData = testData.find(
//                                                 test => test.Service_Name === item
//                                             );
//                                             return (
//                                                 <View style={styles.testItemContainer} key={index}>
//                                                     <Text style={styles.testName}>{item}</Text>
//                                                     <Text style={styles.testPrice}>
//                                                         {itemData?.Amount} INR
//                                                     </Text>
//                                                     <TouchableOpacity
//                                                         onPress={() => handleToggleCart(item)}
//                                                     >
//                                                         <View style={styles.addToCartContainer}>
//                                                             <Image
//                                                                 source={require('../images/addCart.png')}
//                                                                 style={styles.CartIcon}
//                                                             />
//                                                             <Text>Remove</Text>
//                                                         </View>
//                                                     </TouchableOpacity>
//                                                 </View>
//                                             );
//                                         })
//                                     )}
//                                     <Text style={styles.bottomText}>
//                                         Total Cart Value INR {totalCartValue}
//                                     </Text>
//                                     {cartItems.length > 0 && (
//                                         <TouchableOpacity onPress={handleProceedClick}>
//                                             <View style={styles.SubmitButtonView}>
//                                                 <Text style={styles.ButtonText}>Proceed</Text>
//                                             </View>
//                                         </TouchableOpacity>
//                                     )}
//                                     <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
//                                         <Text style={{ color: '#fd1a1b' }}>
//                                             Note: *Indicates Non Discounted Test
//                                         </Text>
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
//                         <Text
//                             style={{
//                                 textAlign: 'center',
//                                 marginTop: 20,
//                                 color: 'gray',
//                                 fontSize: Constants.FONT_SIZE.M,
//                             }}
//                         >
//                             No tests found. Please try again.
//                         </Text>
//                     )}
//                 />
//             )}

//             {searchText.trim().length > 0 && (
//                 <View>
//                     <Text style={styles.bottomText}>
//                         Total Cart Value INR {totalCartValue}
//                     </Text>
//                     <TouchableOpacity onPress={handleProceedClick}>
//                         <View style={styles.SubmitButtonView}>
//                             <Text style={styles.ButtonText}>Proceed</Text>
//                         </View>
//                     </TouchableOpacity>
//                     <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
//                         <Text style={{ color: '#fd1a1b' }}>
//                             Note: *Indicates Non Discounted Test
//                         </Text>
//                     </View>
//                 </View>
//             )}
//         </View>
//     );
// };

// export default BookTestSearchScreen;





const BookTestSearchScreen = ({ route }: any) => {
    const navigation = useNavigation<NavigationProp>();
    const { selectedPatientDetails } = route.params;
    const [searchText, setSearchText] = useState('');
    const [testData, setTestData] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState('');
    const { cartItems, setCartItems, totalCartValue, setTotalCartValue, isModalVisible, setModalVisible } = useCart();
    const [displayCartState, setDisplayCartState] = useState<{ [key: string]: boolean }>({});
    const [previousCartItems, setPreviousCartItems] = useState<string[]>([]);
    const [isFirstSelection, setIsFirstSelection] = useState(true);

    console.log('cartitemssssssss', cartItems)
    console.log('previousCartItems', previousCartItems)


    const [searchTestAPIReq, { data: searchTestAPIRes, isLoading }] = useBookTestSearchMutation();
    const [duplicateBookingServiceAPIReq, { data: duplicateBookingServiceAPIRes }] = useDuplicateServiceBookingMutation();

    useEffect(() => {
        if (searchText.trim().length > 2) {
            const refType = selectedPatientDetails?.Ref_Type;
            const refCode = selectedPatientDetails?.Ref_Code;
            const discount_percentage = selectedPatientDetails?.Discount_Percentage;

            const requestBody = {
                App_Type: "R",
                Service_Type: "T",
                Search_Text: searchText,
                Ref_Type: refType,
                Ref_Code: refCode,
                Coverage_Percent: "0",
                Offer_Amount: "1",
                Discount_Percentage: discount_percentage,
            };
            searchTestAPIReq(requestBody);
        } else {
            setTestData([]);
            setErrorMessage('');
        }
    }, [searchText]);

    useEffect(() => {
        if (searchTestAPIRes?.SuccessFlag === "true" && searchTestAPIRes?.Message) {
            if (searchTestAPIRes.Message.length > 0) {
                setTestData(searchTestAPIRes.Message);
                setErrorMessage('');
            } else {
                setErrorMessage('No data found.');
            }
        } else if (searchTestAPIRes?.SuccessFlag === "false") {
            Alert.alert('Error', searchTestAPIRes?.ErrorMessage || 'Failed to fetch tests.');
        }
    }, [searchTestAPIRes]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Check for duplicate data when the screen gains focus
            const hasDuplicate = cartItems.some(item =>
                previousCartItems.includes(item)
            );

            if (hasDuplicate) {
                Alert.alert('Duplicate Selection', 'The selected data is the same as the previous selection.');
            } else {
                // Perform actions if the data is not duplicate
                setDisplayCartState({});
                setIsFirstSelection(false); // Mark as subsequent selection
            }
        });

        return unsubscribe;
    }, [navigation, previousCartItems, cartItems]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            setPreviousCartItems([...cartItems]);
        });
        return unsubscribe;
    }, [navigation, cartItems]);

    const handleCross = () => navigation.goBack();

    //sample
    // const handleProceedClick = async () => {
    //     if (cartItems.length > 0) {
    //         const selectedTests = cartItems.map(itemName => {
    //             const item = testData.find(test => test.Service_Name === itemName);
    //             return {
    //                 Service_Name: item?.Service_Name,
    //                 Amount: item?.Amount,
    //                 Service_Code: item?.Service_Code, // Assuming Service_Code is available in testData
    //             };
    //         });

    //         // Prepare the request body for the duplicate booking check
    //         const requestBody = {
    //             New_Service_Code: "000233",
    //             Service_Reg_Data: selectedTests.map(test => ({ Service_Code: test.Service_Code })),
    //         };

    //         // Call the duplicate booking API
    //         const response = await duplicateBookingServiceAPIReq(requestBody);

    //         if (response.data?.SuccessFlag === "true" && response.data?.IsDuplicate === "true") {
    //             // Show an alert if duplicates are found
    //             Alert.alert('Duplicate Booking', response.data.Message[0].Message);
    //         } else {
    //             // Proceed with navigation if no duplicates are found
    //             navigation.navigate('ChooseTest', { selectedTests, selectedPatientDetails, totalCartValue, shouldNavigateToCalender: true, testData });
    //         }
    //     } else {
    //         Alert.alert('Empty Cart', 'Please add items to the cart before proceeding.');
    //     }
    // };


    // const handleToggleCart = async (itemName: string) => {
    //     const item = testData.find(test => test.Service_Name === itemName);

    //     if (item) {
    //         // Check if the item is already in the cart
    //         if (cartItems.includes(itemName)) {
    //             // Remove the item from the cart without duplicate check
    //             setCartItems(prevCartItems =>
    //                 prevCartItems.filter(item => item !== itemName)
    //             );
    //             setDisplayCartState(prevState => ({
    //                 ...prevState,
    //                 [itemName]: !prevState[itemName],
    //             }));
    //         } else {
    //             // Perform duplicate check only if it's not the first selection
    //             if (!isFirstSelection) {
    //                 // Prepare the request body for the duplicate booking check
    //                 const requestBody = {
    //                     New_Service_Code: "000233",
    //                     Service_Reg_Data: [{ Service_Code: item.Service_Code }],
    //                 };

    //                 console.log('Duplicate Check Request Body:', requestBody);

    //                 // Call the duplicate booking API
    //                 const response = await duplicateBookingServiceAPIReq(requestBody);

    //                 console.log('Duplicate Check Response:', response);

    //                 if (response.data?.SuccessFlag === "true" && response.data?.IsDuplicate === "true") {
    //                     // Show an alert if duplicates are found
    //                     Alert.alert('Duplicate Booking', response.data.Message[0]?.Message || 'Duplicate booking detected.');
    //                     return;
    //                 }
    //             }

    //             // Proceed with adding the item to the cart if no duplicates are found
    //             setCartItems(prevCartItems => [...prevCartItems, itemName]);
    //             setDisplayCartState(prevState => ({
    //                 ...prevState,
    //                 [itemName]: !prevState[itemName],
    //             }));
    //         }
    //     }
    // };

    //works in local
    // const checkDuplicateTest = ({ item, cartArray }: any) => {
    //     const isDuplicate = cartArray.some((cartItem: { Service_Code: any; }) => cartItem.Service_Code === item.Service_Code);
    //     return { isDuplicate, error: isDuplicate ? { message: 'Duplicate test detected.' } : null };
    // };

    // const handleProceedClick = async () => {
    //     if (cartItems.length > 0) {
    //         const selectedTests = cartItems.map(itemName => {
    //             const item = testData.find(test => test.Service_Name === itemName);
    //             return {
    //                 Service_Name: item?.Service_Name,
    //                 Amount: item?.Amount,
    //                 Service_Code: item?.Service_Code || "",
    //             };
    //         });

    //         navigation.navigate('ChooseTest', { selectedTests, selectedPatientDetails, totalCartValue, shouldNavigateToCalender: true, testData });
    //     } else {
    //         Alert.alert('Empty Cart', 'Please add items to the cart before proceeding.');
    //     }
    // };

    // const handleToggleCart = async (itemName: any) => {
    //     const item = testData.find(test => test.Service_Name === itemName);
    //     if (!item) return;

    //     // Check for duplicates against the existing cart before adding
    //     const response = checkDuplicateTest({
    //         item: { ...item, Service_Code: item.Service_Code || "" },
    //         cartArray: cartItems.map(name => {
    //             const cartItem = testData.find(test => test.Service_Name === name);
    //             return cartItem ? { ...cartItem, Service_Code: cartItem.Service_Code || "" } : null;
    //         }).filter(Boolean),
    //     });

    //     if (response?.isDuplicate) {
    //         Alert.alert('Duplicate Booking', response.error?.message || 'Duplicate test detected.');
    //         return;
    //     }

    //     setCartItems(prevCartItems => [...prevCartItems, itemName]);
    //     setDisplayCartState(prevState => ({
    //         ...prevState,
    //         [itemName]: !prevState[itemName],
    //     }));
    // };

    //works in api
    const checkDuplicateTest = async ({ item, cartArray }:any) => {
        const payload = {
            New_Service_Code: item.Service_Code,
            Service_Reg_Data: cartArray.map(cartItem => ({
                Service_Code: cartItem.Service_Code,
            })),
        };
        console.log("API Payload:", payload); 
        try {
            const response = await duplicateBookingServiceAPIReq(payload).unwrap();
            console.log("API Response:", response); 

            const isDuplicate = response.IsDuplicate === "true";
            return { isDuplicate, error: isDuplicate ? { message: response.Message[0]?.Message || 'Duplicate test detected.' } : null };
        } catch (error) {
            console.error("API Error:", error); 
            return { isDuplicate: false, error: { message: 'Error checking for duplicates.' } };
        }
    };

    const handleToggleCart = async (itemName:any) => {
        console.log("Item to add:", itemName); 
        const item = testData.find(test => test.Service_Name === itemName);
        if (!item) {
            console.error("Item not found in testData");
            return;
        }

        const cartItemsForCheck = cartItems.map(name => {
            const cartItem = testData.find(test => test.Service_Name === name);
            return cartItem ? { ...cartItem, Service_Code: cartItem.Service_Code || "" } : null;
        }).filter(Boolean);

        console.log("Cart items for check:", cartItemsForCheck);
        try {
            const response = await checkDuplicateTest({
                item: { ...item, Service_Code: item.Service_Code || "" },
                cartArray: cartItemsForCheck,
            });

            if (response?.isDuplicate) {
                Alert.alert('Duplicate Booking', response.error?.message || 'Duplicate test detected.');
                return;
            }

            console.log("Adding item to cart:", itemName);
            setCartItems(prevCartItems => [...prevCartItems, itemName]);
            setDisplayCartState(prevState => ({
                ...prevState,
                [itemName]: !prevState[itemName],
            }));
        } catch (error) {
            console.error("Error in handleToggleCart:", error);
            Alert.alert('Error', 'An error occurred while adding the item to the cart.');
        }
    };

    const handleProceedClick = async () => {
        if (cartItems.length > 0) {
            const selectedTests = cartItems.map(itemName => {
                const item = testData.find(test => test.Service_Name === itemName);
                return {
                    Service_Name: item?.Service_Name,
                    Amount: item?.Amount,
                    Service_Code: item?.Service_Code || "",
                };
            });

            navigation.navigate('ChooseTest', { selectedTests, selectedPatientDetails, totalCartValue, shouldNavigateToCalender: true, testData });
        } else {
            Alert.alert('Empty Cart', 'Please add items to the cart before proceeding.');
        }
    };


    const calculateTotalCartValue = () => {
        const total = cartItems.reduce((total, itemName) => {
            const item = testData.find(test => test.Service_Name === itemName);
            return total + (item?.Amount || 0);
        }, 0);
        setTotalCartValue(total);
    };

    useEffect(() => {
        calculateTotalCartValue();
    }, [cartItems, testData]);

    const handleCartIconClick = () => {
        setModalVisible(true);
    };

    const renderItem = ({ item }: any) => {
        const isItemInCart = cartItems.includes(item.Service_Name);
        const displayRemove = displayCartState[item.Service_Name] || false;

        return (
            <View style={styles.testItemContainer}>
                <Text style={styles.testName}>{item.Service_Name}</Text>
                <Text style={styles.testPrice}>{item.Amount} INR</Text>
                <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={() => handleToggleCart(item.Service_Name)}
                >
                    <View style={styles.addToCartContainer}>
                        <Image
                            source={require('../images/addCart.png')}
                            style={styles.CartIcon}
                        />
                        <Text>{displayRemove ? 'Remove' : 'Add Cart'}</Text>
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
                        <Image
                            source={require('../images/black_cross.png')}
                            style={styles.CrossIconTop}
                        />
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
                                    {cartItems.length === 0 ? (
                                        <View style={styles.emptyCartContainer}>
                                            <Text style={styles.emptyCartText}>Cart is Empty</Text>
                                        </View>
                                    ) : (
                                        cartItems.map((item, index) => {
                                            const itemData = testData.find(
                                                test => test.Service_Name === item
                                            );
                                            return (
                                                <View style={styles.testItemContainer} key={index}>
                                                    <Text style={styles.testName}>{item}</Text>
                                                    <Text style={styles.testPrice}>
                                                        {itemData?.Amount} INR
                                                    </Text>
                                                    <TouchableOpacity
                                                        onPress={() => handleToggleCart(item)}
                                                    >
                                                        <View style={styles.addToCartContainer}>
                                                            <Image
                                                                source={require('../images/addCart.png')}
                                                                style={styles.CartIcon}
                                                            />
                                                            <Text>Remove</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            );
                                        })
                                    )}
                                    <Text style={styles.bottomText}>
                                        Total Cart Value INR {totalCartValue}
                                    </Text>
                                    {cartItems.length > 0 && (
                                        <TouchableOpacity onPress={handleProceedClick}>
                                            <View style={styles.SubmitButtonView}>
                                                <Text style={styles.ButtonText}>Proceed</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                    <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                                        <Text style={{ color: '#fd1a1b' }}>
                                            Note: *Indicates Non Discounted Test
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {isLoading && (
                <View style={styles.spinnerContainer}>
                    <SpinnerIndicator />
                </View>
            )}

            {errorMessage ? (
                <Text style={{ textAlign: 'center', marginTop: 20, color: 'red', fontSize: Constants.FONT_SIZE.M }}>
                    {errorMessage}
                </Text>
            ) : (
                <FlatList
                    data={testData}
                    keyExtractor={item => `${item.RowNumber || item.Service_Name}`}
                    renderItem={renderItem}
                    contentContainerStyle={styles.flatListContainer}
                    ListEmptyComponent={() => (
                        <Text
                            style={{
                                textAlign: 'center',
                                marginTop: 20,
                                color: 'gray',
                                fontSize: Constants.FONT_SIZE.M,
                            }}
                        >
                            No tests found. Please try again.
                        </Text>
                    )}
                />
            )}

            {searchText.trim().length > 0 && (
                <View>
                    <Text style={styles.bottomText}>
                        Total Cart Value INR {totalCartValue}
                    </Text>
                    <TouchableOpacity onPress={handleProceedClick}>
                        <View style={styles.SubmitButtonView}>
                            <Text style={styles.ButtonText}>Proceed</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                        <Text style={{ color: '#fd1a1b' }}>
                            Note: *Indicates Non Discounted Test
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};

export default BookTestSearchScreen;










const styles = StyleSheet.create({
    MainContainer:
    {
        flex: 1,
        backgroundColor: Constants.COLOR.LAB_SEARCH_SCREEN_BG
    },
    searchTestView: {
        flexDirection: 'row',
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    headerText: {
        flex: 1,
        alignSelf: 'center',
        fontSize: Constants.FONT_SIZE.L,
        color: 'black'
    },
    closeImageStyle: {
        width: deviceHeight / 35,
        height: deviceHeight / 35,
        right: 10
    },
    inputContainer:
    {
        flexDirection: 'row',
        marginVertical: 16,
        backgroundColor: "white",
    },
    searchIcon: {
        marginVertical: 16,
        width: deviceHeight / 50,
        height: deviceHeight / 50,
        alignSelf: 'center',
        marginLeft: 8,
    },
    CartIconTop: {
        marginVertical: 16,
        marginHorizontal: 10,
        width: deviceHeight / 50,
        height: deviceHeight / 50,
        alignSelf: 'center',
    },
    CrossIconTop: {
        marginVertical: 16,
        marginHorizontal: 10,
        width: deviceHeight / 50,
        height: deviceHeight / 50,
        alignSelf: 'center',
    },
    inputText: {
        marginHorizontal: 4,
        flex: 1,
        alignSelf: 'center',
        fontSize: Constants.FONT_SIZE.M,
        padding: 6,
        color: 'black'
    },
    CartIcon: {
        marginLeft: 10,
        marginRight: 15,
        width: deviceHeight / 35,
        height: deviceHeight / 35,
        alignSelf: 'center',
    },
    CrossIcon: {
        marginRight: 15,
        width: deviceHeight / 60,
        height: deviceHeight / 60,
        alignSelf: 'center',
    },
    notificationBadge: {
        right: 15,
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationBadgeText: {
        color: 'white',
        fontSize: Constants.FONT_SIZE.S,
    },
    addToCartButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    spinnerContainer: { position: 'absolute', top: '30%', left: '50%', transform: [{ translateX: -25 }, { translateY: -25 }] },
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
        // borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        // backgroundColor: 'white',
    },
    emptyCartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyCartText: { fontSize: Constants.FONT_SIZE.M, color: 'gray' },
    testItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    testName: {
        width: '40%',
        color: '#686868',
    },
    testPrice: { fontWeight: 'bold', width: '20%' },
    bottomText: {
        fontSize: Constants.FONT_SIZE.L,
        color: Constants.COLOR.BLACK_COLOR,
        alignSelf: 'center',
    },
    SubmitButtonView: {
        borderRadius: 20,
        width: deviceWidth / 1.2,
        backgroundColor: Constants.COLOR.THEME_COLOR,
        marginTop: 16,
        alignSelf: 'center',
    },
    ButtonText: {
        color: Constants.COLOR.WHITE_COLOR,
        padding: 12,
        alignSelf: 'center',
    },
    addToCartContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 5,
        borderColor: '#bcc0c7',
        marginVertical: 10,
        padding: 4,
        borderRadius: 5,
    },
    flatListContainer: {
        paddingHorizontal: 10,
    },
});
