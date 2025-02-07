import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Spinner from 'react-native-spinkit';
import Constants from '../util/Constants';
import { Dimensions } from 'react-native';

const deviceHeight = Dimensions.get('window').height;

const SpinnerIndicator = () => {
    return (
        <View style={styles.container}>
            <Spinner
                style={styles.spinner}
                isVisible={true}
                size={40}
                type={'Wave'}
                color={Constants.COLOR.THEME_COLOR}
            />
            <Text style={styles.text}>Loading...</Text>
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
