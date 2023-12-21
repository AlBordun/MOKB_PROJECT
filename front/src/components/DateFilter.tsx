import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface DateFilterProps {
    onStartDateChange: (date: Date | null) => void;
    onEndDateChange: (date: Date | null) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ onStartDateChange, onEndDateChange }) => {
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());



    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} >
            <DatePicker sx = {{
                margin: 2
            }}
                label="Начальная дата"
                value={startDate}
                onChange={(newValue: Date | null) => {
                    setStartDate(newValue);
                    onStartDateChange(newValue);
                }}
                slotProps={{ textField: { variant: 'outlined' } }}
            />
            <DatePicker
                label="Конечная дата"
                value={endDate}
                onChange={(newValue: Date | null) => {
                    setEndDate(newValue);
                    onEndDateChange(newValue);
                }}
                slotProps={{ textField: { variant: 'outlined' } }}
            />
        </LocalizationProvider>
    );
};

export default DateFilter