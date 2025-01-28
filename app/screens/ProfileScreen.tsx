import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    Alert,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Constants from "../util/Constants";

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get("window").width;

const ProfileScreen = ({ navigation }: any) => {
    const [fullName, setFullName] = useState('John Doe');
    const [email, setEmail] = useState('johndoe@example.com');
    const [dob, setDOB] = useState('1990-01-01');
    const [mobileNumber, setMobileNumber] = useState('1234567890');
    const [isEditMode, setIsEditMode] = useState(false);

    const handleCross = () => {
        navigation.goBack();
    };

    const handleEditProfile = () => {
        setIsEditMode(!isEditMode);
    };



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
                <Text style={{
                    fontSize: Constants.FONT_SIZE.L,
                    color: '#757677',
                    fontWeight: 'bold',
                }}>My Profile</Text>
                <TouchableOpacity onPress={handleCross}>
                    <Image
                        source={require('../images/black_cross.png')}
                        style={styles.crossImg}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View style={styles.NameView}>
                <Text style={styles.NameText}>{fullName}</Text>
                <View style={styles.editProfileContainer}>
                    <TouchableOpacity onPress={handleEditProfile} style={styles.editTextView}>
                        <Text style={styles.editProfileText}>
                            {isEditMode ? 'Cancel' : 'Edit Profile'}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image
                            style={styles.headerRightImage}
                            source={require('../images/profileImg.png')}
                        />
                    </TouchableOpacity>
                </View>
            </View>


            <View style={styles.secondInnerContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your name"
                        value={fullName}
                        onChangeText={setFullName}
                        editable={isEditMode}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={text => setEmail(text.toLowerCase())}
                        autoCapitalize="none"
                        editable={isEditMode}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>D.O.B</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your DOB"
                        keyboardType="numeric"
                        value={dob}
                        onChangeText={setDOB}
                        editable={isEditMode}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Phone Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your phone number"
                        keyboardType="phone-pad"
                        value={mobileNumber}
                        onChangeText={setMobileNumber}
                        editable={isEditMode}
                    />
                </View>
            </View>
            <TouchableOpacity onPress={handleUpdate} style={styles.HomeButton}>
                <Text style={styles.HomeButtonText}>
                    {isEditMode ? 'Update' : 'Home'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Constants.COLOR.BACKGROUND_COLOR_SCREEN,
    },
    myProfileView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        alignItems: 'center',
        height: 60,
    },
    crossImg: {
        width: deviceHeight / 35,
        height: deviceHeight / 35,
    },
    divider: {
        width: '100%',
        height: 1,
        backgroundColor: '#757677',
    },
    editProfileContainer: {
        alignItems: 'center',
    },
    editTextView: {
        textAlign: 'right',
        alignContent: 'flex-end',
        alignItems: 'flex-end',
        alignSelf: 'flex-end',
        padding: 10,
    },
    editProfileText: {
        color: '#1E75C0',
        textAlign: 'right',
        alignContent: 'flex-end',
        alignItems: 'flex-end',
        alignSelf: 'flex-end',
    },
    input: {
        fontSize: Constants.FONT_SIZE.M,
        color: 'black',
        marginVertical: 8,
        borderBottomColor: '#A9A9A9',
    },
    secondInnerContainer: {
        flexDirection: 'column',
        marginHorizontal: 10,
        paddingTop: 20,
    },
    inputContainer: {
        marginVertical: 8,
    },
    label: {
        fontSize: Constants.FONT_SIZE.M,
        color: '#fb5861',
        marginRight: 50,
    },
    NameView: {
        flexDirection: 'row',
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    NameText: {
        flex: 3,
        color: '#757677',
        fontSize: Constants.FONT_SIZE.XXXL,
        marginHorizontal: 5,
    },
    HomeButton: {
        backgroundColor: '#040619',
        alignItems: 'center',
        borderRadius: 25,
        width: deviceWidth / 3.9,
        marginTop: 15,
        alignSelf: 'center',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOpacity: 1.0,
        elevation: 6,
        shadowRadius: 15,
        marginBottom: 35,
    },
    HomeButtonText: {
        fontSize: Constants.FONT_SIZE.S,
        paddingVertical: 10,
        textAlign: 'center',
        color: '#FFFFFF',
    },
    // circleImage: {
    //     width: 100,
    //     height: 100,
    //     borderRadius: 50,
    // },
    headerRightImage: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
        alignContent: 'flex-end',
        borderRadius: deviceHeight / 8 / 2,
        width: deviceHeight / 8,
        height: deviceHeight / 8,
    },
});

export default ProfileScreen;
