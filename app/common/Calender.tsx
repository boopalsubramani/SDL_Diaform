import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Constants from '../util/Constants';


const CalendarModal = ({ isVisible, onConfirm, onCancel, mode }: any) => {
    return (
        <DateTimePickerModal
            isVisible={isVisible}
            mode={mode}
            onConfirm={onConfirm}
            onCancel={onCancel}
        />
    );
};

export default CalendarModal;
