import React from 'react';
import { Text, View, StyleSheet, Dimensions, Image } from 'react-native';

const deviceHeight = Dimensions.get('window').height;

const ButtonBack = () => {
    return (
        <View style={styles.nextMainView}>
            <Text style={styles.nextText}>Back</Text>
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
        backgroundColor: '#676767',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
    },
    nextText: {
        justifyContent: 'center',
        alignContent: 'center',
        paddingRight: 10,
        paddingLeft: 10,
        textAlign: 'right',
        alignItems: 'center',
        color: 'white',
        fontSize: 16, 
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
