import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image, Alert, Dimensions, I18nManager, Modal } from 'react-native';
import { useBookTestSearchMutation } from '../redux/service/BookTestSearchService';
import SpinnerIndicator from '../common/SpinnerIndicator';
import Constants from '../util/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { useAppSettings } from '../common/AppSettingContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../routes/Types';
import { addToBooking, addToCart, removeFromBooking, removeFromCart, updateBookingDetails, updateSelectedTest } from '../redux/slice/BookTestSearchSlice';
import { useUser } from '../common/UserContext';

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
//     const { userData } = useUser();
//     const [searchText, setSearchText] = useState('');
//     const [testData, setTestData] = useState<any[]>([]);
//     const [isModalVisible, setModalVisible] = useState(false);
//     const { selectedPatientDetails, selectedTests = [], fromPaymentDetailsScreen, bookingDetails, patientData } = route.params;
//     const [cartItemDetails] = useState<Array<any>>(selectedTests);
//     const [searchTestAPIReq, { data: searchTestAPIRes, isLoading }] = useBookTestSearchMutation();
//     const selectedLanguage = useSelector((state: RootState) => state.appSettings.selectedLanguage) as Language | null;
//     const cartItems = useSelector((state: RootState) => state.bookTestSearch.updatedCartData);
//     const totalCartValue = useSelector((state: RootState) => state.bookTestSearch.totalCartValue);
//     const bookingItems = useSelector((state: RootState) => state.bookTestSearch.bookingDetails);
//     const totalBookingValue = useSelector((state: RootState) => state.bookTestSearch.totalBookingValue);

//     console.log('patientdataBookTestSearch', patientData);

//     const getLabel = (key: string) => labels[key]?.defaultMessage || '';

//     const fetchTests = useCallback(() => {
//         if (searchText.trim().length > 2) {
//             const requestBody = {
//                 App_Type: "R",
//                 Firm_No: userData?.Branch_Code,
//                 Service_Type: "T",
//                 Search_Text: searchText,
//                 Ref_Type: userData?.UserType,
//                 Ref_Code: userData?.UserCode,
//                 Coverage_Percent: "0",
//                 Offer_Amount: "1",
//                 Discount_Percentage: selectedPatientDetails?.Discount_Percentage,
//             };
//             searchTestAPIReq(requestBody);
//         } else {
//             setTestData([]);
//         }
//     }, [searchText, selectedPatientDetails, searchTestAPIReq]);

//     useEffect(() => {
//         I18nManager.forceRTL(selectedLanguage?.Alignment === 'rtl');
//     }, [selectedLanguage]);

//     useEffect(() => {
//         fetchTests();
//     }, [fetchTests]);

//     useEffect(() => {
//         if (searchTestAPIRes?.SuccessFlag === "true" && searchTestAPIRes?.Message) {
//             setTestData(searchTestAPIRes.Message);
//         } else if (searchTestAPIRes?.SuccessFlag === "false") {
//             Alert.alert('Error', searchTestAPIRes?.ErrorMessage || 'Failed to fetch tests.');
//         }
//     }, [searchTestAPIRes]);

//     useEffect(() => {
//         dispatch(updateSelectedTest(cartItemDetails));
//     }, [cartItemDetails, dispatch]);

//     useEffect(() => {
//         if (route.params?.selectedTests) {
//             dispatch(updateSelectedTest(route.params.selectedTests));
//         }
//     }, [route.params?.selectedTests, dispatch]);

//     useEffect(() => {
//         if (fromPaymentDetailsScreen && bookingDetails) {
//             dispatch(updateBookingDetails(bookingDetails.Service_Detail));
//         }
//     }, [fromPaymentDetailsScreen, bookingDetails, dispatch]);


//     useEffect(() => {
//         if (bookingItems.length > 0) {
//             dispatch(addToCart(bookingItems));
//         }
//     }, [bookingItems, dispatch]);

