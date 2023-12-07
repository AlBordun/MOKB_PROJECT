import React, {useEffect, useRef, useState} from 'react';
import 'tailwindcss/tailwind.css';
import axios from 'axios';
import dayjs, {Dayjs} from 'dayjs';
import {Patient} from '../Patient/Patient'; // Импорт типа данных пациента
import {Box, Stack} from '@mui/system';
import {
    Grid,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    SelectChangeEvent,
    TextField
} from '@mui/material';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {
    LocalizationProvider,
    DateField
} from "@mui/x-date-pickers";


// Определение интерфейса для свойств FormModal
interface FormModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (data: Patient) => void;
    patient: Patient | null;
    copyData?: () => Patient; // Функция для копирования данных из других модалок
}

interface OptionItem {
    // tag: number;
    text: string;
}

const FormModal: React.FC<FormModalProps> = ({show, onClose, onSave, patient, copyData}) => {
    console.log('Current patient:', patient);
    const [formData, setFormData] = useState<Patient | null>(patient);
    const [isDataChanged, setIsDataChanged] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null)
    const [gender, setGender] = React.useState('');
    const [selectedValue, setSelectedValue] = useState('');
    // const [options, setOptions] = useState([]); // Состояние для хранения опций
    const [options, setOptions] = useState<string[]>([])
    const [value, setValue] = React.useState<Dayjs | null>(dayjs('00-00-0000'));

    useEffect(() => {
        console.log('Options updated:', options);
    }, [options]);
    // Функции обработчики событий формы
    const handlePreview = async () => {
        if (formData) {
            try {
                const response = await axios.post('http://localhost:8080/api/api/preview', formData, {responseType: 'blob'});
                // Создание URL для blob
                const file = new Blob([response.data], {type: 'application/pdf'}); // или 'text/html', в зависимости от вашего ответа
                const fileURL = URL.createObjectURL(file);
                // Открытие нового окна для предпросмотра
                window.open(fileURL, '_blank');
            } catch (error) {
                console.error('Ошибка при получении предпросмотра', error);
            }
        }
    };

    // useEffect(() => {
    //     // Функция для запроса данных
    //     const fetchData = async () => {
    //         try {
    //             const tag = 10; // Тэг для пола
    //             const response = await fetch('http://localhost:8080/api/reference/ref_lists?tag=10');
    //             const data: OptionItem[] = await response.json();
    //             console.log(data);
    //             const optionLabels = data.map(item => item.text);
    //             setOptions(optionLabels); // Сохранение полученных данных в состоянии
    //         } catch (error) {
    //             console.error('Ошибка при загрузке данных:', error);
    //         }
    //     };
    //
    //     fetchData();
    // }, []); // Пустой массив зависимостей гарантирует, что запрос выполняется один раз при монтировании

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/reference/ref_listss?tag=10');
                console.log('Response data:', response.data); // Добавьте лог для отображения ответа сервера
                const data: OptionItem[] = response.data;
                data.forEach((item, index) => {
                    console.log(`Item ${index}:`, item);
                });
                console.log('Data:', data); // Добавьте лог для отображения обработанных данных
                const optionLabels = data.map(item => typeof item === 'string' ? item : '');
                console.log('Option labels before set:', optionLabels); // Добавьте лог перед установкой нового состояния
                setOptions(optionLabels);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };
        fetchData();
    }, []);

    const handlePrint = () => {
        handlePreview(); // Показать предпросмотр перед печатью
        window.print();
    };

    const handleChange = (event: SelectChangeEvent) => {
        console.log("Selected gender:", event.target.value);
        setGender(event.target.value as string);
    };

    // const handleChange = (
    //     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //     const { name, value } = e.target;
    //     const name = e.target.name as keyof typeof formData;
    //     const value = e.target.value;
    //     if(name) {
    //         setFormData(prevFormData => ({
    //             ...prevFormData,
    //             [name]: value
    //         }));
    //         setIsDataChanged(true);
    //     }
    //     };
