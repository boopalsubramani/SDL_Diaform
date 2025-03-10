import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Constants from '../util/Constants';
import { useAppSettings } from '../common/AppSettingContext';



const PaymentFailureScreen = ({ navigation }: any) => {
    const { settings } = useAppSettings();

    const labels = settings?.Message?.[0]?.Labels || {};

    const getLabel = (key: string) => {
        return labels[key]?.defaultMessage || '';
    };

    const handleHome = () => {
        navigation.navigate('Bottom')
    };

    const handleRetry = () => {
        navigation.navigate('')
    };

    return (
        <View style={styles.container}>
            <View style={styles.viewContainer}>
                <Text style={styles.title}>{getLabel('paymentfail_1')}</Text>
                <Image
                    style={styles.image}
                    source={require('../images/warning.png')}
                    resizeMode="contain"
                />
                <Text style={styles.info}>
                    {getLabel('paymentfail_2')}{' '}
                </Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleHome}
                    style={styles.buttonView}>
                    <Text style={styles.buttonText}>{getLabel('paymentfail_3')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleRetry}
                    style={styles.buttonView}>
                    <Text style={styles.buttonText}>{getLabel('paymentfail_4')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.COLOR.WHITE_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    viewContainer: {
        marginHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: Constants.FONT_SIZE.XL,
        textAlign: 'center',
        fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
        marginVertical: 15,
    },
    image: {
        width: 80,
        height: 80,
        marginVertical: 15,
    },
    info: {
        fontSize: Constants.FONT_SIZE.M,
        textAlign: 'center',
        marginVertical: 15,
        fontFamily: Constants.FONT_FAMILY.fontFamilyMedium,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 35,
        marginHorizontal: 20,
    },
    buttonView: {
        backgroundColor: Constants.COLOR.THEME_COLOR,
        borderRadius: 10,
        flex: 1,
        marginHorizontal: 8,
    },
    buttonText: {
        textAlign: 'center',
        paddingVertical: 12,
        fontSize: Constants.FONT_SIZE.M,
        color: Constants.COLOR.WHITE_COLOR,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular
    },
});

export default PaymentFailureScreen;
