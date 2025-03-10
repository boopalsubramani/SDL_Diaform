import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Modal,
    Dimensions,
} from 'react-native';
import Constants from "../util/Constants";
import { useAppSettings } from '../common/AppSettingContext';


const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get("window").width;


const SosAlertScreen = ({ navigation }: any) => {
    const [showPopup, setShowPopup] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const { settings } = useAppSettings();

    const labels = settings?.Message?.[0]?.Labels || {};

    const getLabel = (key: string) => {
        return labels[key]?.defaultMessage || '';
    };


    const handleYesClick = () => {
        setShowPopup(true);
    };

    const handleNoThanksClick = () => {
        setShowPopup(false);
    };

    const handleOkClick = () => {
        setShowPopup(false);
        setShowConfirmation(true);
    };

    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
    };

    const handlePress = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handlePress} style={styles.BlackCross}>
                <Image
                    source={require('../images/black_cross.png')}
                    style={{ width: '100%', height: '100%' }}
                />
            </TouchableOpacity>
            <View style={styles.card}>
                <Text style={styles.heading}>{getLabel('sosssrc_1')}</Text>

                <Text style={styles.MessageText}>
                    {getLabel('sosssrc_2')}
                </Text>

                <TouchableOpacity style={styles.sendButton} onPress={handleYesClick}>
                    <Text style={styles.sendButtonText}>{getLabel('sosssrc_3')}</Text>
                </TouchableOpacity>

                {/* Popup Modal */}
                <Modal visible={showPopup} animationType="slide" transparent>
                    <View style={styles.popupContainer}>
                        <View style={styles.popupCard}>
                            <Text style={styles.popupText}>
                                To continue, turn on device location, which uses Google's
                                location services
                            </Text>
                            <View style={styles.rowButtonsContainer}>
                                <TouchableOpacity onPress={handleNoThanksClick}>
                                    <Text style={styles.buttonText}>No, thanks</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={handleOkClick}>
                                    <Text style={styles.buttonText}>Ok</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Confirmation Modal */}
                <Modal visible={showConfirmation} animationType="fade" transparent>
                    <View style={styles.confirmationContainer}>
                        <View style={styles.confirmationCard}>
                            <Text style={styles.confirmationHeading}>Success</Text>
                            <Text style={styles.confirmationText}>
                                SOS Alert updated successfully
                            </Text>
                            <TouchableOpacity onPress={handleCloseConfirmation}>
                                <Text style={styles.buttonText1}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#eef3fd",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    BlackCross: {
        position: 'absolute',
        top: 15,
        right: 30,
        width: deviceHeight / 40,
        height: deviceHeight / 40,
    },
    card: {
        backgroundColor: "#e1ebf9",
        alignItems: "center",
        justifyContent: "flex-start",
        flex: 1,
        margin: 5,
        padding: 10,
        marginHorizontal: 15,
        borderRadius: 5,
        marginVertical: 40,
    },
    heading: {
        color: "black",
        fontSize: Constants.FONT_SIZE.XXXL,
        paddingTop: 25,
        fontFamily: 'Poppins-Regular',
    },
    MessageView: {
        justifyContent: 'center',
        marginTop: 50,
        marginBottom: 50,
    },
    MessageText: {
        color: "black",
        fontSize: Constants.FONT_SIZE.M,
        paddingTop: 50,
        marginHorizontal: 10,
        fontFamily: 'Poppins-Regular',
    },
    sendButton: {
        backgroundColor: "#58afff",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 25,
        width: deviceWidth / 1.3,
        marginTop: 50,
        shadowColor: Constants.COLOR.THEME_COLOR,
        elevation: 3,
    },
    sendButtonText: {
        fontSize: Constants.FONT_SIZE.L,
        paddingVertical: 10,
        color: "#FFFFFF",
        fontFamily: 'Poppins-Regular',
    },
    popupContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    popupCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        elevation: 4,
        width: '90%',
    },
    popupText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 30,
        color: '#737373',
        fontFamily: 'Poppins-Regular',
    },
    rowButtonsContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        right: 20,
    },

    buttonText: {
        color: '#8db0d5',
        fontSize: 18,
        padding: 20,
        fontFamily: 'Poppins-Regular',
    },
    buttonText1: {
        color: '#8db0d5',
        fontSize: 18,
        alignSelf: 'flex-end',
        fontFamily: 'Poppins-Regular',
    },
    confirmationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    confirmationCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        elevation: 4,
        width: '80%',
    },
    confirmationText: {
        fontSize: 14,
        marginBottom: 10,
        fontFamily: 'Poppins-Regular',
    },
    confirmationHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
});

export default SosAlertScreen;