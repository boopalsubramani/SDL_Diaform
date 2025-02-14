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
                // const item = testData.find((test: { Service_Name: string; }) => test.Service_Name === itemName);
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
        return cartItems.map((item, index) => {
            const itemData = testData.find((test: { Service_Name: string; }) => test.Service_Name === item);
            return (
                <View style={styles.testItemContainer} key={index}>
                    <Text style={styles.testName}>{item}</Text>
                    <Text style={styles.testPrice}>{itemData?.Amount} INR</Text>
                    <TouchableOpacity onPress={() => handleToggleCart(item)}>
                        <View style={styles.addToCartContainer}>
                            <Image source={require('../images/addCart.png')} style={styles.CartIcon} />
                            <Text>Remove</Text>
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
                            <Image source={require('../images/addCart.png')} style={styles.CartIcon} />
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
                                        {cartItems.length > 0 && (
                                            <TouchableOpacity onPress={handleProceedClick}>
                                                <View style={styles.SubmitButtonView}>
                                                    <Text style={styles.ButtonText}>{getLabel('labtscr_2')}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                        <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                                            <Text style={{ color: '#fd1a1b' }}>{getLabel('labtscr_3')}</Text>
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
        backgroundColor: '#FBFBFB',
    },
    innerContainer: {
        flex: 1,
        backgroundColor: Constants.COLOR.LAB_SEARCH_SCREEN_BG,
    },
    ChooseTestView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    chooseTestText: {
        flex: 1,
        fontSize: Constants.FONT_SIZE.L,
        alignSelf: 'center',
        color: 'black',
    },
    cartValueView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cartValueLabel: {
        color: '#B1BE95',
        marginRight: 10,
        fontSize: Constants.FONT_SIZE.XS,
    },
    cartValue: {
        color: '#3B61A6',
        fontSize: Constants.FONT_SIZE.M,
    },
    searchCartView: {
        marginTop: 10,
        marginHorizontal: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        borderRadius: 10,
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
    CartIcon: {
        width: deviceHeight / 35,
        height: deviceHeight / 35,
        alignSelf: 'center',
        marginLeft: 20,
        marginRight: 25,
    },
    searchLabel: {
        fontSize: Constants.FONT_SIZE.SM,
        alignSelf: 'center',
        paddingHorizontal: 20,
        color: 'black',
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
        right: 20,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationBadgeText: {
        color: 'white',
        fontSize: Constants.FONT_SIZE.S,
        fontWeight: 'bold',
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
        backgroundColor: '#E8ECF2',
        flexDirection: 'row',
        alignSelf: 'flex-end',
        justifyContent: 'center',
    },
    uploadImage: {
        width: deviceHeight / 35,
        height: deviceHeight / 35,
        alignSelf: 'center',
    },
    uploadText: {
        color: '#2C579F',
        marginLeft: 10,
        alignSelf: 'center',
        fontSize: Constants.FONT_SIZE.SM,
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
    navigationContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#FBFBFB',
        justifyContent: 'space-between',
    },
});
