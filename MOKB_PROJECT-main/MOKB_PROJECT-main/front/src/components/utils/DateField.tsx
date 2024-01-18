import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import dayjs from 'dayjs';
import { Dayjs } from 'dayjs';

interface DateFieldProps {
    label: string;
    value: Dayjs | null;
    onChange: (newValue: Dayjs | null) => void;
    format: string;
}

const DateField: React.FC<DateFieldProps> = ({ label, value, onChange, format }) => {
    return (
        <DatePicker
            label={label}
            value={value}
            onChange={onChange}
            format={format}
        />
    );
};

export default DateField;