import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
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

const formatDate = (date: any) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const formatDateForRequest = (date: any) => {
    const [day, month, year] = date.split("/");
    return `${year}-${month}-${day}`;
};

const LedgerDetailsScreen = () => {
    const { userData } = useUser();
    const [ledgerDateWiseApiReq] = useLedgerDateWiseMutation();
    const [ledgerMonthWiseApiReq] = useLedgerMonthWiseMutation();
    const [data, setData] = useState({ dateWise: [], monthWise: [] });
    const [dates, setDates] = useState({ from: "", to: "" });
    const [calendar, setCalendar] = useState({ show: false, type: "" });
    const [viewMode, setViewMode] = useState("date");
    const [loading, setLoading] = useState(true);
    const [noData, setNoData] = useState(false);
    const { settings } = useAppSettings();

    const labels = settings?.Message?.[0]?.Labels || {};

    const getLabel = (key: any) => labels[key]?.defaultMessage || "";

    useEffect(() => {
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        if (!dates.from || !dates.to) {
            setDates({ from: formattedDate, to: formattedDate });
        }
        const fetchLedgerData = async () => {
            if (dates.from && dates.to) {
                setLoading(true);
                setNoData(false);
                try {
                    const formattedFromDate = formatDateForRequest(dates.from);
                    const formattedToDate = formatDateForRequest(dates.to);
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

                    const hasData = response?.SuccessFlag === "true" && Array.isArray(response.Message) && response.Message.length > 0;
                    setData(prev => ({ ...prev, [viewMode]: hasData ? response.Message : [] }));
                    setNoData(!hasData);
                } catch (error) {
                    console.error("Error fetching ledger data:", error);
                    setData({ dateWise: [], monthWise: [] });
                    setNoData(true);
                }
                setLoading(false);
            }
        };
        const timer = setTimeout(fetchLedgerData, 100);
        return () => clearTimeout(timer);
    }, [dates, viewMode, userData]);

    const openCalendar = (type: any) => {
        setCalendar({ show: true, type });
    };

    const handleDateSelection = (selectedDate: any) => {
        const formattedDate = formatDate(new Date(selectedDate));
        const selectedDateObj = new Date(selectedDate);
        const otherDate = dates[calendar.type === 'from' ? 'to' : 'from'];
        const otherDateObj = new Date(otherDate.split('/').reverse().join('-'));

        if ((calendar.type === 'from' && selectedDateObj > otherDateObj) ||
            (calendar.type === 'to' && selectedDateObj < otherDateObj)) {
            Alert.alert('Invalid Date Range', `The "${calendar.type}" date is invalid.`);
            return;
        }
        setDates(prev => ({ ...prev, [calendar.type]: formattedDate }));
        setCalendar({ show: false, type: "" });
    };

    const handleIndexChange = (index: any) => {
        setViewMode(index === 0 ? "date" : "month");
    };

    const renderItem = ({ item, index }: any) => (
        <View style={[styles.tableRow, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
            <Text style={[styles.tableCell, styles.tableText]}>{viewMode === "date" ? new Date(item.Sid_Date).toLocaleDateString() : item.Ledger_Month}</Text>
            <Text style={[styles.tableCell, styles.tableText]}>{item.Payment}</Text>
            <Text style={[styles.tableCell, styles.tableText]}>{item.Deposit}</Text>
            <Text style={[styles.tableCell, styles.tableText]}>{item.Sales}</Text>
            <Text style={[styles.tableCell, styles.tableText]}>{item.Adjustment}</Text>
            <Text style={[styles.tableCell, styles.tableText]}>{item.ClosingBalance || item.Collection}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <NavigationBar title="Ledger" />
            <View style={styles.content}>
                <View style={styles.dateContainer}>
                    {["from", "to"].map((type) => (
                        <View key={type} style={styles.datePickerContainer}>
                            <Text style={styles.label}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
                            <TouchableOpacity onPress={() => openCalendar(type)} style={styles.datePicker}>
                                <Text style={styles.dateText}>{dates[type]}</Text>
                                <Image source={require("../images/calendar.png")} style={styles.icon} />
                            </TouchableOpacity>
                        </View>
                    ))}
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
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCell, styles.headerText]}>Date/Month</Text>
                        <Text style={[styles.tableCell, styles.headerText]}>Payment</Text>
                        <Text style={[styles.tableCell, styles.headerText]}>Deposit</Text>
                        <Text style={[styles.tableCell, styles.headerText]}>Sales</Text>
                        <Text style={[styles.tableCell, styles.headerText]}>Adjustment</Text>
                        <Text style={[styles.tableCell, styles.headerText]}>Closing Bal.</Text>
                    </View>
                    <FlatList
                        data={data[viewMode]}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={renderItem}
                    />
                </View>
            )}
            <CalendarModal isVisible={calendar.show} onConfirm={handleDateSelection} onCancel={() => setCalendar({ show: false, type: "" })} mode="date" />
        </View>
    );
};

export default LedgerDetailsScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Constants.COLOR.WHITE_COLOR },
    content: { paddingHorizontal: 10, paddingVertical: 10 },
    noDataContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 },
    noDataText: { color: Constants.COLOR.BLACK_COLOR, fontFamily: Constants.FONT_FAMILY.fontFamilyRegular, fontSize: Constants.FONT_SIZE.SM },
    tabContainer: { marginTop: 20, alignSelf: 'center', borderWidth: 0.8, borderRadius: 30, overflow: 'hidden', borderColor: Constants.COLOR.THEME_COLOR },
    tabStyle: { borderWidth: 0, paddingHorizontal: 5, borderRadius: 20, borderEndWidth: 0 },
    activeTabStyle: { backgroundColor: Constants.COLOR.THEME_COLOR, borderRadius: 20 },
    tabTextStyle: { color: Constants.COLOR.BLACK_COLOR, fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold },
    activeTabTextStyle: { color: Constants.COLOR.WHITE_COLOR, fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold },
    dateContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    datePickerContainer: { flex: 1, marginHorizontal: 5 },
    label: { fontSize: Constants.FONT_SIZE.S, fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold, marginBottom: 5 },
    datePicker: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: Constants.COLOR.WHITE_COLOR, borderRadius: 8, shadowColor: Constants.COLOR.THEME_COLOR, elevation: 3, padding: 10, width: '100%' },
    dateText: { fontSize: Constants.FONT_SIZE.XS, fontFamily: Constants.FONT_FAMILY.fontFamilyRegular },
    icon: { width: 14, height: 14, resizeMode: 'contain' },
    tableContainer: { marginTop: 10, overflow: "hidden", maxHeight: 500 },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ddd' },
    tableHeader: { backgroundColor: Constants.COLOR.THEME_COLOR, textAlign: 'center', fontFamily: Constants.FONT_FAMILY.fontFamilySemiBold },
    tableCell: { paddingVertical: 8, flex: 1, textAlign: 'center', fontSize: Constants.FONT_SIZE.XS },
    headerText: { color: Constants.COLOR.WHITE_COLOR },
    tableText: { color: Constants.COLOR.BLACK_COLOR },
    evenRow: { backgroundColor: '#f9f9f9' },
    oddRow: { backgroundColor: Constants.COLOR.WHITE_COLOR },
});

