import React, {useEffect, useRef, useState} from 'react';
import 'tailwindcss/tailwind.css';
import axios from 'axios';
import dayjs, {Dayjs} from 'dayjs';
import {Patient} from '../DataInterfaces/Patient'; // Импорт типа данных пациента
import {
    Grid, FormControl, InputLabel,
    MenuItem, Modal,
    Select, SelectChangeEvent,
    TextField, IconButton,
    FormControlLabel, FormLabel,
    RadioGroup, Radio,
} from '@mui/material';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {
    LocalizationProvider,
    DateField
} from "@mui/x-date-pickers";
import CloseIcon from '@mui/icons-material/Close';
import Autocomplete from '@mui/material/Autocomplete';
import Switch, {SwitchProps} from '@mui/material/Switch';
import {styled} from "@mui/material/styles";

// Определение интерфейса для свойств FormModal
interface FormModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (patientData: Patient) => void;
    patient: Patient | null;
    handleCopyData?: (dataToCopy: any) => void; // Функция для копирования данных из других модалок
}

const FormModal: React.FC<FormModalProps> = ({show, onClose, onSave, patient}) => {
    console.log('Current patient:', patient);
    const [formData, setFormData] = useState<Patient | null>(patient);
    const [isDataChanged, setIsDataChanged] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null)
    // const [gender, setGender] = React.useState('');
    const [options, setOptions] = useState<string[]>([])
    const [value, setValue] = React.useState<Dayjs | null>(dayjs());
    const [tagValue, setTagValue] = React.useState('')
    const [dataByTag, setDataByTag] = useState<Map<number, string[]>>(new Map());
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [radioGroupValue, setRadioGroupValue] = React.useState('Направление');

    useEffect(() => {
        const fetchOptions = async (tag: number) => {
            return axios.get<string[]>(`http://localhost:8080/api/reference/ref_listss?tag=${tag}`);
        };

        const tags = [10, 20, 30,40,50,60,70,80,90,100,110,120,130,140]; // Замените на фактические значения тегов

        Promise.allSettled(tags.map(tag => fetchOptions(tag)))
            .then(results => {
                const newDataByTag = new Map<number, string[]>();
                results.forEach((result, index) => {
                    if (result.status === "fulfilled") {
                        console.log(`Response for tag ${tags[index]}:, response.data`);
                        newDataByTag.set(tags[index], result.value.data);
                    }
                    // Обработка данных для каждого запроса
                    // Например, обновление состояния для селекторов и автокомплитеров
                });
                setDataByTag(newDataByTag);
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
            });
    }, []);

    useEffect(() => {
        console.log('Options updated:', options);
    }, [options]);

    useEffect(() => {
        if (patient) {
            setFormData(patient);
        } else {
            // Очистите форму, если нет пациента
            setFormData(null);
        }
    }, [patient]);


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

    const handleCopyData = () => {
        if (patient) {
            setFormData(patient); // Копирование данных из patient в formData
            setIsDataChanged(true); // Установка флага, что данные были изменены
        }
    };

    const handleSaveData = (patientData: Patient) => {
        // Логика для обработки данных формы
        console.log("Сохраняемые данные:", patientData);
        setIsModalOpen(false); // Закрытие модального окна после сохранения данных
    }

    // const handleSave = async (updatedPatientData: Patient) => {
    //     // Отправка данных на сервер...
    //     // После успешного сохранения:
    //     onSave(updatedPatientData);
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
    const handlePrint = () => {
        handlePreview(); // Показать предпросмотр перед печатью
        window.print();
    };
    const handleChange = (event: SelectChangeEvent) => {
        console.log("значение:", event.target.value);
        // const newValue = event.target.value;
        setTagValue(event.target.value as string);
    };
    const handleChangeRadioGroup = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRadioGroupValue((event.target as HTMLInputElement).value);
    };

    // const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target;
    //     setFormData(prevFormData => ({
    //         ...prevFormData,
    //         [name]: value
    //     } as Patient));
    // };

    useEffect(() => {
        console.log("Полученный пациент:", patient);
        if (patient) {
            setFormData(patient);
        }else {
            setFormData(null)
        }
    }, [patient]);

    const handleModalClose = () => {
        const hasChanges = isDataChanged || (formData && JSON.stringify(formData) !== JSON.stringify(patient));
        if (isDataChanged && !window.confirm('Данные не сохранены. Вы уверены, что хотите выйти?')) {
            return;
        }
        onClose();
    };

    const handleShowAdditionalFields = () => {
        const newState = !showAdditionalFields;
        setShowAdditionalFields(newState);

        //Плавная прокрутка, если поля становятся видимыми
        if (newState) {
            setTimeout(() => {
                const element = document.getElementById('firstAdditionalField');
                if (element) {
                    element.scrollIntoView({behavior: 'smooth'});
                }
            }, 100);
        }
    };

    const Android12Switch = styled(Switch)(({theme}) => ({
        padding: 8,
        display: 'flex',
        '& .MuiSwitch-track': {
            borderRadius: 22 / 2,
            '&:before, &:after': {
                content: '""',
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 16,
                height: 16,
            },
            '&:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                    theme.palette.getContrastText(theme.palette.primary.main),
                )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
                left: 12,
            },
            '&:after': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
                    theme.palette.getContrastText(theme.palette.primary.main),
                )}" d="M19,13H5V11H19V13Z" /></svg>')`,
                right: 12,
            },
        },
        '& .MuiSwitch-thumb': {
            boxShadow: 'none',
            width: 16,
            height: 16,
            margin: 2,
        },
    }));

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
                    p: 6, // Внутренний отступ
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
                    <Grid item xs={12} sm={6}
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
                                value={tagValue}
                                onChange={handleChange}
                                label="populationCategory"
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
                                value={tagValue}
                                onChange={handleChange}
                                label="Gender"
                            >
                                {options.map((option, index) => (
                                    <MenuItem key={index} value={option}>{option}</MenuItem>
                                ))}
                                {/*{dataByTag[10]?.map((option, index)=>(*/}
                                {/*    <MenuItem key{index} value={option}>{option}</MenuItem>*/}
                                {/*))}*/}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}
                          sx={{
                              padding: '12px',

                          }}
                    >
                        <FormControl
                        >
                            <FormLabel id="demo-controlled-radio-buttons-group"
                                       sx={{
                                           color: 'black',
                                           fontWeight: 700,
                                       }}
                            >Тип Документа</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={radioGroupValue}
                                onChange={handleChangeRadioGroup}
                            >
                                <FormControlLabel value="Направление" control={<Radio/>} label="Направление"/>
                                <FormControlLabel value="Протокол" control={<Radio/>} label="Протокол"/>
                                <FormControlLabel value="Талон" control={<Radio/>} label="Талон"/>
                            </RadioGroup>
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
                        <TextField label="Фамилия" variant="outlined" fullWidth
                                   value={formData ? formData.lastName : ''}
                                   // onChange={handleChangeText}
                        />
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

                    <Grid container spacing={2}
                          sx={{
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '12px',

                              '& .MuiTextField-root': {
                                  marginBottom: '12px',
                              },

                              '& .MuiFormControl-root': {
                                  marginBottom: '12px',
                              }
                          }}
                    >
                        <Grid item xs={6} >
                            {/* Три текстовых поля для левой колонки */}
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={options}
                                renderInput={(params) => <TextField {...params} label="Группа ВМП"/>}
                            />
                            {/*<TextField label="Группа инвалидности" variant="outlined" fullWidth/>*/}
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={options}
                                renderInput={(params) => <TextField {...params} label="Группа инвалидности"/>}
                            />
                            {/*<TextField label="Дата Направления" variant="outlined" fullWidth/>*/}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateField
                                    label="Дата Направления"
                                    value={value}
                                    onChange={(newValue) => setValue(newValue)}
                                    format="DD-MM-YYYY"
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={6}>
                            {/* Три текстовых поля для правой колонки */}
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={options}
                                renderInput={(params) => <TextField {...params} label="МКБ10"/>}
                            />
                            {/*<TextField label="Профиль" variant="outlined" fullWidth/>*/}
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={options}
                                renderInput={(params) => <TextField {...params} label="Профиль"/>}
                            />
                            {/*<TextField label="Институт" variant="outlined" fullWidth/>*/}
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={options}
                                renderInput={(params) => <TextField {...params} label="Институт"/>}
                            />
                        </Grid>
                    </Grid>

                    <div className="flex flex-row items-center justify-start ml-4">
                        {/*Форма для сопровождающего*/}
                        <FormControlLabel
                            control={<Android12Switch
                                // defaultChecked
                            />}
                            checked={showAdditionalFields}
                            onChange={handleShowAdditionalFields}
                            label={<span style={{fontWeight: 700}}>Сопровождающий</span>}
                            sx={{
                                display: 'flex',
                            }}
                        />
                    </div>
                    {/*<div >*/}
                    {/*    <Grid container*/}
                    {/*    sx = {{*/}
                    {/*        position: 'flex',*/}
                    {/*        justifyContent: 'center',*/}
                    {/*        alignItems: 'center',*/}
                    {/*    }}*/}
                    {/*        >*/}
                    {showAdditionalFields && (
                        <Grid container spacing={2} sx={{

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

                            {/* Дополнительные поля*/}
                            <Grid item xs={6}>
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

                                <InputLabel id="gender">Пол</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="gender"
                                    value={tagValue}
                                    onChange={handleChange}
                                    label="Пол"
                                    fullWidth
                                    sx={{
                                        maxWidth: 120,
                                        // margin: '6px',
                                    }}>
                                    {options.map((option, index) => (
                                        <MenuItem key={index} value={option}>{option}</MenuItem>
                                    ))}
                                    {/*{dataByTag[10]?.map((option, index)=>(*/}
                                    {/*    <MenuItem key{index} value={option}>{option}</MenuItem>*/}
                                    {/*))}*/}
                                </Select>
                            </Grid>

                            <Grid item xs={6}>
                                {/* Дополнительные поля для других колонок */}
                                <TextField label="Документ" variant="outlined" fullWidth/>
                                <TextField label="Серия паспорта" variant="outlined" fullWidth/>
                                <TextField label="Номер паспорта" variant="outlined" fullWidth/>
                                <TextField label="Адрес прописки" variant="outlined" fullWidth/>
                                <TextField label="Адрес проживания" variant="outlined" fullWidth/>
                            </Grid>
                        </Grid>
                    )}
                    {/*</Grid>*/}
                    {/*</div>*/}
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
                    <div className="flex flex-row items-center justify-center">
                        {/*Форма, управляющая отправкой данных и обработкой событий формы*/}
                        <div className="fill-button"
                        >
                            <button onClick={handlePreview} className="btn">Предпросмотр</button>
                        </div>
                        <div className="fill-button"
                        >
                            <button onClick={handleCopyData} className="btn">Копировать</button>
                        </div>
                        <div className="fill-button"
                        >
                            <button onClick={handlePrint} className="btn">Печать</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <button type="submit" className="btn">Сохранить</button>
                        </form>
                    </div>
                </Grid>
            </Modal>

        </Grid>
    )
        ;

};

export default FormModal;