import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList, ScrollView, Alert } from 'react-native';
import { useLedgerDateWiseMutation } from '../redux/service/LedgerDateWiseService';
import { useLedgerMonthWiseMutation } from '../redux/service/LedgerMonthWiseService';
import { useUser } from '../common/UserContext';
import NavigationBar from '../common/NavigationBar';
import SpinnerIndicator from '../common/SpinnerIndicator';
import Constants from '../util/Constants';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import { useAppSettings } from '../common/AppSettingContext';
import CalendarModal from '../common/Calender';

const deviceWidth = Dimensions.get('window').width;

interface LedgerData {
    Sid_Date: string;
    Payment: string;
    Deposit: string;
    Sales: string;
    Adjustment: string;
    Collection: string;
    ClosingBalance: string
}

interface MonthWiseData {
    Collection: string;
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
    const [selectedFromDate, setSelectedFromDate] = useState("");
    const [selectedToDate, setSelectedToDate] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);
    const [calendarType, setCalendarType] = useState("");
    const [viewMode, setViewMode] = useState("date");
    const [loading, setLoading] = useState(true);
    const [noData, setNoData] = useState(false);
    const { settings } = useAppSettings();

    const labels = settings?.Message?.[0]?.Labels || {};

    const getLabel = (key: string) => labels[key]?.defaultMessage || "";

    const formatDate = (date: any) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatDateForRequest = (date: string) => {
        const [day, month, year] = date.split("/");
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        if (!selectedFromDate || !selectedToDate) {
            setSelectedFromDate(formattedDate);
            setSelectedToDate(formattedDate);
        }
        const fetchLedgerData = async () => {
            if (selectedFromDate && selectedToDate) {
                setLoading(true);
                setNoData(false);
                try {
                    const formattedFromDate = formatDateForRequest(selectedFromDate);
                    const formattedToDate = formatDateForRequest(selectedToDate);
                    const response = await (viewMode === "date"
                        ? ledgerDateWiseApiReq({
                            Usertype: userData?.UserType,
                            Username: userData?.UserCode,
                            Firm_No: userData?.Branch_Code,
                            From_Date: formattedFromDate,
                            To_Date: formattedToDate,
                        }).unwrap()
                        : ledgerMonthWiseApiReq({
                            Usertype: userData?.UserType,
                            Username: userData?.UserCode,
                            Firm_No: userData?.Branch_Code,
                            From_Date: formattedFromDate,
                            To_Date: formattedToDate,
                        }).unwrap());

                    console.log(`${viewMode === "date" ? "Date-wise" : "Month-wise"} API Response:`, response);

                    const hasData = response?.SuccessFlag === "true" && Array.isArray(response.Message) && response.Message.length > 0;
                    if (viewMode === "date") {
                        setDateWiseData(hasData ? response.Message : []);
                    } else {
                        setMonthWiseData(hasData ? response.Message : []);
                    }
                    setNoData(!hasData);
                } catch (error) {
                    console.error("Error fetching ledger data:", error);
                    setDateWiseData([]);
                    setMonthWiseData([]);
                    setNoData(true);
                }
                setLoading(false);
            }
        };
        const timer = setTimeout(fetchLedgerData, 100);
        return () => clearTimeout(timer);
    }, [selectedFromDate, selectedToDate, viewMode, userData, ledgerDateWiseApiReq, ledgerMonthWiseApiReq]);

    const openCalendar = (type: string) => {
        setCalendarType(type);
        setShowCalendar(true);
    };

    const handleDateSelection = (selectedDate: any) => {
        const formattedDate = formatDate(new Date(selectedDate));
        const selectedDateObj = new Date(selectedDate);
        if (calendarType === 'from') {
            const toDateObj = new Date(selectedToDate.split('/').reverse().join('-'));
            if (selectedDateObj > toDateObj) {
                Alert.alert('Invalid Date Range', 'The "From" date cannot be later than the "To" date.');
                return;
            }
            setSelectedFromDate(formattedDate);
        } else {
            const fromDateObj = new Date(selectedFromDate.split('/').reverse().join('-'));
            if (selectedDateObj < fromDateObj) {
                Alert.alert('Invalid Date Range', 'The "To" date must be greater than or equal to the "From" date.');
                return;
            }
            setSelectedToDate(formattedDate);
        }
        setShowCalendar(false);
    };

    const handleIndexChange = (index: number) => {
        setViewMode(index === 0 ? "date" : "month");
    };

    return (
        <View style={styles.container}>
            <NavigationBar title="Ledger" />
            <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                <View style={styles.dateContainer}>
                    <View style={styles.datePickerContainer}>
                        <Text style={styles.label}>From</Text>
                        <TouchableOpacity onPress={() => openCalendar("from")} style={styles.datePicker}>
                            <Text style={styles.dateText}>{selectedFromDate}</Text>
                            <Image source={require("../images/calendar.png")} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.datePickerContainer}>
                        <Text style={styles.label}>To</Text>
                        <TouchableOpacity onPress={() => openCalendar("to")} style={styles.datePicker}>
                            <Text style={styles.dateText}>{selectedToDate}</Text>
                            <Image source={require("../images/calendar.png")} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>

                <SegmentedControlTab
                    values={["Date-wise", "Month-wise"]}
                    selectedIndex={viewMode === "date" ? 0 : 1}
                    onTabPress={handleIndexChange}
                    tabsContainerStyle={styles.tabContainer}
                    tabStyle={styles.tabStyle}
                    activeTabStyle={styles.activeTabStyle}
                    tabTextStyle={styles.tabTextStyle}
                    activeTabTextStyle={styles.activeTabTextStyle}
                />
            </View>

            {loading ? (
                <SpinnerIndicator />
            ) : noData ? (
                <View style={styles.noDataContainer}>
                    <Text style={styles.noDataText}>{getLabel("aboutscr_5")}</Text>
                </View>
            ) : (
                <View style={styles.tableContainer}>
                    {/* Table Header */}
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCell, styles.flex]}>Date/Month</Text>
                        <Text style={[styles.tableCell, styles.flex]}>Payment</Text>
                        <Text style={[styles.tableCell, styles.flex]}>Deposit</Text>
                        <Text style={[styles.tableCell, styles.flex]}>Sales</Text>
                        <Text style={[styles.tableCell, styles.flex]}>Adjustment</Text>
                        <Text style={[styles.tableCell, styles.flex]}>Closing Bal.</Text>
                    </View>

                    <FlatList
                        data={viewMode === "date" ? dateWiseData : monthWiseData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <View style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
                                <Text style={[styles.tableCell, styles.flex1]}>
                                    {viewMode === "date" ? new Date(item.Sid_Date).toLocaleDateString() : item.Ledger_Month}
                                </Text>
                                <Text style={[styles.tableCell, styles.flex1]}>{item.Payment}</Text>
                                <Text style={[styles.tableCell, styles.flex1]}>{item.Deposit}</Text>
                                <Text style={[styles.tableCell, styles.flex1]}>{item.Sales}</Text>
                                <Text style={[styles.tableCell, styles.flex1]}>{item.Adjustment}</Text>
                                <Text style={[styles.tableCell, styles.flex1]}>{item.ClosingBalance || item.Collection}</Text>
                            </View>
                        )}
                    />
                </View>
            )}
            <CalendarModal isVisible={showCalendar} onConfirm={handleDateSelection} onCancel={() => setShowCalendar(false)} mode="date" onClose={false} />
        </View>
    );
};

