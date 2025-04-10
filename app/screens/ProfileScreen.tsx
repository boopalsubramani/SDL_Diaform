import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Alert, TouchableOpacity, Dimensions, I18nManager } from 'react-native';
import { useSelector } from 'react-redux';
import { useAppSettings } from '../common/AppSettingContext';
import { useUser } from '../common/UserContext';
import Constants from "../util/Constants";
import { RootState } from '../redux/Store';

const { height: deviceHeight, width: deviceWidth } = Dimensions.get('window');

interface Language {
    Alignment: 'ltr' | 'rtl';
}

const InputField = ({ label, value, onChangeText, placeholder, keyboardType, editable }: any) => (
    <View style={styles.inputContainer}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            editable={editable}
        />
    </View>
);

const ProfileScreen = ({ navigation }: any) => {
    const { labels } = useAppSettings();
    const { userData } = useUser();
    const [fullName, setFullName] = useState(userData?.Names || '');
    const [email, setEmail] = useState(userData?.Email || '');
    const [dob, setDOB] = useState('1990-01-01');
    const [mobileNumber, setMobileNumber] = useState(userData?.Mobile || '');
    const [isEditMode, setIsEditMode] = useState(false);
    const selectedLanguage = useSelector((state: RootState) => state.appSettings.selectedLanguage) as Language | null;

    useEffect(() => {
        I18nManager.forceRTL(selectedLanguage?.Alignment === 'rtl');
        updateUserData(userData);
    }, [selectedLanguage, userData]);

    const updateUserData = (data: any) => {
        setFullName(data?.Names || '');
        setEmail(data?.Email || '');
        setMobileNumber(data?.Mobile || '');
    };

    const getLabel = (key: string) => labels[key]?.defaultMessage || '';

    const handleCross = () => navigation.goBack();
    const handleEditProfile = () => setIsEditMode(!isEditMode);

    const handleUpdate = () => {
        if (isEditMode) {
            Alert.alert('Success', 'Profile Updated Successfully!');
            setIsEditMode(false);
        } else {
            navigation.navigate('Bottom');
        }
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.myProfileView}>
                <Text style={styles.headerText}>My Profile</Text>
                <TouchableOpacity onPress={handleCross}>
                    <Image source={require('../images/black_cross.png')} style={styles.crossImg} />
                </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View style={styles.NameView}>
                <Text style={styles.NameText}>{fullName}</Text>
                <View style={styles.editProfileContainer}>
                    <TouchableOpacity onPress={handleEditProfile} style={styles.editTextView}>
                        <Text style={styles.editProfileText}>
                            {isEditMode ? 'Cancel' : getLabel('proscr_2')}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image style={styles.headerRightImage} source={require('../images/profileImg.png')} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.secondInnerContainer}>
                <InputField
                    label={getLabel('proscr_4')}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter your name"
                    editable={isEditMode}
                />
                <InputField
                    label={getLabel('proscr_8')}
                    value={email}
                    onChangeText={(text: string) => setEmail(text.toLowerCase())}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    editable={isEditMode}
                />
                <InputField
                    label={getLabel('proscr_9')}
                    value={dob}
                    onChangeText={setDOB}
                    placeholder="Enter your DOB"
                    keyboardType="numeric"
                    editable={isEditMode}
                />
                <InputField
                    label="Phone Number"
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    editable={isEditMode}
                />
            </View>
            <TouchableOpacity onPress={handleUpdate} style={styles.HomeButton}>
                <Text style={styles.HomeButtonText}>{isEditMode ? 'Update' : 'Home'}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: Constants.COLOR.WHITE_COLOR },
    myProfileView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        alignItems: 'center',
        height: 60,
        backgroundColor: Constants.COLOR.THEME_COLOR,
    },
    headerText: {
        fontSize: Constants.FONT_SIZE.L,
        color: Constants.COLOR.WHITE_COLOR,
        fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
    },
    crossImg: {
        width: deviceHeight / 35,
        height: deviceHeight / 35,
        tintColor: Constants.COLOR.WHITE_COLOR,
    },
    divider: {},
    editProfileContainer: { alignItems: 'center' },
    editTextView: {
        textAlign: 'right',
        alignContent: 'flex-end',
        alignItems: 'flex-end',
        alignSelf: 'flex-end',
        padding: 10,
    },
    editProfileText: {
        color: Constants.COLOR.THEME_COLOR,
        textAlign: 'right',
        alignContent: 'flex-end',
        alignItems: 'flex-end',
        alignSelf: 'flex-end',
    },
    input: {
        fontSize: Constants.FONT_SIZE.SM,
        marginVertical: 8,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
    },
    secondInnerContainer: {
        flexDirection: 'column',
        marginHorizontal: 10,
        paddingTop: 20,
    },
    inputContainer: { marginVertical: 8 },
    label: {
        fontSize: Constants.FONT_SIZE.M,
        color: Constants.COLOR.THEME_COLOR,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
    },
    NameView: {
        flexDirection: 'row',
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    NameText: {
        flex: 3,
        fontSize: Constants.FONT_SIZE.XL,
        fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
        marginHorizontal: 5,
    },
    HomeButton: {
        backgroundColor: Constants.COLOR.THEME_COLOR,
        alignItems: 'center',
        borderRadius: 25,
        width: deviceWidth / 3.9,
        marginTop: 15,
        alignSelf: 'center',
        shadowColor: Constants.COLOR.THEME_COLOR,
        elevation: 3,
        shadowRadius: 15,
        marginBottom: 35,
    },
    HomeButtonText: {
        fontSize: Constants.FONT_SIZE.M,
        paddingVertical: 5,
        fontFamily: Constants.FONT_FAMILY.fontFamilyMedium,
        color: Constants.COLOR.WHITE_COLOR,
    },
    headerRightImage: {
        borderRadius: deviceHeight / 8 / 2,
        width: deviceHeight / 8,
        height: deviceHeight / 8,
    },
});
