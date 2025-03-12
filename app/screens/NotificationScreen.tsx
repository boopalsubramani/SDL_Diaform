import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    ScrollView,
    Dimensions,
} from 'react-native';
import Constants from "../util/Constants";

const { height, width } = Dimensions.get('window');

const NotificationScreen = ({ navigation }: any) => {
    // Static notification data
    const notificationData = [
        {
            Notification_Id: '1',
            Notify_Date: '2025-01-01',
            Notify_Message: 'New message from your colleagueg.',
            Time_Diff_Desc: '5 mins ago',
        },
        {
            Notification_Id: '2',
            Notify_Date: '2025-01-01',
            Notify_Message: 'Meeting reminder: Project Sync.',
            Time_Diff_Desc: '10 mins ago',
        },
        {
            Notification_Id: '3',
            Notify_Date: '2025-01-02',
            Notify_Message: 'Your task is overdue.',
            Time_Diff_Desc: '1 hour ago',
        },
    ];

    const [isContentVisible, setIsContentVisible] = useState(true);

    const handleCross = () => {
        navigation.goBack();
    };

    const handleMarkAllAsRead = () => {
        Alert.alert(
            'Info',
            'Are you sure that you want to mark all notifications as read?',
            [
                {
                    text: 'Yes',
                    onPress: () => setIsContentVisible(false),
                },
                {
                    text: 'No',
                    style: 'cancel',
                },
            ],
            { cancelable: false },
        );
    };

    const handleClear = () => {
        Alert.alert(
            'Info',
            'Are you sure that you want to clear all notifications?',
            [
                {
                    text: 'Yes',
                    onPress: () => { },
                },
                {
                    text: 'No',
                    style: 'cancel',
                },
            ],
        );
    };

    const handleViewMore = (message: string) => {
        Alert.alert('View More', message);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.NotificationView}>
                <Text style={styles.headerText}>Notification</Text>
                <TouchableOpacity onPress={handleCross}>
                    <Image source={require('../images/black_cross.png')} style={styles.crossIcon} />
                </TouchableOpacity>
            </View>

            <View style={styles.separator} />

            {/* Clear all and Mark all as Read options */}
            <View style={styles.optionsRow}>
                <TouchableOpacity onPress={handleClear}>
                    <Text style={styles.optionText}>Clear all</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleMarkAllAsRead}>
                    <Text style={styles.optionText}>Mark all as Read</Text>
                </TouchableOpacity>
            </View>

            {/* ScrollView for notifications */}
            <ScrollView contentContainerStyle={styles.scrollView}>
                {notificationData.map((item, index) => {
                    const showDate =
                        index === 0 ||
                        item.Notify_Date !== notificationData[index - 1]?.Notify_Date;
                    const isLastItem = index === notificationData.length - 1;

                    return (
                        <View
                            key={item.Notification_Id}
                            style={[
                                styles.notificationContainer,
                                { backgroundColor: isContentVisible ? 'white' : 'transparent' },
                            ]}
                        >
                            {showDate && <Text style={styles.dateText}> Date: {item.Notify_Date}</Text>}

                            <View style={styles.messageRow}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.messageText}>
                                    {item.Notify_Message}
                                </Text>
                                <TouchableOpacity>
                                    <Text style={[styles.newOldMsgText, {
                                        backgroundColor: item.IsNew === '1' ? Constants.COLOR.WHITE_COLOR : '#ffa500',
                                        borderColor: item.IsNew === '1' ? Constants.COLOR.WHITE_COLOR : '#ffa500',
                                    }]}>
                                        {item.IsNew === '1' ? 'New' : 'Older'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.timeRow}>
                                <Text style={styles.timeText} numberOfLines={1}>
                                    {item.Time_Diff_Desc}
                                </Text>
                                <TouchableOpacity onPress={() => handleViewMore(item.Notify_Message)}>
                                    <Text style={styles.viewMoreText} numberOfLines={1}>
                                        View More
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {isLastItem && <View style={styles.bottomSpacing} />}
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.COLOR.WHITE_COLOR,
    },
    NotificationView: {
        backgroundColor: Constants.COLOR.THEME_COLOR,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: width * 0.04,
        alignItems: 'center',
        height: height * 0.08,
    },
    headerText: {
        fontSize: Constants.FONT_SIZE.L,
        fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
        color: Constants.COLOR.WHITE_COLOR
    },
    crossIcon: {
        width: width * 0.06,
        height: width * 0.06,
        resizeMode: 'contain',
        tintColor: Constants.COLOR.WHITE_COLOR
    },
    separator: {
        borderBottomWidth: 0.5,
        width: '100%',
    },
    optionsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: width * 0.04,
        marginTop: height * 0.01,
    },
    optionText: {
        fontSize: width * 0.04,
        color: Constants.COLOR.THEME_COLOR,
        paddingHorizontal: width * 0.02,
    },
    scrollView: {
        paddingHorizontal: width * 0.03,
        paddingVertical: height * 0.02,
    },
    notificationContainer: {
        borderRadius: width * 0.03,
        elevation: 3,
        padding: width * 0.03,
        marginVertical: height * 0.008,
    },
    dateText: {
        fontSize: width * 0.035,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: height * 0.005,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    messageText: {
        flex: 1,
        fontSize: width * 0.04,
        fontWeight: '600',
        color: '#313431',
    },
    newOldMsgText: {
        paddingVertical: height * 0.005,
        paddingHorizontal: width * 0.02,
        borderRadius: width * 0.015,
        borderWidth: 1,
        fontSize: width * 0.03,
        color: '#FFFFFF',
        overflow: 'hidden',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: height * 0.005,
    },
    timeText: {
        fontSize: width * 0.035,
        color: '#000000',
    },
    viewMoreText: {
        fontSize: width * 0.035,
        color: Constants.COLOR.THEME_COLOR,
    },
    bottomSpacing: {
        height: height * 0.05,
    },
});

export default NotificationScreen;


