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

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get("window").width;

const NotificationScreen = ({ navigation }: any) => {
    // Static notification data
    const notificationData = [
        {
            Notification_Id: '1',
            Notify_Date: '2025-01-01',
            Notify_Message: 'New message from your colleague.',
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
            'Are you sure that you want to mark all notification as read?',
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
                    onPress: () => {
                        // Here you could clear notificationData if it was in state.
                    },
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
            <View style={styles.AddMemberView}>
                <Text style={styles.headerText}>Notification</Text>
                <TouchableOpacity onPress={handleCross}>
                    <Image source={require('../images/black_cross.png')} />
                </TouchableOpacity>
            </View>
            <View style={styles.separator} />

            {/* Clear all and Mark all as Read options */}
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}>
                <Text style={{
                    fontSize: Constants.FONT_SIZE.M,
                    color: Constants.COLOR.BUTTON_BG,
                    paddingHorizontal: 8,
                    paddingTop: 8,
                }} onPress={handleClear}>
                    Clear all
                </Text>
                <Text style={{
                    fontSize: Constants.FONT_SIZE.M,
                    color: Constants.COLOR.BUTTON_BG,
                    paddingHorizontal: 8,
                    paddingTop: 8,
                }} onPress={handleMarkAllAsRead}>
                    Mark all as Read
                </Text>
            </View>

            {/* ScrollView for notifications */}
            <ScrollView style={{ backgroundColor: '#f0f5fe', paddingHorizontal: 10, paddingVertical: 10 }}>
                {/* Displaying notifications */}
                {notificationData.map((item: any, index: number) => {
                    const showDate =
                        index === 0 ||
                        item.Notify_Date !== notificationData[index - 1]?.Notify_Date;
                    const isLastItem = index === notificationData.length - 1;

                    return (
                        <View
                            key={item?.Notification_Id}
                            style={{
                                backgroundColor: isContentVisible ? '#e0e0e0' : 'transparent',
                                marginBottom: isLastItem ? 30 : 0,
                                padding: 10,
                                marginTop: 10,
                            }}>
                            {showDate && <Text> Date: {item?.Notify_Date}</Text>}
                            <View style={{ flexDirection: 'row' }}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={{
                                    padding: 10,
                                    fontSize: Constants.FONT_SIZE.M,
                                    fontWeight: '600',
                                    color: '#313431',
                                    flex: 1
                                }}>
                                    {item?.Notify_Message}
                                </Text>
                                <TouchableOpacity>
                                    <Text
                                        style={[
                                            styles.newOldMsgText,
                                            {
                                                backgroundColor: item.IsNew === '1' ? '#ffa500' : '#120F0C',
                                                borderColor: item.IsNew === '1' ? '#ffa500' : '#120F0C',
                                            },
                                        ]}>
                                        {item.IsNew === '1' ? 'New' : 'Older'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }}>
                                <Text style={{
                                    fontSize: Constants.FONT_SIZE.SM,
                                    textAlign: 'left',
                                    padding: 10,
                                    color: '#000000',
                                }}
                                    numberOfLines={1}>{item?.Time_Diff_Desc}</Text>
                                <TouchableOpacity
                                    onPress={() => handleViewMore(item?.Notify_Message)}>
                                    <Text style={{
                                        fontSize: Constants.FONT_SIZE.S,
                                        textAlign: 'right',
                                        padding: 10,
                                        alignSelf: 'flex-end',
                                        justifyContent: 'flex-end',
                                        alignItems: 'flex-end',
                                        alignContent: 'flex-end',
                                        color: '#0645AD',
                                    }} numberOfLines={1}>View More</Text>
                                </TouchableOpacity>
                            </View>

                            {isLastItem && <View style={{}} />}
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
        backgroundColor: '#eef3fd',
    },
    AddMemberView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        alignItems: 'center',
        height: 60,
    },
    headerText: {
        fontSize: 20,
    },
    separator: {
        borderBottomWidth: 0.5,
        width: '100%',
    },
    newOldMsgText: {
        marginTop: 10,
        padding: 5,
        paddingHorizontal: 8,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ffa500',
        overflow: 'hidden',
        fontSize: Constants.FONT_SIZE.S,
        color: '#FFFFFF',
        alignSelf: 'flex-end',
        marginRight: 10,
    },
});

export default NotificationScreen;


