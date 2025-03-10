import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useLedgerDateWiseMutation } from '../redux/service/LedgerDateWiseService';
import { useLedgerMonthWiseMutation } from '../redux/service/LedgerMonthWiseService';
import { useUser } from '../common/UserContext';
import NavigationBar from '../common/NavigationBar';
import SpinnerIndicator from '../common/SpinnerIndicator';
import Constants from '../util/Constants';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { useAppSettings } from '../common/AppSettingContext';

const deviceWidth = Dimensions.get('window').width;

interface LedgerData {
    Sid_Date: string;
    Payment: string;
    Deposit: string;
    Sales: string;
    Adjustment: string;
    Collection: string;
}

interface MonthWiseData {
    Ledger_Month: string;
    Ledger_Year: string;
    Payment: string;
    Deposit: string;
    Sales: string;
    Adjustment: string;
    ClosingBalance: string;
}

const LedgerDetailsScreen = () => {
    const { userData } = useUser();
    const [ledgerDateWiseApiReq] = useLedgerDateWiseMutation();
    const [ledgerMonthWiseApiReq] = useLedgerMonthWiseMutation();
    const [dateWiseData, setDateWiseData] = useState<LedgerData[]>([]);
    const [monthWiseData, setMonthWiseData] = useState<MonthWiseData[]>([]);
    const [selectedFromDate, setSelectedFromDate] = useState('');
    const [selectedToDate, setSelectedToDate] = useState('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [calendarType, setCalendarType] = useState('');
    const [viewMode, setViewMode] = useState('date');
    const [loading, setLoading] = useState(true);
    const [noData, setNoData] = useState(false);
    const { settings } = useAppSettings();


    const labels = settings?.Message?.[0]?.Labels || {};

    const getLabel = (key: string) => {
        return labels[key]?.defaultMessage || '';
    };


    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        setSelectedFromDate(formattedDate);
        setSelectedToDate(formattedDate);
        fetchData(formattedDate, formattedDate);
    }, []);


    const formatDate = (date: any) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatDateForRequest = (date: any) => {
        const [day, month, year] = date.split('/');
        return `${year}-${month}-${day}`;
    };

    const fetchData = async (fromDate: string, toDate: string) => {
        setLoading(true);
        setNoData(false);

        const formattedFromDate = formatDateForRequest(fromDate);
        const formattedToDate = formatDateForRequest(toDate);

        try {
            if (viewMode === 'date') {
                const dateWiseResponse = await ledgerDateWiseApiReq({
                    Usertype: userData?.UserType,
                    Username: userData?.UserCode,
                    Firm_No: "01",
                    From_Date: formattedFromDate,
                    To_Date: formattedToDate,
                }).unwrap();

                if (dateWiseResponse?.SuccessFlag === "true" && Array.isArray(dateWiseResponse.Message) && dateWiseResponse.Message.length > 0) {
                    setDateWiseData(dateWiseResponse.Message);
                    setNoData(false);
                } else {
                    setDateWiseData([]);
                    setNoData(true);
                }
            } else {
                const monthWiseResponse = await ledgerMonthWiseApiReq({
                    Usertype: userData?.UserType,
                    Username: userData?.UserCode,
                    Firm_No: "01",
                    From_Date: formattedFromDate,
                    To_Date: formattedToDate,
                }).unwrap();

                if (monthWiseResponse?.SuccessFlag === "true" && Array.isArray(monthWiseResponse.Message) && monthWiseResponse.Message.length > 0) {
                    setMonthWiseData(monthWiseResponse.Message);
                    setNoData(false);
                } else {
                    setMonthWiseData([]);
                    setNoData(true);
                }
            }
        } catch (error) {
            console.error("Error fetching ledger data:", error);
            setDateWiseData([]);
            setMonthWiseData([]);
            setNoData(true);
        }
        setLoading(false);
    };

    const openCalendar = (type: any) => {
        setCalendarType(type);
        setShowCalendar(true);
    };

    const handleDateSelection = (day: any) => {
        const newDate = day.dateString.split('-').reverse().join('/');

        if (calendarType === 'from') {
            setSelectedFromDate(newDate);
            fetchData(newDate, selectedToDate);
        } else {
            setSelectedToDate(newDate);
            fetchData(selectedFromDate, newDate);
        }
        setShowCalendar(false);
    };

    const handleIndexChange = (index: number) => {
        setViewMode(index === 0 ? 'date' : 'month');
        fetchData(selectedFromDate, selectedToDate);
    };


    return (
        <View style={styles.container}>
            <NavigationBar title="Ledger" />
            <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                <View style={styles.dateContainer}>
                    <View style={styles.datePickerContainer}>
                        <Text style={styles.label}>From</Text>
                        <TouchableOpacity onPress={() => openCalendar('from')} style={styles.datePicker}>
                            <Text style={styles.dateText}>{selectedFromDate}</Text>
                            <Image source={require('../images/calendar.png')} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.datePickerContainer}>
                        <Text style={styles.label}>To</Text>
                        <TouchableOpacity onPress={() => openCalendar('to')} style={styles.datePicker}>
                            <Text style={styles.dateText}>{selectedToDate}</Text>
                            <Image source={require('../images/calendar.png')} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>

                <SegmentedControlTab
                    values={['Date-wise', 'Month-wise']}
                    selectedIndex={viewMode === 'date' ? 0 : 1}
                    onTabPress={handleIndexChange}
                    tabsContainerStyle={styles.tabContainer}
                    tabStyle={styles.tabStyle}
                    activeTabStyle={styles.activeTabStyle}
                    tabTextStyle={styles.tabTextStyle}
                    activeTabTextStyle={styles.activeTabTextStyle}
                />
            </View>

            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                {loading ? (
                    <SpinnerIndicator />
                ) : noData ? (
                    <View style={styles.noDataContainer}>
                        <Text style={styles.noDataText}>{getLabel('aboutscr_5')}</Text>
                    </View>
                ) : (
                    <>
                        {viewMode === 'date' && (
                            <View style={styles.table}>
                                <View style={styles.tableRow}>
                                    <Text style={[styles.tableHeader, styles.flex1]}>Date</Text>
                                    <Text style={[styles.tableHeader, styles.flex1]}>Payment</Text>
                                    <Text style={[styles.tableHeader, styles.flex1]}>Deposit</Text>
                                    <Text style={[styles.tableHeader, styles.flex1]}>Sales</Text>
                                    <Text style={[styles.tableHeader, styles.flex1]}>Adjusted</Text>
                                    <Text style={[styles.tableHeader, styles.flex1]}>Closing Balance</Text>
                                </View>
                                {dateWiseData.map((item, index) => (
                                    <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
                                        <Text style={[styles.tableCell, styles.flex1]}>{new Date(item.Sid_Date).toLocaleDateString()}</Text>
                                        <Text style={[styles.tableCell, styles.flex1]}>{item.Payment}</Text>
                                        <Text style={[styles.tableCell, styles.flex1]}>{item.Deposit}</Text>
                                        <Text style={[styles.tableCell, styles.flex1]}>{item.Sales}</Text>
                                        <Text style={[styles.tableCell, styles.flex1]}>{item.Adjustment}</Text>
                                        <Text style={[styles.tableCell, styles.flex1]}>{item.Collection}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {viewMode === 'month' && (
                            <View style={styles.table}>
                                <View style={styles.tableRow}>
                                    <Text style={[styles.tableHeader, styles.flex1]}>Month</Text>
                                    <Text style={[styles.tableHeader, styles.flex1]}>Year</Text>
                                    <Text style={[styles.tableHeader, styles.flex1]}>Payment</Text>
                                    <Text style={[styles.tableHeader, styles.flex1]}>Deposit</Text>
                                    <Text style={[styles.tableHeader, styles.flex1]}>Sales</Text>
                                    <Text style={[styles.tableHeader, styles.flex1]}>Adjusted</Text>
                                    <Text style={[styles.tableHeader, styles.flex1]}>Closing Balance</Text>
                                </View>
                                {monthWiseData.map((item, index) => (
                                    <View key={index} style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
                                        <Text style={[styles.tableCell, styles.flex1]}>{item.Ledger_Month}</Text>
                                        <Text style={[styles.tableCell, styles.flex1]}>{item.Ledger_Year}</Text>
                                        <Text style={[styles.tableCell, styles.flex1]}>{item.Payment}</Text>
                                        <Text style={[styles.tableCell, styles.flex1]}>{item.Deposit}</Text>
                                        <Text style={[styles.tableCell, styles.flex1]}>{item.Sales}</Text>
                                        <Text style={[styles.tableCell, styles.flex1]}>{item.Adjustment}</Text>
                                        <Text style={[styles.tableCell, styles.flex1]}>{item.ClosingBalance}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </>
                )}
            </ScrollView>


            <Modal visible={showCalendar} transparent animationType="slide">
                <TouchableOpacity style={styles.overlay} onPress={() => setShowCalendar(false)} />
                <View style={styles.calendarContainer}>
                    <Calendar
                        onDayPress={handleDateSelection}
                        markedDates={{
                            [selectedFromDate.split('/').reverse().join('-')]: {
                                selected: true,
                                selectedColor: '#5cb85c',
                            },
                            [selectedToDate.split('/').reverse().join('-')]: {
                                selected: true,
                                selectedColor: '#5cb85c',
                            },
                        }}
                    />
                </View>
            </Modal>
        </View>
    );
};

export default LedgerDetailsScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.COLOR.WHITE_COLOR,
    },
    scrollViewContent: {
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    noDataText: {
        color: Constants.COLOR.BLACK_COLOR,
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
    },
    tabContainer: {
        marginTop: 20,
        alignSelf: 'center',
        borderWidth: 0.8,
        borderRadius: 30,
        overflow: 'hidden',
        borderColor: Constants.COLOR.THEME_COLOR,
    },
    tabStyle: {
        borderWidth: 0,
        paddingHorizontal: 5,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderEndWidth: 0,
    },
    activeTabStyle: {
        backgroundColor: Constants.COLOR.THEME_COLOR,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    tabTextStyle: {
        color: 'black',
        fontWeight: 'bold',
    },
    activeTabTextStyle: {
        color: 'white',
        fontWeight: 'bold',
    },
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    datePickerContainer: {
        flex: 1,
        marginHorizontal: 5,
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
        fontFamily: 'Poppins-Regular',
    },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        justifyContent: 'space-between',
        padding: 6,
        shadowColor: Constants.COLOR.THEME_COLOR,
        elevation: 3,
    },
    dateText: {
        fontSize: 12,
        color: '#333',
    },
    icon: {
        width: 14,
        height: 14,
        resizeMode: 'contain',
    },
    table: {
        backgroundColor: '#fff',
        shadowColor: Constants.COLOR.THEME_COLOR,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tableHeader: {
        padding: 8,
        backgroundColor: '#0056b3',
        color: '#fff',
        textAlign: 'center',
        fontSize: 10,
        fontWeight: 'bold',
    },
    tableCell: {
        padding: 10,
        textAlign: 'center',
        fontSize: 12,
    },
    flex1: {
        flex: 1,
        fontSize: 10
    },
    evenRow: {
        backgroundColor: '#f9f9f9',
    },
    oddRow: {
        backgroundColor: '#ffffff',
    },
    loader: {
        marginTop: 20,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    calendarContainer: {
        backgroundColor: '#fff',
        padding: 20,
        marginTop: 'auto',
    },
});
