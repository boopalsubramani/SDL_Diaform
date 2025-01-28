
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    FlatList,
    Modal,
    Alert,
    Dimensions,
} from 'react-native';
import Constants from '../util/Constants';
import { useBookTestSearchMutation } from '../redux/service/BookTestSearchService';
import Spinner from 'react-native-spinkit';
import { useCart } from '../common/CartContext';
import { useNavigation } from '@react-navigation/native';


const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const BookTestSearchScreen = () => {
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [testData, setTestData] = useState<any[]>([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const { cartItems, setCartItems } = useCart();

    // API request hook
    const [searchTestAPIReq, { data: searchTestAPIRes, isLoading }] = useBookTestSearchMutation();

    useEffect(() => {
        if (searchText.trim().length > 2) {
            const requestBody = {
                App_Type: "R",
                Service_Type: "T",
                Search_Text: searchText,
                Ref_Type: "C",
                Ref_Code: "01000104",
                Coverage_Percent: "0",
                Offer_Amount: "1",
                Discount_Percentage: 20,
            };
            searchTestAPIReq(requestBody);
        } else {
            setTestData([]);
        }
    }, [searchText]);

    useEffect(() => {
        if (searchTestAPIRes?.SuccessFlag === "true" && searchTestAPIRes?.Message) {
            setTestData(searchTestAPIRes.Message);
        } else if (searchTestAPIRes?.SuccessFlag === "false") {
            Alert.alert('Error', searchTestAPIRes?.ErrorMessage || 'Failed to fetch tests.');
        }
    }, [searchTestAPIRes]);

    const handleCross = () => navigation.goBack();

    const handleProceedClick = () => {
        if (cartItems.length > 0) {
            setModalVisible(true);
            const selectedTests = cartItems.map(itemName => {
                const item = testData.find(test => test.Service_Name === itemName);
                return {
                    Service_Name: item?.Service_Name,
                    Amount: item?.Amount,
                };
            });
            navigation.navigate('Calender', { selectedTests });
            // navigation.navigate('FinalPayment', { selectedTests });

        } else {
            Alert.alert('Empty Cart', 'Please add items to the cart before proceeding.');
        }
    };
    
    const handleToggleCart = (itemName: string) => {
        setCartItems(prevCartItems =>
            prevCartItems.includes(itemName)
                ? prevCartItems.filter(item => item !== itemName)
                : [...prevCartItems, itemName]
        );
    };

    const totalCartValue = cartItems.reduce((total, itemName) => {
        const item = testData.find(test => test.Service_Name === itemName);
        return total + (item?.Amount || 0);
    }, 0);

    const renderItem = ({ item }: any) => {
        const isItemInCart = cartItems.includes(item.Service_Name);
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
                        <Text>{isItemInCart ? 'Remove' : 'Add Cart'}</Text>
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
                <TouchableOpacity onPress={handleProceedClick}>
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
                <View style={styles.modalContainer}>
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
                </View>
            </Modal>

            {isLoading && (
                <View style={styles.spinnerContainer}>
                    <Spinner
                        isVisible={isLoading}
                        size={50}
                        type="Wave"
                        color={Constants.COLOR.THEME_COLOR}
                    />
                </View>
            )}

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

            {searchText.trim().length > 0 && (
                <View>
                    <Text style={styles.bottomText}>
                        Total Cart Value INR {totalCartValue}
                    </Text>
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <View style={styles.SubmitButtonView}>
                            <Text style={styles.ButtonText}>Proceed</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                        <Text style={{ color: '#fd1a1b' }}>
                            Note:*-Indicates Non Discounted Test
                        </Text>
                    </View>
                </View>
            )}
        </View>
    );
};

export default BookTestSearchScreen;


// Stylesheet
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
    spinnerContainer: { position: 'absolute', top: '20%', left: '50%', transform: [{ translateX: -25 }, { translateY: -25 }] },
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
    flatListContainer: {
        paddingHorizontal: 10,
    },
});
