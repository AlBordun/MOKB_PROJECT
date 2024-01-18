import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface DateFilterProps {
    onStartDateChange: (date: Date | null) => void;
    onEndDateChange: (date: Date | null) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ onStartDateChange, onEndDateChange }) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);



    return (
        <LocalizationProvider dateAdapter={AdapterDateFns} >
            <DatePicker sx = {{
                margin: 2,
                borderColor: 'grey.700',
                '$ .MuiFormControl-root': {
                    content: '""',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            right: '100%',
                            border: '2px solid deepskyblue', // Внутренняя анимированная граница
                            borderRadius: '4px',
                            transition: 'right 0.3s ease',
                            pointerEvents: 'none',
                            zIndex: 2,
                            borderColor: 'transparent',

                },

            }}
                label="Дата рождения с"
                value={startDate}
                onChange={(newValue: Date | null) => {
                    setStartDate(newValue);
                    onStartDateChange(newValue);
                }}
                slotProps={{ textField: { variant: 'outlined' } }}
            />
            <DatePicker
                label="Дата рождения до"
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