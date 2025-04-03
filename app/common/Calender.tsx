import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback, TextInput, TouchableOpacity, Text } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Constants from '../util/Constants';

// Ensure locales are defined before usage
LocaleConfig.locales['en'] = {
    monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    today: "Today"
};

LocaleConfig.locales['ar-SA'] = {
    monthNames: [
        'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ],
    monthNamesShort: ['ينا.', 'فبر.', 'مار.', 'أبر.', 'ماي.', 'يون.', 'يول.', 'أغس.', 'سبت.', 'أكت.', 'نوف.', 'ديس.'],
    dayNames: ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'],
    dayNamesShort: ['أحد', 'إثن', 'ثلا', 'أرب', 'خمس', 'جمع', 'سبت'],
    today: 'اليوم'
};

// Set the default locale once
LocaleConfig.defaultLocale = 'en';

const CalendarModal = ({ selectedLanguage, isVisible, onClose, onConfirm }: any) => {
    console.log('oncloose', onClose);

    const today = new Date().toISOString().split('T')[0];
    const [selected, setSelected] = useState('');
    const [year, setYear] = useState('');
    const [currentDate, setCurrentDate] = useState(today);
    const [key, setKey] = useState(0);

    // Dynamically update locale safely
    React.useEffect(() => {
        if (selectedLanguage?.Code) {
            const localeCode = selectedLanguage.Code === 'ar-SA' ? 'ar-SA' : 'en';
            LocaleConfig.defaultLocale = localeCode;
            setKey(prevKey => prevKey + 1);
        }
    }, [selectedLanguage]);

    const handleYearChange = () => {
        if (year.length === 4) {
            const newDate = `${year}-01-01`;
            setCurrentDate(newDate);
            setKey(prevKey => prevKey + 1);
        }
    };

    return (
        <Modal visible={isVisible} transparent animationType="fade" >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        {/* Year Input */}
                        <View style={styles.inputContainer}>
                            <TextInput style={styles.input}
                                keyboardType="numeric"
                                maxLength={4}
                                value={year}
                                onChangeText={setYear}
                                placeholder={selectedLanguage?.Code === 'ar-SA' ? 'أدخل السنة' : 'Enter Year'}
                                placeholderTextColor={Constants.COLOR.FONT_COLOR_DEFAULT}
                            />
                            <TouchableOpacity style={styles.goButton} onPress={handleYearChange}>
                                <Text style={styles.goButtonText}>Go</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            borderBottomWidth: 0.5,
                            borderBottomColor: 'black',
                        }}></View>

                        {/* Calendar */}
                        <Calendar
                            key={key}
                            style={styles.calendar}
                            current={currentDate}
                            theme={{
                                backgroundColor: Constants.COLOR.THEME_COLOR,
                                calendarBackground: Constants.COLOR.WHITE_COLOR,
                                textSectionTitleColor: Constants.COLOR.THEME_COLOR,
                                selectedDayTextColor: Constants.COLOR.THEME_COLOR,
                                todayTextColor: Constants.COLOR.WHITE_COLOR,
                                dayTextColor: Constants.COLOR.THEME_COLOR,
                                todayBackgroundColor: Constants.COLOR.THEME_COLOR,
                                monthTextColor: Constants.COLOR.BLACK_COLOR,
                                arrowColor: 'black',
                                textMonthFontWeight: Constants.FONT_FAMILY.fontFamilySemiBold,
                                textDayHeaderFontWeight: Constants.FONT_FAMILY.fontFamilySemiBold,
                                textDayFontSize: 16,
                                textMonthFontSize: 16,
                                textDayHeaderFontSize: 14
                            }}
                            onDayPress={day => {
                                setSelected(day.dateString);
                                onConfirm(day.dateString);
                            }}
                            markedDates={{
                                [selected]: { selected: true, disableTouchEvent: true }
                            }}
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: Constants.COLOR.WHITE_COLOR,
        borderRadius: 10,
        padding: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    input: {
        flex: 1,
        borderWidth: 0.5,
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        color: 'black',
        backgroundColor: 'white',
        marginRight: 10,
    },
    goButton: {
        backgroundColor: Constants.COLOR.THEME_COLOR,
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    goButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    calendar: {
        overflow: 'hidden',
    },
});

export default CalendarModal;


