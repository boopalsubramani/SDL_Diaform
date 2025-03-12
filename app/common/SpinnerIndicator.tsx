import React, { useEffect } from 'react';
import { View, Text, StyleSheet, I18nManager } from 'react-native';
import Spinner from 'react-native-spinkit';
import Constants from '../util/Constants';
import { Dimensions } from 'react-native';
import { useAppSettings } from '../common/AppSettingContext';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';

const deviceHeight = Dimensions.get('window').height;

interface Language {
    Alignment: 'ltr' | 'rtl';
}

const SpinnerIndicator = () => {
    const { labels } = useAppSettings();
    const selectedLanguage = useSelector((state: RootState) => state.appSettings.selectedLanguage) as Language | null;

    useEffect(() => {
        I18nManager.forceRTL(selectedLanguage?.Alignment === 'rtl');
    }, [selectedLanguage]);

    const getLabel = (key: string) => {
        return labels[key]?.defaultMessage || '';
    };
    return (
        <View style={styles.container}>
            <Spinner
                style={styles.spinner}
                isVisible={true}
                size={40}
                type={'Wave'}
                color={Constants.COLOR.THEME_COLOR}
            />
            <Text style={styles.text}>{getLabel('loading_1')}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    spinner: {
        alignItems: 'center',
        alignSelf: 'center',
    },
    text: {
        marginTop: 10,
        fontSize: 16,
        color: Constants.COLOR.THEME_COLOR,
    },
});

export default SpinnerIndicator;