//     const handleToggleCart = (item: any) => {
//         const isAlreadyInCart = cartItems.some((cartItem: { Service_Code: any; }) => cartItem.Service_Code === item.Service_Code);
//         if (isAlreadyInCart) {
//             Alert.alert('Info', `${item.Service_Name} is already in the cart.`);
//         } else {
//             dispatch(addToCart(item));
//         }
//     };

//     const handleToggleBooking = (item: any) => {
//         const isAlreadyInBooking = bookingItems.some(bookingItem => bookingItem.Service_Code === item.Service_Code);
//         if (isAlreadyInBooking) {
//             Alert.alert('Info', `${item.Service_Name} is already in the booking.`);
//         } else {
//             dispatch(addToBooking(item));
//         }
//     };

//     const handleProceed = () => {
//         const items = fromPaymentDetailsScreen ? bookingItems : cartItems;
//         const totalValue = fromPaymentDetailsScreen ? totalBookingValue : totalCartValue;
//         if (items.length > 0) {
//             const selectedTests = items.map(item => ({
//                 Service_Name: item.Service_Name || "Unknown",
//                 Amount: item.Amount ?? 0,
//                 Service_Code: item.Service_Code || "",
//                 Discount_Amount: item.Discount_Amount ?? 0,
//                 T_Bill_Amount: item.T_Bill_Amount ?? 0,
//                 T_Patient_Due: item.T_Patient_Due ?? 0,
//             }));
//             dispatch(fromPaymentDetailsScreen ? updateBookingDetails(items) : updateSelectedTest(items));
//             navigation.navigate('ChooseTest', {
//                 selectedTests,
//                 selectedPatientDetails,
//                 totalCartValue: totalValue,
//                 testData,
//                 shouldNavigateToCalender: true,
//                 patientData,
//                 fromPaymentDetailsScreen: true
//             });
//             setModalVisible(false)
//         } else {
//             Alert.alert('Empty', `Please add items to the ${fromPaymentDetailsScreen ? 'booking' : 'cart'} before proceeding.`);
//         }
//     };

//     const renderItem = ({ item }: any) => {
//         const itemDetails = cartItemDetails.find(detail => detail.Service_Name === item.Service_Name) || item;
//         const isItemInCart = cartItems.some(cartItem => cartItem.Service_Code === item.Service_Code);
//         const isItemInBooking = bookingItems.some(bookingItem => bookingItem.Service_Code === item.Service_Code);

//         return (
//             <View style={styles.testItemContainer}>
//                 <Text style={styles.testName}>{itemDetails.Service_Name}</Text>
//                 <Text style={styles.testPrice}>{itemDetails.Amount ? `${itemDetails.Amount} INR` : 'N/A'}</Text>
//                 <TouchableOpacity
//                     style={[styles.addToCartButton, isItemInCart ? styles.removeButton : styles.addButton]}
//                     onPress={() => fromPaymentDetailsScreen ? handleToggleBooking(item) : handleToggleCart(item)}
//                 >
//                     <View style={styles.addToCartContainer}>
//                         <Image source={isItemInCart || isItemInBooking ? require('../images/removeCart.png') : require('../images/addCart.png')} style={styles.CartIcon} />
//                         <Text style={{ fontSize: Constants.FONT_SIZE.SM, fontFamily: Constants.FONT_FAMILY.fontFamilyMedium, color: Constants.COLOR.WHITE_COLOR }}>
//                             {(isItemInCart || isItemInBooking) ? getLabel('sealiscell_1') : getLabel('sealiscell_2')}
//                         </Text>
//                     </View>
//                 </TouchableOpacity>
//             </View>
//         );
//     };