// const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //     const {name, value} = e.target;
    //     setFormData({
    //         ...formData,
    //         id: '',
    //         refType: "",
    //         address: "",
    //         dateOfBirth: "",
    //         directionNumber: "",
    //         documentType: "",
    //         firstName: "",
    //         gender: "",
    //         lastName: "",
    //         passportNumber: "",
    //         passportSeries: "",
    //         middleName: "",
    //         policyNumber: "",
    //         populationCategory: "",
    //         referralDate: "",
    //         snils: "",
    //         [name]: value
    //     });
    //     setIsDataChanged(true);
    // };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/patients/save', formData);
            onSave(response.data);
            setIsDataChanged(false);
            onClose();
        } catch (error) {
            console.error('Ошибка при сохранении данных пациента', error);
        }
    };
    const handleCopyData = () => {
        if (patient) {
            setFormData(patient); // Копирование данных из patient в formData
            setIsDataChanged(true); // Установка флага, что данные были изменены
        }
    };
    useEffect(() => {
        if (patient) {
            setFormData(patient);
        }
    }, [patient]);

    const handleModalClose = () => {
        const hasChanges = isDataChanged || (formData && JSON.stringify(formData) !== JSON.stringify(patient));
        if (isDataChanged && !window.confirm('Данные не сохранены. Вы уверены, что хотите выйти?')) {
            return;
        }
        onClose();
    };
    const handleSaveData = (patientData: Patient) => {
        // Логика для обработки данных формы
        console.log("Сохраняемые данные:", patientData);
        setIsModalOpen(false); // Закрытие модального окна после сохранения данных
    }

    useEffect(() => {
        const handleWrapperClick = (event: MouseEvent) => {
            const {target} = event;

            if (target instanceof Node && rootRef.current === target) {
                onClose();
            }
        };
        const handleEscapePress = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('click', handleWrapperClick);
        window.addEventListener('keydown', handleEscapePress);

        return () => {
            window.removeEventListener('click', handleWrapperClick);
            window.removeEventListener('keydown', handleEscapePress);
        };
    }, [onClose]);

    if (!show) {
        return null;
    }
    console.log('Rendering FormModal');
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <Modal open={show} onClose={onClose} disableScrollLock={true}>
                    <Box
                        component="form"
                        sx={{
                            display: 'flex',
                            width: 1000, // фиксированная ширина, например, 500px
                            height: 600, // фиксированная высота, например, 600px
                            overflow: 'auto',
                            position: 'absolute',
                            maxHeight: '90vh',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'white',
                            boxShadow: 24,
                            p: 4,
                            '& .MuiTextField-root': {
                                margin: '5px',
                                width: '40%',
                                // padding: '5px',

                            },
                            '& .MuiSelect-root': {
                                margin: '10px',
                                width: '40%',
                                padding: '5px',

                            }
                        }}
                    >
                        <Grid container spacing={0} sx={{
                            // display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            {/* Первая колонка */}
                            <Grid item xs={12} sm={6} sx={{
                                padding: '12px',
                                justifyContent: 'center'
                            }}>
                                {/*Верхние 3 филда*/}
                                <Grid sx = {{
                                    width : '450px',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    {/*Номер*/}
                                    <TextField disabled id="outlined-disabled" label="№" fullWidth
                                               sx={{
                                                   maxWidth: 80,
                                                   margin: '6px',
                                               }}
                                    />
                                    {/*Категория*/}
                                    <FormControl fullWidth sx={{
                                        maxWidth: 120,
                                        margin: '8px'
                                    }}>
                                        <InputLabel id="populationCategory">Категория Населения</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={gender}
                                            onChange={handleChange}
                                            label="Gender"
                                        >
                                            {options.map((option, index) => (
                                                <MenuItem key={index} value={option}>{option}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    {/*Пол*/}
                                    <FormControl fullWidth sx={{
                                        maxWidth: 120,
                                        margin: '8px'
                                    }}>
                                        <InputLabel id="gender">Пол</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={gender}
                                            onChange={handleChange}
                                            label="Gender"
                                        >
                                            {options.map((option, index) => (
                                                <MenuItem key={index} value={option}>{option}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <TextField id="filled-basic" label="Поле" variant="outlined" fullWidth/>
                                <TextField label="firstName" variant="outlined" fullWidth/>
                                <TextField label="lastName" variant="outlined" fullWidth/>
                                <TextField label="middleName" variant="outlined" fullWidth/>
                                <TextField label="address" variant="outlined" fullWidth/>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateField
                                        label="Дата Рождения"
                                        value={value}
                                        onChange={(newValue) => setValue(newValue)}
                                        format="DD-MM-YYYY"
                                    />
                                </LocalizationProvider>
                               <Grid>
                                <TextField label="Additional Information"
                                           variant="outlined"
                                           multiline
                                           rows={4}
                                           fullWidth
                                           sx={{
                                               width: '500px'
                                           }}
                                />
                               </Grid>
                            </Grid>
                            {/* Вторая колонка */}
                            <Grid item xs={12} sm={6} sx={{
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <TextField label="referralDate" variant="standard" fullWidth/>
                                <TextField label="snils" variant="standard" fullWidth/>
                                <TextField label="policyNumber" variant="standard" fullWidth/>
                                <TextField label="documentType" variant="standard" fullWidth/>
                                <TextField label="passportSeries" variant="standard" fullWidth/>
                                <TextField label="passportNumber" variant="standard" fullWidth/>


                            </Grid>
                        </Grid>

                        {/* Кнопки */}
                        <Stack direction="row" spacing={2} justifyContent="center">
                            {/* Ваши кнопки */}
                        </Stack>
                    </Box>
                </Modal>

                {/* ... Другие поля, как требуется */}

            </form>
        </div>

    )
        ;

};

export default FormModal;