export default LedgerDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Constants.COLOR.WHITE_COLOR,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    noDataText: {
        color: Constants.COLOR.BLACK_COLOR,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
        fontSize: Constants.FONT_SIZE.SM,
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
        color: Constants.COLOR.BLACK_COLOR,
        fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
    },
    activeTabTextStyle: {
        color: Constants.COLOR.WHITE_COLOR,
        fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
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
        fontSize: Constants.FONT_SIZE.S,
        fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
        marginBottom: 5,
    },
    datePicker: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Constants.COLOR.WHITE_COLOR,
        borderRadius: 8,
        shadowColor: Constants.COLOR.THEME_COLOR,
        elevation: 3,
        padding: 10,
        width: '100%',
    },
    dateText: {
        fontSize: Constants.FONT_SIZE.XS,
        fontFamily: Constants.FONT_FAMILY.fontFamilyRegular,
    },
    icon: {
        width: 14,
        height: 14,
        resizeMode: 'contain',
    },
    tableContainer: {
        marginTop: 10,
        borderRadius: 8,
        overflow: "hidden",
        maxHeight: 500
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tableHeader: {
        padding: 8,
        backgroundColor: Constants.COLOR.THEME_COLOR,
        textAlign: 'center',
        fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold,
    },
    tableCell: {
        paddingVertical: 10,
        flex: 1,
        textAlign: 'center',
        fontSize: Constants.FONT_SIZE.SM,
    },
    flex1: {
        flex: 1,
        fontSize: 10,
        color: Constants.COLOR.BLACK_COLOR
    },
    flex: {
        flex: 1,
        fontSize: 10,
        color: Constants.COLOR.WHITE_COLOR
    },
    evenRow: {
        backgroundColor: '#f9f9f9',
    },
    oddRow: {
        backgroundColor: Constants.COLOR.WHITE_COLOR,
    },
});
