import React from 'react';
import { Text, View, StyleSheet, Dimensions, Image } from 'react-native';
import Constants from '../util/Constants';
import { useAppSettings } from '../common/AppSettingContext';

const deviceHeight = Dimensions.get('window').height;

const ButtonBack = () => {
    const { settings } = useAppSettings();
    const labels = settings?.Message?.[0]?.Labels || {};

    const getLabel = (key: string) => {
      return labels[key]?.defaultMessage || '';
    };
  
    return (
        <View style={styles.nextMainView}>
            <Text style={styles.nextText}>{getLabel('btnback_1')}</Text>
            <Image
                style={styles.nextImage}
                resizeMode="contain"
                source={require('../images/chevron-left.png')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    nextMainView: {
        marginVertical: 10,
        marginHorizontal:10,
        flexDirection: 'row-reverse',
        alignSelf:'flex-start',
        backgroundColor: Constants.COLOR.THEME_COLOR,
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 4,
    },
    nextText: {
        justifyContent: 'center',
        alignContent: 'center',
        paddingRight: 10,
        paddingLeft: 10,
        textAlign: 'right',
        alignItems: 'center',
        color: Constants.COLOR.WHITE_COLOR,
        fontFamily:Constants.FONT_FAMILY.fontFamilyMedium,
        fontSize: Constants.FONT_SIZE.M,
        },
    nextImage: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: deviceHeight / 35,
        height: deviceHeight / 35,
    },
});

export default ButtonBack;
