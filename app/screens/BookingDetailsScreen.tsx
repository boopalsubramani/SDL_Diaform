import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, StyleSheet, Dimensions } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import NavigationBar from '../common/NavigationBar';
import ButtonBack from '../common/BackButton';
import Constants from "../util/Constants";
import { useBookingDetailMutation } from '../redux/service/BookingDetailService';
import SpinnerIndicator from '../common/SpinnerIndicator';
import { useUser } from '../common/UserContext';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get("window").width;

interface ServiceDetail {
    Service_Name: string;
    Service_Amount: string;
}

interface BookingDetails {
    Booking_No: string;
    Pt_Code: string;
    Visit_Date_Desc: string;
    Pt_Name: string;
    First_Age: string;
    First_Age_Period: string;
    Gender_Code: string;
    Pt_Mobile_No: string;
    Report_Status_Desc: string;
    Booking_Status_Desc: string;
    Service_Detail: ServiceDetail[];
}

interface Booking {
    Booking_No: string;
    Booking_Date: string;
}

type BookingDetailsScreenRouteProp = RouteProp<{
    BookingDetails: { booking: Booking };
}, 'BookingDetails'>;

const BookingDetailsScreen = ({ navigation }: any) => {
    const route = useRoute<BookingDetailsScreenRouteProp>();
    const { booking } = route.params;
    const { userData } = useUser();
    const [reviewText, setReviewText] = useState('');
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
    const [bookingDetailAPIReq] = useBookingDetailMutation();

    useEffect(() => {
        const fetchBookingDetails = async () => {
            const requestBody = {
                App_Type: "R",
                Username: userData?.UserCode,
                Booking_Type: "R",
                Firm_No: "01",
                Booking_Date: booking.Booking_Date,
                Booking_No: booking.Booking_No
            };

            const response = await bookingDetailAPIReq(requestBody);
            if (response.data && response.data.SuccessFlag === "true") {
                setBookingDetails(response.data.Message[0]);
            }
        };

        fetchBookingDetails();
    }, [booking, bookingDetailAPIReq]);

    const handleButtonPress = () => {
        navigation.goBack();
    };
    if (!bookingDetails) {
        return (
            <View style={styles.loadingContainer}>
                <SpinnerIndicator />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: Constants.COLOR.WHITE_COLOR }}>
            <NavigationBar title={`Booking ID: ${bookingDetails.Booking_No}`} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.bookingIdView}>
                    <View style={styles.section}>
                        <Text style={styles.subHeading}>Booking ID: {bookingDetails.Booking_No}</Text>
                        <Text style={styles.heading}>Sample ID: {bookingDetails.Pt_Code}</Text>
                        <Text style={styles.text}>{bookingDetails.Visit_Date_Desc}</Text>
                    </View>
                </View>

                <View style={styles.circleContainer}>
                    <TouchableOpacity>
                        <Image source={require('../images/profileImg.png')}
                            style={styles.profileImageView}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <View style={styles.infoContainer}>
                        <Text style={styles.infoText}>{bookingDetails.Pt_Name}, {bookingDetails.First_Age} {bookingDetails.First_Age_Period}</Text>
                        <View style={styles.nameAddressRightAgePhoneView}>
                            <Image
                                style={styles.nameAddressRightAgeImage}
                                resizeMode="contain"
                                source={require('../images/gender.png')}
                            />
                            <Text style={styles.nameAddressRightAgeText}>
                                {bookingDetails.Gender_Code}
                            </Text>
                            <Image
                                style={styles.nameAddressRightMobileImage}
                                resizeMode="contain"
                                source={require('../images/mobile.png')}
                            />
                            <Text style={styles.nameAddressRightMobileText}>
                                {bookingDetails.Pt_Mobile_No || 'N/A'}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.banner}>
                    <Text style={styles.bannerText}>{bookingDetails.Report_Status_Desc}</Text>
                </View>

                <View style={styles.banner}>
                    <Text style={styles.bannerText}>{bookingDetails.Booking_Status_Desc}</Text>
                </View>

                <View>
                    {bookingDetails.Service_Detail.map((service, index) => (
                        <View key={index} style={styles.detailRow}>
                            <Text style={styles.detailTitle}>{service.Service_Name}</Text>
                            <Text style={styles.detailValue}>INR. {service.Service_Amount}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.reviewContainer}>
                    <Text style={styles.subHeading}>Post your review</Text>
                    <View style={styles.commentMainView}>
                        <TextInput
                            style={styles.input}
                            multiline={true}
                            value={reviewText}
                            onChangeText={text => setReviewText(text)}
                        />
                        <TouchableOpacity>
                            <Text style={styles.submitText}>Post</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <View>
                <TouchableOpacity onPress={handleButtonPress}>
                    <ButtonBack />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default BookingDetailsScreen;

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 10,
    },
    bookingIdView: { flexDirection: 'row' },
    section: {
        alignSelf: 'center',
        flex: 3
    },
    heading: {
        color: Constants.COLOR.FONT_COLOR_DEFAULT,
        fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
        fontSize: Constants.FONT_SIZE.M,
        marginTop: 0,
    },
    subHeading: {
        color: Constants.COLOR.FONT_COLOR_DEFAULT,
        fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
        fontSize: Constants.FONT_SIZE.M,
    },
    text: {
        color: Constants.COLOR.FONT_COLOR_DEFAULT,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
        fontSize: Constants.FONT_SIZE.SM,
    },
    commentMainView: {
        flexDirection: 'row',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImageView: {
        width: 80,
        height: 80,
        borderRadius: 80 / 2,
    },
    circleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: deviceHeight * 0.02,
    },
    infoContainer: {
        marginStart: 10
    },
    infoText: {
        color: Constants.COLOR.FONT_COLOR_DEFAULT,
        width:'90%',
        fontSize: Constants.FONT_SIZE.SM,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
    },
    nameAddressRightAgePhoneView: { flexDirection: 'row', marginTop: 10 },
    nameAddressRightAgeImage: {
        width: deviceHeight / 40,
        height: deviceHeight / 40,
        alignSelf: 'center',
    },
    nameAddressRightAgeText: {
        marginLeft: 5,
        color: Constants.COLOR.FONT_COLOR_DEFAULT,
        fontSize: Constants.FONT_SIZE.SM,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
    },
    nameAddressRightMobileImage: {
        marginLeft: 10,
        width: deviceHeight / 40,
        height: deviceHeight / 40,
        alignSelf: 'center',
    },
    nameAddressRightMobileText: {
        marginLeft: 5,
        color: Constants.COLOR.FONT_COLOR_DEFAULT,
        fontSize: Constants.FONT_SIZE.SM,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: deviceHeight * 0.01,
    },
    banner: {
        alignSelf: 'center',
        padding: deviceWidth * 0.02,
        borderWidth: 0.5,
        borderRadius: deviceWidth * 0.02,
        marginVertical: deviceHeight * 0.01,
    },
    bannerText: {
        fontSize: Constants.FONT_SIZE.SM,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#ECEEF5',
        padding: deviceWidth * 0.03,
    },
    detailTitle: {
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular
    },
    detailValue: {
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
        color: Constants.COLOR.FONT_COLOR_DEFAULT
    },
    submitText: {
        fontSize: Constants.FONT_SIZE.SM,
        backgroundColor: Constants.COLOR.WHITE_COLOR,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        textAlign: 'center',
        overflow: 'hidden',
        alignSelf: 'center',
        marginLeft: 10,
        color: Constants.COLOR.BLACK_COLOR,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular
    },
    reviewContainer: {
        marginVertical: deviceHeight * 0.02,
        backgroundColor: '#ECEEF5',
        marginBottom: 10,
        padding: 10
    },
    input: {
        backgroundColor: Constants.COLOR.WHITE_COLOR,
        flex: 0.999,
        paddingHorizontal: 10,
        borderRadius: 10,
        height: deviceHeight / 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Constants.COLOR.WHITE_COLOR,
    },
});




