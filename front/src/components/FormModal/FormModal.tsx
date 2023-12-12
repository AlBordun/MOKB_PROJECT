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
    TextField, IconButton,
} from '@mui/material';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {
    LocalizationProvider,
    DateField
} from "@mui/x-date-pickers";
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';

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
    const [options, setOptions] = useState<string[]>([])
    const [value, setValue] = React.useState<Dayjs | null>(dayjs());

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
        // Этот контейнер Grid служит для центрирования всей формы и ее элементов.
        <Grid container spacing={2} sx={{
            // display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {/*/!*Форма, управляющая отправкой данных и обработкой событий формы*!/*/}
            {/*<form onSubmit={handleSubmit}>*/}
                {/*Модальное окно, внутри которого находится содержимое формы.*/}
                <Modal open={show} onClose={onClose}
                       disableScrollLock={true}
                >
                    {/*Главный Grid контейнер внутри модального окна для структурирования контента.*/}
                    <Grid container sx={{
                        overflow: 'auto',
                        position: 'absolute', // Абсолютное позиционирование для точного контроля
                        top: '50%', // Позиционирование относительно верха
                        left: '50%', // Позиционирование относительно левого края
                        transform: 'translate(-50%, -50%)', // Смещение для точного центрирования
                        // width: '60%', // Ширина модального окна
                        width: 'auto', // Автоматическая ширина, адаптируется к содержимому
                        height: 'auto', // Высота модального окна
                        bgcolor: 'background.paper', // Цвет фона
                        boxShadow: 24, // Тень
                        p: 3, // Внутренний отступ
                        maxHeight: '90vh', // Максимальная высота
                        borderRadius: '16px' // Скругление
                    }}>
                        {/*Крестик*/}
                        <IconButton
                            onClick={handleModalClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                                '&:hover': {
                                    color: 'red', // Цвет при наведении
                                    transform: 'rotate(90deg)', // Вращение на 90 градусов при наведении
                                    transition: 'transform 0.3s ease-in-out', // Анимация вращения
                                }
                            }}>
                            <CloseIcon/>
                        </IconButton>

                        {/*Верхние 3 кнопки*/}
                        <Grid xs={12}
                              sx={{
                                  padding: '12px',

                              }}
                        >
                            {/*Номер*/}
                            <TextField disabled id="outlined-disabled" label="№" fullWidth
                                       sx={{
                                           maxWidth: 80,
                                           margin: '6px',
                                       }}
                            />
                            <FormControl fullWidth sx={{
                                maxWidth: 120,
                                margin: '6px',
                            }}
                            >
                                {/*Категория*/}
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
                                margin: '6px',
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

                        <Grid item xs={12} sm={6} sx={{

                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '12px',

                            '& .MuiTextField-root': {
                                marginBottom: '6px',

                            },
                            '& .MuiFormControl-root': {
                                marginBottom: '12px',
                            }
                        }}>
                            {/*<TextField id="filled-basic" label="Поле" variant="outlined" fullWidth/>*/}
                            <TextField label="Фамилия" variant="outlined" fullWidth/>
                            <TextField label="Имя" variant="outlined" fullWidth/>
                            <TextField label="Отчество" variant="outlined" fullWidth/>

                            {/*Дата рождения*/}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateField
                                    label="Дата Рождения"
                                    value={value}
                                    onChange={(newValue) => setValue(newValue)}
                                    format="DD-MM-YYYY"
                                />
                            </LocalizationProvider>
                            <TextField label="Адрес прописки" variant="outlined" fullWidth/>
                            <TextField label="Адрес проживания" variant="outlined" fullWidth/>

                        </Grid>
                        {/*</Grid>*/}
                        {/*Вторая колонка для других элементов управления.*/}
                        {/*Аналогично первой колонке, определяет стилизацию и расположение элементов.*/}
                        <Grid item xs={12} sm={6} sx={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '12px',

                            '& .MuiTextField-root': {
                                marginBottom: '12px',
                            }
                        }}>
                            <TextField label="Код кат. льготы" variant="outlined" fullWidth/>
                            <TextField label="Снилс" variant="outlined" fullWidth/>
                            <TextField label="Полис" variant="outlined" fullWidth/>
                            <TextField label="Документ" variant="outlined" fullWidth/>
                            <TextField label="Серия паспорта" variant="outlined" fullWidth/>
                            <TextField label="Номер паспорта" variant="outlined" fullWidth/>

                        </Grid>

                        <Grid item xs={12} container spacing={2}
                              sx={{
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  padding: '12px',

                                  '& .MuiTextField-root': {
                                      marginBottom: '12px',
                                  }
                              }}
                        >
                            <Grid item xs={12} sm={6}>
                                {/* Три текстовых поля для левой колонки */}
                                <TextField label="Группа ВМП" variant="outlined" fullWidth/>
                                <TextField label="Инвалидность" variant="outlined" fullWidth/>
                                <TextField label="Дата Направления" variant="outlined" fullWidth/>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {/* Три текстовых поля для правой колонки */}
                                <TextField label="MKB10" variant="outlined" fullWidth/>
                                <TextField label="Профиль" variant="outlined" fullWidth/>
                                <TextField label="Институт" variant="outlined" fullWidth/>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}
                              sx={{
                                  padding: '12px',
                              }}
                        >
                            <TextField
                                fullWidth
                                label="Дополнительная информация"
                                variant="outlined"
                                multiline
                                rows={4}
                            />
                        </Grid>
                        {/*Контейнер Stack для кнопок.*/}
                        {/*Определяет горизонтальное расположение и расстояние между кнопками.*/}
                        {/*<Grid item xs={12}*/}
                        {/*      sx={{*/}
                        {/*          padding: '12px',*/}
                        {/*      }}*/}
                        {/*>*/}
                        {/*<Stack direction="row" spacing={1} justifyContent="center" alignContent="center"*/}
                        {/*>*/}
                        {/*<Button*/}
                        {/*    onClick={handlePreview}*/}
                        {/*    variant="outlined"*/}
                        {/*    sx = {{*/}
                        {/*            color: '#e65100',*/}
                        {/*            borderColor: '#e65100',*/}
                        {/*            // borderRadius: '16px',*/}
                        {/*            '&:hover': {*/}
                        {/*                transitionDuration: '500ms',*/}
                        {/*                backgroundColor: '#e65100', // Цвет фона при наведении*/}
                        {/*                color: 'white', // Цвет текста при наведении*/}
                        {/*                borderColor: '#e65100',*/}
                        {/*            }*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    <VisibilityOutlinedIcon/>*/}
                        {/*    Предпросмотр</Button>*/}

                        {/*<Button onClick={handleCopyData}*/}
                        {/*        variant="outlined"*/}
                        {/*        sx = {{*/}
                        {/*            color: '#e65100',*/}
                        {/*            borderColor: '#e65100',*/}
                        {/*            // borderRadius: '16px',*/}
                        {/*            '&:hover': {*/}
                        {/*                transitionDuration: '500ms',*/}
                        {/*                backgroundColor: '#e65100', // Цвет фона при наведении*/}
                        {/*                color: 'white', // Цвет текста при наведении*/}
                        {/*                borderColor: '#e65100',*/}
                        {/*            }*/}
                        {/*        }}*/}
                        {/*>*/}
                        {/*    <FileCopyOutlinedIcon/>*/}
                        {/*    Копировать данные</Button>*/}
                        <div className="flex flex-row items-center justify-center">
                            {/*Форма, управляющая отправкой данных и обработкой событий формы*/}
                            <div className="fill-button"
                            ><button onClick={handlePreview} className="btn">Предпросмотр</button></div>
                                <div className="fill-button"
                                ><button onClick={handleCopyData} className="btn">Копировать</button></div>
                                <div className="fill-button"
                                ><button onClick={handlePrint} className="btn">Печать</button></div>
                            <form onSubmit={handleSubmit}><button type = "submit" className="btn">Сохранить</button></form>
                            {/*<div className="fill-button"*/}
                            {/*><button onClick={handleSubmit} className="btn">Сохранить</button></div>*/}
                                    {/*<Button onClick={handlePrint}*/}
                                    {/*        variant="outlined"*/}
                                    {/*        sx={{*/}
                                    {/*            color: '#e65100',*/}
                                    {/*            borderColor: '#e65100',*/}
                                    {/*            // borderRadius: '16px',*/}
                                    {/*            '&:hover': {*/}
                                    {/*                transitionDuration: '500ms',*/}
                                    {/*                backgroundColor: '#e65100', // Цвет фона при наведении*/}
                                    {/*                color: 'white', // Цвет текста при наведении*/}
                                    {/*                borderColor: '#e65100',*/}
                                    {/*            }*/}
                                    {/*        }}*/}
                                    {/*>*/}
                                    {/*    <PrintOutlinedIcon/>*/}
                                    {/*    Печать</Button>*/}
                        </div>
                        {/*</Stack>*/}
                        {/*</Grid>*/}
                    </Grid>
                </Modal>

        </Grid>
    );

};

export default FormModal;