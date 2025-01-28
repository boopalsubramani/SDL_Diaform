import React from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';

const Input = ({
    label,
    placeholder,
    value,
    editable = true,
    keyboardType = 'default',
    onChangeText,
    secureTextEntry = false,
}: any) => {
    return (
        <View>
            <Text style={styles.placeholder}>{label}</Text>
            <TextInput
                style={styles.inputs}
                placeholder={placeholder}
                value={value}
                editable={editable}
                keyboardType={keyboardType}
                underlineColorAndroid="transparent"
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                autoCorrect={false}
                autoCapitalize="none"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    placeholder: {
        marginTop: 10,
        marginBottom: 15,
        fontSize: 16,
        color: '#1E75C0',
        textAlign: 'left',
        fontWeight: 'bold',
    },
    inputs: {
        height: 50,
        backgroundColor: '#FCF8F9',
        borderBottomColor: '#FCF8F9',
        borderBottomWidth: 1,
        borderRadius: 1,
        marginBottom: 30,
        paddingLeft: 10,
        color: 'black',
        fontSize: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default Input;