//     const CartModal = () => (
//         <Modal
//             visible={isModalVisible}
//             transparent={true}
//             animationType="slide"
//             onRequestClose={() => setModalVisible(false)}
//         >
//             <View style={styles.modalContainer}>
//                 <View style={styles.modalContent}>
//                     <FlatList
//                         data={fromPaymentDetailsScreen ? bookingItems : cartItems}
//                         keyExtractor={(item) => item.Service_Code}
//                         renderItem={({ item }) => {
//                             const isItemInList = fromPaymentDetailsScreen ? bookingItems : cartItems;
//                             const isItemIn = isItemInList.some(listItem => listItem.Service_Code === item.Service_Code);
//                             return (
//                                 <View style={styles.cartItem}>
//                                     <Text style={styles.testName}>{item.Service_Name}</Text>
//                                     <Text style={styles.testPrice}>
//                                         {fromPaymentDetailsScreen ? (item.Service_Amount || item.Amount) : item.Amount} INR
//                                     </Text>
//                                     <TouchableOpacity
//                                         style={[styles.addToCartButton, isItemIn ? styles.removeButton : styles.addButton]}
//                                         onPress={() => dispatch(fromPaymentDetailsScreen ? removeFromBooking(item) : removeFromCart(item))}
//                                     >
//                                         <View style={styles.addToCartContainer}>
//                                             <Image source={isItemIn ? require('../images/removeCart.png') : require('../images/addCart.png')} style={styles.CartIcon} />
//                                             <Text style={{ fontSize: Constants.FONT_SIZE.SM, fontFamily: Constants.FONT_FAMILY.fontFamilyMedium, color: Constants.COLOR.WHITE_COLOR }}>
//                                                 {isItemIn ? getLabel('sealiscell_1') : getLabel('sealiscell_2')}
//                                             </Text>
//                                         </View>
//                                     </TouchableOpacity>
//                                 </View>
//                             );
//                         }}
//                         ListFooterComponent={
//                             <View>
//                                 <Text style={styles.bottomText}>Total Cart Value INR {fromPaymentDetailsScreen ? totalBookingValue : totalCartValue}</Text>
//                                 <TouchableOpacity style={styles.SubmitButtonView} onPress={handleProceed}>
//                                     <Text style={styles.ButtonText}>{getLabel('labtsrc_6')}</Text>
//                                 </TouchableOpacity>
//                                 <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
//                                     <Text style={{ color: '#fd1a1b', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular }}>{getLabel('labtsrc_7')}</Text>
//                                 </View>
//                             </View>
//                         }
//                     />
//                     <TouchableOpacity onPress={() => setModalVisible(false)}>
//                         <Image source={require('../images/black_cross.png')} style={styles.CrossIconTop} />
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </Modal>
//     );

//     return (
//         <View style={styles.MainContainer}>
//             <View style={styles.searchTestView}>
//                 <Text style={styles.headerText}>{getLabel('labtsrc_9')}</Text>
//                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeImageStyle}>
//                     <Image source={require('../images/black_cross.png')} />
//                 </TouchableOpacity>
//             </View>
//             <View style={styles.inputContainer}>
//                 <Image source={require('../images/search.png')} style={styles.searchIcon} />
//                 <TextInput
//                     style={[styles.inputText, { textAlign: (selectedLanguage?.Alignment ?? 'ltr') === 'rtl' ? 'right' : 'left' }]}
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
//                 {(cartItems.length > 0 || fromPaymentDetailsScreen) && (
//                     <View style={styles.notificationBadge}>
//                         <Text style={styles.notificationBadgeText}>{fromPaymentDetailsScreen ? bookingItems.length : cartItems.length}</Text>
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
//                         (cartItems.length > 0 || bookingItems.length > 0) ? (
//                             <View>
//                                 <Text style={styles.bottomText}>Total Cart Value INR {fromPaymentDetailsScreen ? totalBookingValue : totalCartValue}</Text>
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
//             <CartModal />
//         </View>
//     );
// };

// export default BookTestSearchScreen;


