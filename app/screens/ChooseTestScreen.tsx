
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Image, Modal, Alert } from 'react-native';
import Constants from '../util/Constants';
import { useCart } from '../common/CartContext';
import { useNavigation } from '@react-navigation/native';
import NavigationBar from '../common/NavigationBar';
import BookTestHeader from './BookTestHeader';
import ButtonBack from '../common/BackButton';
import ButtonNext from '../common/NextButton';

const deviceHeight = Dimensions.get('window').height;

const ChooseTestScreen = (showHeader = true) => {
    const navigation = useNavigation();
    const { cartItems, setCartItems } = useCart();
    const badgeCount = cartItems.length;

    // Modal visibility state
    const [modalVisible, setModalVisible] = useState(false);

    const handleUploadPrescription = () => {
        navigation.navigate('UploadPrescription');
    };

    const handleSearchTest = () => {
        navigation.navigate('BookTestSearch');
    };

    const handleCartClick = () => {
        if (badgeCount > 0) {
            setModalVisible(true);
        } else {
            Alert.alert('Cart', 'Cart is Empty');
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleNext = () => {
        navigation.navigate('BookTestSearch');
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
                        <Text style={styles.chooseTestText}>Choose test</Text>
                        <View style={styles.cartValueView}>
                            <Text style={styles.cartValueLabel}>Cart value</Text>
                            <Text style={styles.cartValue}>INR 0</Text>
                        </View>
                    </View>

                    <View style={styles.searchCartView}>
                        <TouchableOpacity onPress={handleSearchTest}>
                            <Image
                                source={require('../images/search.png')}
                                style={styles.searchIcon}
                            />
                        </TouchableOpacity>
                        <Text style={styles.searchLabel}>Select Test</Text>
                        <TouchableOpacity onPress={handleCartClick} style={styles.searchCartRightView}>
                            <Image
                                source={require('../images/addCart.png')}
                                style={styles.CartIcon}
                            />
                        </TouchableOpacity>
                        {badgeCount > 0 && (
                            <View style={styles.notificationBadge}>
                                <Text style={styles.notificationBadgeText}>{badgeCount}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.uploadContainer}>
                        <TouchableOpacity
                            style={styles.uploadButtonView}
                            onPress={handleUploadPrescription}>
                            <Image
                                source={require('../images/up_arrow.png')}
                                style={styles.uploadImage}
                            />
                            <Text style={styles.uploadText}>Upload Prescription</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Modal for cart */}
            {modalVisible && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalBackground}>
                        <View style={styles.modalContent}>
                            <Text>Cart Details Here</Text>
                            {/* You can add your cart modal content here */}
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Text>Close Modal</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
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
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
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



