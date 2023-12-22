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
                margin: 2,
                borderColor: 'grey.700',
                // '& .MuiOutlinedInput-root': {
                //     position: 'relative',
                //     '&::after': {
                //         content: '""',
                //         position: 'absolute',
                //         left: 0,
                //         bottom: 0,
                //         width: 0,
                //         height: '100%',
                //         border: '2px solid red',
                //         borderRadius: '4px', // радиус скругления углов должен соответствовать вашему дизайну
                //         transition: 'width 0.3s ease',
                //         zIndex: 9,
                //     },
                //     '&:focus-within::after': {
                //         width: '100%',
                //     },
                //     '& .MuiOutlinedInput-notchedOutline': {
                //         borderColor: 'transparent', // прозрачная граница, чтобы показать только анимированную
                //         zIndex: 10,
                //     },
                // },

                // '& .MuiOutlinedInput-root': {
                //     position: 'relative',
                //     '&::before': {
                //         content: '""',
                //         position: 'absolute',
                //         left: 0,
                //         top: 0,
                //         bottom: 0,
                //         right: 0,
                //         border: '1px solid black', // Внешняя статическая граница
                //         borderRadius: '4px',
                //         pointerEvents: 'none', // предотвращение взаимодействия с мышью
                //         zIndex: 1,
                //     },
                //     '&::after': {
                //         content: '""',
                //         position: 'absolute',
                //         left: 0,
                //         top: 0,
                //         bottom: 0,
                //         right: '100%',
                //         border: '2px solid red', // Внутренняя анимированная граница
                //         borderRadius: '4px',
                //         transition: 'right 0.3s ease',
                //         pointerEvents: 'none',
                //         zIndex: 2,
                //         borderColor: 'transparent',
                //         clipPath: 'inset(0 0 0 0)'
                //     },
                //     '&:hover::after, &:focus-within::after': {
                //         right: 0, // Анимация границы
                //         borderColor: 'red',
                //     },
                //     '& .MuiOutlinedInput-notchedOutline': {
                //         border: 'grey', // Скрыть стандартную границу
                //     },
                //     '& .MuiFormLabel-outlined.Mui-focused': {
                //         color: 'red',
                //     },
                // },
                '$ .MuiFormControl-root': {
                    content: '""',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            right: '100%',
                            border: '2px solid red', // Внутренняя анимированная граница
                            borderRadius: '4px',
                            transition: 'right 0.3s ease',
                            pointerEvents: 'none',
                            zIndex: 2,
                            borderColor: 'transparent',
                },
                '& .MuiFormLabel-root.Mui-focused': {
                    color: 'red',
                    transition: '0.3s ease',
                    '$:hover':{
                        color: 'red',
                        transition: 'right 0.3s ease',
                    },
                }
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