const BookTestSearchScreen = ({ route }: any) => {
    const dispatch = useDispatch();
    const navigation = useNavigation<NavigationProp>();
    const { labels } = useAppSettings();
    const { userData } = useUser();
    const [searchText, setSearchText] = useState('');
    const [testData, setTestData] = useState<any[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const { selectedPatientDetails, selectedTests = [], fromPaymentDetailsScreen, bookingDetails, patientData } = route.params;
    const [cartItemDetails] = useState<Array<any>>(selectedTests);
    const [searchTestAPIReq, { data: searchTestAPIRes, isLoading }] = useBookTestSearchMutation();
    const selectedLanguage = useSelector((state: RootState) => state.appSettings.selectedLanguage) as Language | null;
    const cartItems = useSelector((state: RootState) => state.bookTestSearch.updatedCartData);
    const totalCartValue = useSelector((state: RootState) => state.bookTestSearch.totalCartValue);
    const bookingItems = useSelector((state: RootState) => state.bookTestSearch.bookingDetails);
    const totalBookingValue = useSelector((state: RootState) => state.bookTestSearch.totalBookingValue);

    console.log('patientdataBookTestSearch', patientData);

    const getLabel = (key: string) => labels[key]?.defaultMessage || '';

    const fetchTests = useCallback(() => {
        if (searchText.trim().length > 2) {
            const requestBody = {
                App_Type: "R",
                Firm_No: userData?.Branch_Code,
                Service_Type: "T",
                Search_Text: searchText,
                Ref_Type: userData?.UserType,
                Ref_Code: userData?.UserCode,
                Coverage_Percent: "0",
                Offer_Amount: "1",
                Discount_Percentage: selectedPatientDetails?.Discount_Percentage,
            };
            searchTestAPIReq(requestBody);
        } else {
            setTestData([]);
        }
    }, [searchText, selectedPatientDetails, searchTestAPIReq]);

    useEffect(() => {
        I18nManager.forceRTL(selectedLanguage?.Alignment === 'rtl');
    }, [selectedLanguage]);

    useEffect(() => {
        fetchTests();
    }, [fetchTests]);

    useEffect(() => {
        if (searchTestAPIRes?.SuccessFlag === "true" && searchTestAPIRes?.Message) {
            setTestData(searchTestAPIRes.Message);
        } else if (searchTestAPIRes?.SuccessFlag === "false") {
            Alert.alert('Error', searchTestAPIRes?.ErrorMessage || 'Failed to fetch tests.');
        }
    }, [searchTestAPIRes]);

    useEffect(() => {
        dispatch(updateSelectedTest(cartItemDetails));
    }, [cartItemDetails, dispatch]);

    useEffect(() => {
        if (route.params?.selectedTests) {
            dispatch(updateSelectedTest(route.params.selectedTests));
        }
    }, [route.params?.selectedTests, dispatch]);

    useEffect(() => {
        if (fromPaymentDetailsScreen && bookingDetails) {
            dispatch(updateBookingDetails(bookingDetails.Service_Detail));
        }
    }, [fromPaymentDetailsScreen, bookingDetails, dispatch]);


    useEffect(() => {
        if (bookingItems.length > 0) {
            dispatch(addToCart(bookingItems));
        }
    }, [bookingItems, dispatch]);

    const handleToggleCart = (item: any) => {
        const isAlreadyInCart = cartItems.some((cartItem: { Service_Code: any; }) => cartItem.Service_Code === item.Service_Code);
        if (isAlreadyInCart) {
            Alert.alert('Info', `${item.Service_Name} is already in the cart.`);
        } else {
            dispatch(addToCart(item));
        }
    };

    const handleToggleBooking = (item: any) => {
        const isAlreadyInBooking = bookingItems.some(bookingItem => bookingItem.Service_Code === item.Service_Code);
        if (isAlreadyInBooking) {
            Alert.alert('Info', `${item.Service_Name} is already in the booking.`);
        } else {
            dispatch(addToBooking(item));
        }
    };

    const handleProceed = () => {
        const items = fromPaymentDetailsScreen ? bookingItems : cartItems;
        const totalValue = fromPaymentDetailsScreen ? totalBookingValue : totalCartValue;
        if (items.length > 0) {
            const selectedTests = items.map(item => ({
                Service_Name: item.Service_Name || "Unknown",
                Amount: item.Amount ?? 0,
                Service_Code: item.Service_Code || "",
                Discount_Amount: item.Discount_Amount ?? 0,
                T_Bill_Amount: item.T_Bill_Amount ?? 0,
                T_Patient_Due: item.T_Patient_Due ?? 0,
            }));
            dispatch(fromPaymentDetailsScreen ? updateBookingDetails(items) : updateSelectedTest(items));
            navigation.navigate('ChooseTest', {
                selectedTests,
                selectedPatientDetails,
                totalCartValue: totalValue,
                testData,
                shouldNavigateToCalender: true,
                patientData,
                fromPaymentDetailsScreen
            });
            setModalVisible(false)
        } else {
            Alert.alert('Empty', `Please add items to the ${fromPaymentDetailsScreen ? 'booking' : 'cart'} before proceeding.`);
        }
    };

    const renderItem = ({ item }: any) => {
        const itemDetails = cartItemDetails.find(detail => detail.Service_Name === item.Service_Name) || item;
        const isItemInCart = cartItems.some(cartItem => cartItem.Service_Code === item.Service_Code);
        const isItemInBooking = bookingItems.some(bookingItem => bookingItem.Service_Code === item.Service_Code);

        return (
            <View style={styles.testItemContainer}>
                <Text style={styles.testName}>{itemDetails.Service_Name}</Text>
                <Text style={styles.testPrice}>{itemDetails.Amount ? `${itemDetails.Amount} INR` : 'N/A'}</Text>
                <TouchableOpacity
                    style={[styles.addToCartButton, isItemInCart ? styles.removeButton : styles.addButton]}
                    onPress={() => fromPaymentDetailsScreen ? handleToggleBooking(item) : handleToggleCart(item)}
                >
                    <View style={styles.addToCartContainer}>
                        <Image source={isItemInCart || isItemInBooking ? require('../images/removeCart.png') : require('../images/addCart.png')} style={styles.CartIcon} />
                        <Text style={{ fontSize: Constants.FONT_SIZE.SM, fontFamily: Constants.FONT_FAMILY.fontFamilyMedium, color: Constants.COLOR.WHITE_COLOR }}>
                            {(isItemInCart || isItemInBooking) ? getLabel('sealiscell_1') : getLabel('sealiscell_2')}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    const CartModal = () => (
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <FlatList
                        data={fromPaymentDetailsScreen ? bookingItems : cartItems}
                        keyExtractor={(item) => item.Service_Code}
                        renderItem={({ item }) => {
                            const isItemInList = fromPaymentDetailsScreen ? bookingItems : cartItems;
                            const isItemIn = isItemInList.some(listItem => listItem.Service_Code === item.Service_Code);
                            return (
                                <View style={styles.cartItem}>
                                    <Text style={styles.testName}>{item.Service_Name}</Text>
                                    <Text style={styles.testPrice}>
                                        {fromPaymentDetailsScreen ? (item.Service_Amount || item.Amount) : item.Amount} INR
                                    </Text>
                                    <TouchableOpacity
                                        style={[styles.addToCartButton, isItemIn ? styles.removeButton : styles.addButton]}
                                        onPress={() => dispatch(fromPaymentDetailsScreen ? removeFromBooking(item) : removeFromCart(item))}
                                    >
                                        <View style={styles.addToCartContainer}>
                                            <Image source={isItemIn ? require('../images/removeCart.png') : require('../images/addCart.png')} style={styles.CartIcon} />
                                            <Text style={{ fontSize: Constants.FONT_SIZE.SM, fontFamily: Constants.FONT_FAMILY.fontFamilyMedium, color: Constants.COLOR.WHITE_COLOR }}>
                                                {isItemIn ? getLabel('sealiscell_1') : getLabel('sealiscell_2')}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            );
                        }}
                        ListFooterComponent={
                            <View>
                                <Text style={styles.bottomText}>Total Cart Value INR {fromPaymentDetailsScreen ? totalBookingValue : totalCartValue}</Text>
                                <TouchableOpacity style={styles.SubmitButtonView} onPress={handleProceed}>
                                    <Text style={styles.ButtonText}>{getLabel('labtsrc_6')}</Text>
                                </TouchableOpacity>
                                <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                                    <Text style={{ color: '#fd1a1b', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular }}>{getLabel('labtsrc_7')}</Text>
                                </View>
                            </View>
                        }
                    />
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Image source={require('../images/black_cross.png')} style={styles.CrossIconTop} />
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.MainContainer}>
            <View style={styles.searchTestView}>
                <Text style={styles.headerText}>{getLabel('labtsrc_9')}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeImageStyle}>
                    <Image source={require('../images/black_cross.png')} />
                </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
                <Image source={require('../images/search.png')} style={styles.searchIcon} />
                <TextInput
                    style={[styles.inputText, { textAlign: (selectedLanguage?.Alignment ?? 'ltr') === 'rtl' ? 'right' : 'left' }]}
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
                {(cartItems.length > 0 || fromPaymentDetailsScreen) && (
                    <View style={styles.notificationBadge}>
                        <Text style={styles.notificationBadgeText}>{fromPaymentDetailsScreen ? bookingItems.length : cartItems.length}</Text>
                    </View>
                )}
            </View>
            {isLoading ? (
                <SpinnerIndicator />
            ) : (
                <FlatList
                    data={testData}
                    keyExtractor={item => item.Service_Code}
                    renderItem={renderItem}
                    contentContainerStyle={styles.flatListContainer}
                    ListFooterComponent={
                        (cartItems.length > 0 || bookingItems.length > 0) ? (
                            <View>
                                <Text style={styles.bottomText}>Total Cart Value INR {fromPaymentDetailsScreen ? totalBookingValue : totalCartValue}</Text>
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
            <CartModal />
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
    CartIcon: { resizeMode: 'contain', width: deviceHeight / 35, height: deviceHeight / 35, tintColor: Constants.COLOR.WHITE_COLOR, alignItems: 'center', },
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
    addToCartButton: { marginTop: 10, borderRadius: 5, width: '40%', },
    modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: {
        backgroundColor: 'white',
        paddingVertical: 20, paddingHorizontal: 15, borderTopRightRadius: 30, borderTopLeftRadius: 30
    },
    testItemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 },
    testName: { width: '45%', color: '#3C3636', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular },
    testPrice: { width: '15%', fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold, fontSize: Constants.FONT_SIZE.M },
    bottomText: { fontSize: Constants.FONT_SIZE.M, alignSelf: 'center', fontFamily: Constants.FONT_FAMILY.fontFamilyRegular },
    SubmitButtonView: { borderRadius: 25, width: deviceWidth / 1.2, backgroundColor: Constants.COLOR.THEME_COLOR, marginTop: 16, alignSelf: 'center' },
    ButtonText: { color: Constants.COLOR.WHITE_COLOR, fontFamily: Constants.FONT_FAMILY.fontFamilyMedium, fontSize: Constants.FONT_SIZE.M, padding: 12, alignSelf: 'center' },
    addToCartContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: Constants.COLOR.THEME_COLOR, marginVertical: 10, padding: 6, borderRadius: 5, },
    flatListContainer: { paddingHorizontal: 10, },
    addButton: { flex: 1 },
    removeButton: { flex: 1 },
});
