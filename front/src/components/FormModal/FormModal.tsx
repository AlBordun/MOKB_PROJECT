import React, {useEffect, useRef, useState} from 'react';
import 'tailwindcss/tailwind.css';
import '../../App.css';
import axios from 'axios';
import dayjs, {Dayjs} from 'dayjs';
import {Patient} from '../DataInterfaces/Patient'; // Импорт типа данных пациента
import {
    Grid, FormControl, InputLabel,
    MenuItem, Modal,
    Select, SelectChangeEvent,
    TextField, IconButton,
    FormControlLabel, FormLabel,
    RadioGroup, Radio, OutlinedInput,
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
import {MKB10} from "../DataInterfaces/MKB10";
import {Institutions} from "../DataInterfaces/Institutions";
import {Form} from "../DataInterfaces/Form";
import {fetchDocumentNumber} from "../utils/documentService";
import {ReferenceListItem} from "../DataInterfaces/ReferenceList";
import {fetchReferenceDataByTags} from "../utils/fetchReferenceDataByTags";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";

// Определение интерфейса для свойств FormModal
interface FormModalProps {
    show: boolean;
    onClose: () => void;
    onSave?: (patientData: Patient) => void;
    onSaveData?: (patientData: Patient, formData: Form) => void;
    patient: Patient | null;
    form?: Form | null;
    institutions?: Institutions | null;
    handleCopyData?: (dataToCopy: any) => void; // Функция для копирования данных из других модалок
    onPatientSaved?: (savedPatient: Patient) => void;
    refreshPatientsList?: () => Promise<void>;
    DataProfileOptions?: string[] | null;
    // mkb10: MKB10 | null;
}
interface TagValue {
    [key: string]: string;
}

const FormModal: React.FC<FormModalProps> = ({show,
                                                 onClose,
                                                 onSave,
                                                 onSaveData,
                                                 patient,
                                                 form,
                                                 refreshPatientsList,}) => {
    const [patientData, setPatientData] = useState<Patient | null>(patient);
    const [formData, setFormData] = useState<Form | null>(form || null);
    const [patientsList, setPatientsList] = useState<Patient[]>([]);
    const [formsList, setFormsList] = useState<Form[]>([]);
    const [isDataChanged, setIsDataChanged] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null)
    const [options, setOptions] = useState<string[]>([])
    const [value, setValue] = React.useState<Dayjs | null>(dayjs());
    const [tagValue, setTagValue] = React.useState<TagValue>({})
    const [dataByTag, setDataByTag] = useState<Map<number, ReferenceListItem[]>>(new Map());
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [radioGroupValue, setRadioGroupValue] = React.useState('Направление');
    const [mkbData, setMkbData] = useState<MKB10[]>([]);
    const [institutionsData, setInstitutionsData] = useState<Institutions[]>([]);
    const [selectedMkb, setSelectedMkb] = useState<MKB10 | null>(null);
    const [selectedInstitution, setSelectedInstitution] = useState<Institutions | null>(null);
    const [date, setDate] = React.useState<Dayjs | null>(null);

    useEffect(() => {
        const tags = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160];
        fetchReferenceDataByTags(tags).then(setDataByTag);
    }, []);

    useEffect(() => {
        axios.get<MKB10[]>(`http://localhost:8080/api/mkb_10/codes`)
            .then(response => setMkbData(response.data))
            .catch(error => console.error('Ошибка при загрузке данных МКБ-10:', error));
    }, []);

    console.log("Selected mkb codes", mkbData);
    // const handleMkbCodeChange = (event: React.SyntheticEvent, newValue: string | null) => {
    //     setSelectedCode(newValue);
    //     setFormData(prevFormData => {
    //         // Проверяем, не является ли prevFormData null перед обновлением
    //         return prevFormData ? { ...prevFormData, mkb_10: newValue } : null;
    //     });
    // };

    // Обновление обработчика для МКБ-10
    const handleMkbCodeChange = (event: React.SyntheticEvent<Element, Event>, newValue: MKB10 | null) => {
        setSelectedMkb(newValue);
    };


    useEffect(() => {
        axios.get<Institutions[]>('http://localhost:8080/api/institution_name/institutions')
            .then(response => setInstitutionsData(response.data))
            .catch(error => console.error('Ошибка при загрузке данных институтов:', error));
    }, []);
    // const handleInstitutionNamesChange = (
    //     event: React.SyntheticEvent<Element, Event>,
    //     newValue: Institutions   | null
    // ) => {
    //     console.log("Selected institution", newValue);
    //     setFormData(prevFormData => {
    //         return prevFormData ? { ...prevFormData, inst_name: newValue ? newValue.inst_id : null } : null;
    //     });
    // };

    const handleInstitutionNamesChange = (event: React.SyntheticEvent<Element, Event>, newValue: Institutions | null) => {
        setSelectedInstitution(newValue);
    };

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>,
        fieldName: keyof Patient
    ) => {
        const target = event.target as HTMLInputElement | { value: string };
        let value: string | number | null = target.value;

        setPatientData(prevData => {
            if (!prevData) return null;
            return {
                ...prevData,
                [fieldName]: value
            } as Patient;
        });
    };

    // const handleChangeForm = (
    //     event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<any>,
    //     fieldName: keyof Form
    // ) => {
    //     const target = event.target as HTMLInputElement | { value: any };
    //     let value: string | number | null = target.value;
    //
    //     setFormData(prevData => {
    //         if (!prevData) return null;
    //         return {
    //             ...prevData,
    //             [fieldName]: value
    //         } as Form;
    //     });
    // };

    // const handleChangeForm = (
    //     event: React.SyntheticEvent<Element, Event>,
    //     newValue: string | null,
    // ) => {
    //     const newProfileNameIndex = newValue ? DataProfileOptions.indexOf(newValue) : -1;
    //     setFormData(prevFormData => ({
    //         ...prevFormData,
    //         mkb_10: newProfileNameIndex
    //     }as Form));
    // };

    const handleCopyData = () => {
        if (patient) {
            setPatientData(patient); // Копирование данных из patient в patientData
            setIsDataChanged(true); // Установка флага, что данные были изменены
        }
    };

    // const loadPatients = async () => {
    //     try {
    //         const response = await axios.get(`http://localhost:8080/api/patients/find_all`);
    //         setPatientsList(response.data);
    //     } catch (error) {
    //         console.error("Ошибка при загрузке списка пациентов:", error);
    //         // Обработка ошибок (например, отображение сообщения об ошибке)
    //     }
    // };

    // const loadForms = async () => {
    //     try {
    //         const response = await axios.get(`http://localhost:8080/api/forms/find_all`);
    //         setFormsList(response.data);
    //     } catch (error) {
    //         console.error("Ошибка при загрузке списка форм:", error);
    //         // Обработка ошибок
    //     }
    // };

    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //
    //     // Обработка и отправка данных пациента
    //     if (patientData) {
    //         const patientDataToSend = Object.entries(patientData).reduce((acc, [key, value]) => {
    //             acc[key as keyof Patient] = typeof value === 'string' && value.trim() === '' ? null : value;
    //             return acc;
    //         }, {} as Patient);
    //
    //         try {
    //             const patientResponse = patientData.id
    //                 ? await axios.put(`http://localhost:8080/api/patients/${patientData.id}`, patientDataToSend)
    //                 : await axios.post('http://localhost:8080/api/patients', patientDataToSend);
    //
    //             console.log("Ответ сервера по пациенту:", patientResponse.data);
    //         } catch (error) {
    //             console.error("Ошибка при отправке данных пациента:", error);
    //         }
    //     }
    //
    //     // Обработка и отправка данных формы
    //     if (formData) {
    //         const formDataToSend = Object.entries(formData).reduce((acc, [key, value]) => {
    //             acc[key as keyof Form] = typeof value === 'string' && value.trim() === '' ? null : value;
    //             return acc;
    //         }, {} as Form);
    //
    //         // Присваиваем form_name в соответствии с radioGroupValue
    //         formDataToSend.form_name = radioGroupValue === 'Направление' ? '1' :
    //             radioGroupValue === 'Протокол' ? '2' : '3';
    //
    //         try {
    //             const formResponse = formData.id
    //                 ? await axios.put(`http://localhost:8080/api/forms/${formData.id}`, formDataToSend)
    //                 : await axios.post('http://localhost:8080/api/forms', formDataToSend);
    //
    //             console.log("Ответ сервера по форме:", formResponse.data);
    //         } catch (error) {
    //             console.error("Ошибка при отправке данных формы:", error);
    //         }
    //     }
    //
    //     // Действия после отправки данных
    //     if (typeof refreshPatientsList === 'function') {
    //         await refreshPatientsList();
    //     }
    //
    //     onClose(); // Закрытие модального окна
    // };

    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //
    //     const updatedFormData = {
    //         ...formData,
    //         mkb_10: selectedMkb?.mkb_id, // id выбранного МКБ
    //         inst_name: selectedInstitution?.inst_id, // id выбранного института
    //     };
    //
    //     // Обработка и отправка данных пациента
    //     if (patientData) {
    //         const patientDataToSend = Object.entries(patientData).reduce((acc, [key, value]) => {
    //             acc[key as keyof Patient] = typeof value === 'string' && value.trim() === '' ? null : value;
    //             return acc;
    //         }, {} as Patient);
    //
    //         try {
    //             const patientResponse = patientData.id
    //                 ? await axios.put(`http://localhost:8080/api/patients/${patientData.id}`, patientDataToSend)
    //                 : await axios.post('http://localhost:8080/api/patients', patientDataToSend);
    //
    //             console.log("Ответ сервера по пациенту:", patientResponse.data);
    //
    //             // После успешного сохранения пациента, сохраняем форму
    //             if (formData) {
    //                 // Установка patient_id в formData
    //                 const updatedFormData = {
    //                     ...formData,
    //                     patient_id: patientResponse.data.id // Обновляем или устанавливаем patient_id
    //                 };
    //
    //                 const formDataToSend = Object.entries(updatedFormData).reduce((acc, [key, value]) => {
    //                     acc[key as keyof Form] = typeof value === 'string' && value.trim() === '' ? null : value;
    //                     return acc;
    //                 }, {} as Form);
    //
    //                 // Присваиваем form_name в соответствии с radioGroupValue
    //                 formDataToSend.form_name = radioGroupValue === 'Направление' ? '1' :
    //                     radioGroupValue === 'Протокол' ? '2' : '3';
    //
    //                 const formResponse = formData.id
    //                     ? await axios.put(`http://localhost:8080/api/forms/update/${formData.id}`, formDataToSend)
    //                     : await axios.post('http://localhost:8080/api/forms/submit', formDataToSend);
    //
    //                 console.log("Ответ сервера по форме:", formResponse.data);
    //             }
    //
    //             // Действия после отправки данных
    //             if (typeof refreshPatientsList === 'function') {
    //                 await refreshPatientsList();
    //             }
    //
    //             onClose(); // Закрытие модального окна
    //         } catch (error) {
    //             console.error("Ошибка при отправке данных пациента:", error);
    //         }
    //     }
    // };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Обновление formData с выбранными значениями МКБ и институтов
        const updatedFormData = {
            ...formData,
            mkb_10: selectedMkb?.mkb_id, // id выбранного МКБ
            inst_name: selectedInstitution?.inst_id, // id выбранного института
        };

        // Обработка и отправка данных пациента
        if (patientData) {
            const patientDataToSend = Object.entries(patientData).reduce((acc, [key, value]) => {
                acc[key as keyof Patient] = typeof value === 'string' && value.trim() === '' ? null : value;
                return acc;
            }, {} as Patient);

            try {
                const patientResponse = patientData.id
                    ? await axios.put(`http://localhost:8080/api/patients/${patientData.id}`, patientDataToSend)
                    : await axios.post('http://localhost:8080/api/patients', patientDataToSend);

                console.log("Ответ сервера по пациенту:", patientResponse.data);

                // После успешного сохранения пациента, сохраняем форму
                if (updatedFormData) {
                // if (patientResponse.data && patientResponse.data.id) {
                    // Установка patient_id в updatedFormData
                    const finalFormDataToSend = {
                        ...updatedFormData,
                        patient_id: patientResponse.data.id // Обновляем или устанавливаем patient_id
                    };

                    const formDataToSend = Object.entries(finalFormDataToSend).reduce((acc, [key, value]) => {
                        acc[key as keyof Form] = typeof value === 'string' && value.trim() === '' ? null : value;
                        return acc;
                    }, {} as Form);

                    // Присваиваем form_name в соответствии с radioGroupValue
                    formDataToSend.form_name = radioGroupValue === 'Направление' ? '1' :
                        radioGroupValue === 'Протокол' ? '2' : '3';

                    const formResponse = formData?.id
                        ? await axios.put(`http://localhost:8080/api/forms/update/${formData.id}`, formDataToSend)
                        : await axios.post('http://localhost:8080/api/forms/submit', formDataToSend);

                    console.log("Ответ сервера по форме:", formResponse.data);
                }

                // Действия после отправки данных
                if (typeof refreshPatientsList === 'function') {
                    await refreshPatientsList();
                }

                onClose(); // Закрытие модального окна
            } catch (error) {
                console.error("Ошибка при отправке данных пациента:", error);
            }
        }
    };

    const handlePreview = async () => {
        if (patientData && formData) {
            // Преобразование всех не заполненных строковых полей в null для patientData
            const transformedPatientData = Object.entries(patientData).reduce((acc, [key, value]) => {
                acc[key as keyof Patient] = (typeof value === 'string' && value.trim() === '') ? null : value;
                return acc;
            }, {} as Patient);

            // Преобразование всех не заполненных строковых полей в null для formData
            const transformedFormData = Object.entries(formData).reduce((acc, [key, value]) => {
                if (key in acc) {
                    acc[key as keyof Form] = (typeof value === 'string' && value.trim() === '') ? null : value;
                }
                return acc;
            }, {} as Partial<Form>);

            const patientAndFormDTO = {
                patient: transformedPatientData,
                form: transformedFormData
            };


            try {
                const response = await axios.post('http://localhost:8080/api/export/preview', patientAndFormDTO, { responseType: 'blob' });
                const file = new Blob([response.data], { type: 'application/pdf' });
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL, '_blank');
            } catch (error) {
                // Обработка ошибок
                if (axios.isAxiosError(error)) {
                    console.error('Ошибка при получении предпросмотра:', error.message);
                    if (error.response) {
                        console.error('Данные ошибки:', error.response.data);
                        console.error('Статус ошибки:', error.response.status);
                        console.error('Заголовки ошибки:', error.response.headers);
                    }
                } else {
                    console.error('Неожиданная ошибка:', error);
                }
            }
        }
    };


    // const handlePreview = async () => {
    //     if (patientData && formData) {
    //         const patientAndFormDTO = {
    //             patient: patientData,
    //             form: formData
    //         };
    //         try {
    //             const response = await axios.post('http://localhost:8080/api/export/preview', patientAndFormDTO, {responseType: 'blob'});
    //             const file = new Blob([response.data], {type: 'application/pdf'});
    //             const fileURL = URL.createObjectURL(file);
    //             window.open(fileURL, '_blank');
    //         } catch (error: unknown) {
    //             if (axios.isAxiosError(error)) {
    //
    //                 console.error('Ошибка при получении предпросмотра:', error.message);
    //                 if (error.response) {
    //                     console.error('Данные ошибки:', error.response.data);
    //                     console.error('Статус ошибки:', error.response.status);
    //                     console.error('Заголовки ошибки:', error.response.headers);
    //                 }
    //             } else {
    //                 // Обработка других типов ошибок
    //                 console.error('Неожиданная ошибка:', error);
    //             }
    //         }
    //     }
    // };


    // const handleSave = async (patientData: Patient) => {
    //     try {
    //         // Запрос к API для сохранения данных
    //         await axios.post('http://localhost:8080/api/patients', patientData);
    //
    //         // Вызов переданной функции обновления списка пациентов
    //         onSave(patientData); // Это вызовет refreshPatientsList из родительского компонента
    //     } catch (error) {
    //         console.error('Ошибка при сохранении данных пациента', error);
    //     }
    // };

    const handlePrint = async () => {
        if (patientData && formData) {
            const patientAndFormDTO = {
                patient: patientData,
                form: formData
            };
            try {
                const response = await axios.post(
                    'http://localhost:8080/api/export/preview',
                    patientAndFormDTO,
                    {responseType: 'blob'}
                );

                const file = new Blob([response.data], {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);

                const printWindow = window.open(fileURL, '_blank');
                if (printWindow) {
                    printWindow.onload = function () {
                        setTimeout(() => {
                            // Дополнительная проверка на null перед печатью
                            if (printWindow) {
                                printWindow.print();
                            }
                        }, 1000); // Даем время на полную загрузку
                    };
                } else {
                    console.error('Не удалось открыть окно предпросмотра');
                }
            } catch (error) {
                console.error('Ошибка при получении предпросмотра', error);
            }
        }
    };

    // const handleChangeText = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    //     const { value } = e.target;
    //     setPatientData(prevFormData => ({
    //         ...prevFormData,
    //         [fieldName]: value
    //     } as Patient));
    // };

    const handleChangeText = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        fieldName: string
    ) => {
        const {value} = e.target as HTMLInputElement; // Приведение типа к HTMLInputElement
        setPatientData(prevFormData => ({
            ...prevFormData,
            [fieldName]: value === '' ? null : value
        } as Patient));
    };

    const handleChangeTextForms = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        fieldName: string
    ) => {
        const {value} = e.target as HTMLInputElement; // Приведение типа к HTMLInputElement
        setFormData(prevFormData => ({
            ...prevFormData,
            [fieldName]: value === '' ? null : value
        } as Form));
    };

    // const handleChangeTextAutoComplete = (
    //     event: React.SyntheticEvent<Element, Event>,
    //     newValue: { label: string; } | null,
    //     fieldName: string
    // ) => {
    //     setPatientData(prevFormData => ({
    //         ...prevFormData,
    //         [fieldName]: newValue ? newValue.label : null
    //     } as Patient));
    // };

    const handleChangeTextAutoCompleteForms = (
        event: React.SyntheticEvent<Element, Event>,
        newValue: { id?: number; label: string; } | null,
        fieldName: string
    ) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [fieldName]: newValue ? newValue.label : null
        } as Form));
    };

    useEffect(() => {
        if (patient) {
            console.log("Текущие данные пациента:", patient);
            // Обновление значений тегов для селекторов
            Object.keys(patient).forEach(key => {
                if (key in tagValue) {
                    setTagValue(prev => ({...prev, [key]: patient[key]}));
                }
            });
        }
    }, [patient]);

    // useEffect(() => {
    //     console.log("Полученный пациент:", patient);
    //     if (patient) {
    //         setPatientData(patient);
    //     } else {
    //         setPatientData(null)
    //     }
    // }, [patient]);

    useEffect(() => {
        console.log("Полученный пациент:", patient);
        if (patient) {
            setPatientData(patient);
        }
        if (form) {
            console.log("Полученные формы:", form);
            setFormData(form);
        }
    }, [patient, form]);

    useEffect(() => {
        console.log("Текущее состояние formData:", formData);
    }, [formData]);

    const handleModalClose = () => {
        const hasChanges = isDataChanged || (patientData && JSON.stringify(patientData) !== JSON.stringify(patient));
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

    // useEffect(() => {
    //     if (form) {
    //         setFormData(form);
    //     } else {
    //         // Очистите данные формы, если form не передан
    //         setFormData(null);
    //     }
    // }, [form]);

    // Враппер для модального окна
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

    // const handleChangeTest = (
    //     event: React.SyntheticEvent<Element, Event>,
    //     newValue: string | null
    // ) => {
    //     setFormData(prevFormData => ({
    //         ...prevFormData,
    //         profile_name: newValue ?? ''
    //     }));
    // };

    // const handleChangeTest = (
    //     event: React.SyntheticEvent<Element, Event>,
    //     newValue: { id: number; label: string; }  | null ,
    // ) => {
    //     const newProfileNameIndex = newValue ? DataProfileOptions.indexOf(newValue) : -1;
    //     setFormData(prevFormData => ({
    //         ...prevFormData,
    //         profile_name: newProfileNameIndex
    //     }as Form));
    // };

    // const handleChangeTag = (event: SelectChangeEvent<string>, fieldName: string) => {
    //     setSelectedValue(event.target.value);
    // };

    const handleChangeTag = (event: SelectChangeEvent, fieldName: keyof Form) => {
        const value = event.target.value;

        setFormData(prevData => {
            // Проверяем, что prevData не null
            if (!prevData) return null;

            return {
                ...prevData,
                [fieldName]: value
            } as Form;
        });
    };

    const handleChangeTagForPatient = (event: SelectChangeEvent, fieldName: keyof Patient) => {
        const value = event.target.value; // event.target.value теперь имеет тип 'unknown', вам может потребоваться приведение типов

        setPatientData(prevData => {
            // Проверяем, что prevData не null
            if (!prevData) return null;

            return {
                ...prevData,
                [fieldName]: value // Если требуется, здесь можно привести тип, например, для числовых значений
            } as Patient; // Уточняем тип, что результат соответствует интерфейсу Patient
        });
    };

    const handleChangeRadioGroup = (
        event: React.ChangeEvent<HTMLInputElement>,
        fieldName: string
    ) => {
        const newValue = event.target.value; // Получение выбранного значения
        setFormData(prevFormData => ({
            ...prevFormData,
            [fieldName]: Number(newValue) // Преобразование в число
        }));
    };

    // Обработчик изменений в DateField
    const handleDateChange = (newDate: Dayjs | null) => {
        setDate(newDate);
    };

    // const handleDateChangeForPatient = (dateValue: dayjs.Dayjs | null, field: keyof Patient | keyof Form) => {
    //     if (field in patientData) {
    //         setPatientData(prev => ({
    //             ...prev,
    //             [field]: dateValue ? dateValue.format('YYYY-MM-DD') : ''
    //         }));
    //     } else if (field in formData) {
    //         setFormData(prev => ({
    //             ...prev,
    //             [field]: dateValue ? dateValue.format('YYYY-MM-DD') : ''
    //         }));
    //     }
    // };

    // const handleChangeTagMultipleSelect = (event: SelectChangeEvent<number[]>, fieldName: string) => {
    //     // Обновление состояния formData с новыми выбранными значениями
    //     const value = event.target.value;
    //     // Безопасно обрабатываем случай, когда value может быть строкой
    //     const newValue = typeof value === 'string' ? value.split(',').map(Number) : value;
    //
    //     setSignatureData(prevFormData => ({
    //         ...prevFormData,
    //         [fieldName]: newValue,
    //     }));
    // };

    const genderTag: ReferenceListItem[] = dataByTag.get(10) || [];
    console.log("Data by tag 10",genderTag )
    const population_categoryTag: ReferenceListItem[] = dataByTag.get(20) || [];
    console.log("Data by tag 20",population_categoryTag )
    const document_typeTag: ReferenceListItem[] = dataByTag.get(30) || [];
    console.log("Data by tag 30",document_typeTag )
    const form_nameTag: ReferenceListItem[] = dataByTag.get(40) || [];
    console.log("Data by tag 40",form_nameTag )
    const disabilityTag: ReferenceListItem[] = dataByTag.get(60) || [];
    console.log("Data by tag 60",disabilityTag )
    const profile_nameTag: ReferenceListItem[] = dataByTag.get(80) || [];
    console.log("Data by tag 80",profile_nameTag )
    const char_of_diseaseTag: ReferenceListItem[] = dataByTag.get(110) || [];
    console.log("Data by tag 110",char_of_diseaseTag )
    const need_catTag: ReferenceListItem[] = dataByTag.get(120) || [];
    console.log("Data by tag 120",need_catTag )
    const payment_catTag: ReferenceListItem[] = dataByTag.get(140) || [];
    console.log("Data by tag 140",payment_catTag )
    const signatureTag: ReferenceListItem[] = dataByTag.get(150) || [];
    console.log("Data by tag 150",signatureTag )
    const disabled_catTag: ReferenceListItem[] = dataByTag.get(160) || [];
    console.log("Data by tag 160",disabled_catTag)


    // console.log("formData", formData);
    // console.log("DataProfileOptions", DataProfileOptions);
    //
    // if (formData && formData.profile_name !== undefined) {
    //     console.log("Searching for DataProfileOptions with id:", formData.profile_name);
    //
    //     const selectedProfileOptions = DataProfileOptions.find(prof => {
    //         console.log(`Checking DataProfileOptions with id ${prof.id}`);
    //         return prof.id === formData.profile_name ;
    //     });
    //
    //     console.log("selectedProfileOptions", selectedProfileOptions);
    //
    //     const isInOptions = selectedProfileOptions ? DataProfileOptions.includes(selectedProfileOptions) : false;
    //     console.log("isInOptions", isInOptions);
    // }

    console.log("refreshPatientsList в FormModal:", refreshPatientsList);

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
                        <TextField disabled
                                   id="outlined-disabled"
                                   label="№ документа"
                                   value={formData?.id || ''}
                                   fullWidth

                                   sx={{
                                       maxWidth: 80,
                                       margin: '6px',
                                   }}
                        />
                        <TextField disabled
                                   id="outlined-disabled"
                                   label="№ пациента"
                                   value={patientData?.id || ''}
                                   fullWidth

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
                            <InputLabel id="population_category">Категория Населения</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={patientData?.population_category ? patientData.population_category.toString() : ''}
                                onChange={(e) => handleChangeTagForPatient(e, 'population_category')}
                                label="population_category"
                            >
                                {population_categoryTag.map((option) => (
                                    <MenuItem key={option.id} value={option.code}>{option.text}</MenuItem>
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
                                value={patientData?.gender ? patientData.gender.toString() : ''}
                                onChange={(e) => handleChangeTagForPatient(e, 'gender')}
                            >
                                {genderTag.map((option) => (
                                    <MenuItem key={option.id} value={option.code}>{option.text}</MenuItem>
                                ))}
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
                            >Вид Документа</FormLabel>

                            {/*<RadioGroup*/}
                            {/*    row*/}
                            {/*    aria-labelledby="demo-controlled-radio-buttons-group"*/}
                            {/*    name="controlled-radio-buttons-group"*/}
                            {/*    value={formData?.form_name ? formData.form_name.toString() : ''}*/}
                            {/*    onChange={(e) => handleChangeTag(e, 'form_name')}*/}
                            {/*>*/}
                            {/*    <FormControlLabel value="Направление" control={<Radio/>} label="Направление"/>*/}
                            {/*    <FormControlLabel value="Протокол" control={<Radio/>} label="Протокол"/>*/}
                            {/*    <FormControlLabel value="Талон" control={<Radio/>} label="Талон"/>*/}

                            {/*    {form_nameTag.map((option) => (*/}
                            {/*        <MenuItem key={option.id} value={option.code}>{option.text}</MenuItem>*/}
                            {/*    ))}*/}
                            {/*</RadioGroup>*/}

                            <RadioGroup
                                row
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={formData?.form_name?.toString() || ''}
                                onChange={(e) => handleChangeRadioGroup(e, 'form_name')}
                            >
                                {form_nameTag.map((item) => (
                                    <FormControlLabel
                                        key={item.id}
                                        value={item.code.toString()}
                                        control={<Radio />}
                                        label={item.text}
                                    />
                                ))}
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
                                   value={patientData?.last_name || ''}
                            // onChange={(e) => handleChangeText(e, 'last_name')}
                                   onChange={(e) => handleChange(e, 'last_name')}
                        />
                        <TextField label="Имя" variant="outlined" fullWidth
                                   value={patientData?.first_name || ''}
                                   onChange={(e) => handleChangeText(e, 'first_name')}
                        />
                        <TextField label="Отчество" variant="outlined" fullWidth
                                   value={patientData?.middle_name || ''}
                                   onChange={(e) => handleChangeText(e, 'middle_name')}
                        />

                        {/*Дата рождения*/}
                        {/*<LocalizationProvider dateAdapter={AdapterDayjs}>*/}
                        {/*    <DateField*/}
                        {/*        label="Дата Рождения"*/}
                        {/*        value={selectedDate}*/}
                        {/*        onChange={handleDateChangeForPatient}*/}
                        {/*        format="DD-MM-YYYY"*/}
                        {/*    >*/}
                        {/*    </DateField>*/}
                        {/*</LocalizationProvider>*/}

                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateField
                                label="Дата рождения"
                                value={dayjs(patientData?.date_of_birth)} // Преобразование строки в Dayjs
                                onChange={handleDateChange}
                                format="DD-MM-YYYY"
                            />
                        </LocalizationProvider>

                        <TextField label="Адрес прописки" variant="outlined" fullWidth
                                   value={patientData?.registration_address || ''}
                                   onChange={(e) => handleChangeText(e, 'registration_address')}
                        />
                        <TextField label="Адрес проживания" variant="outlined" fullWidth
                                   value={patientData?.actual_address || ''}
                                   onChange={(e) => handleChangeText(e, 'actual_address')}
                        />

                    </Grid>
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
                        {/*<Autocomplete*/}
                        {/*    disablePortal*/}
                        {/*    id="combo-box-demo"*/}
                        {/*    options={disabilityOptions}*/}
                        {/*    getOptionLabel = {(option) => option}*/}
                        {/*    renderInput={(params) => <TextField {...params} label="Категория льготы"/>}*/}
                        {/*    // value={formData ? disabilityOptions.find(option => option.id === formData.disability) : null}*/}
                        {/*    value = {formData?.profile_name}*/}
                        {/*    onChange={(event, newValue) => handleChangeTextAutoCompleteForms(event, newValue, 'disabled_cat')}*/}
                        {/*/>*/}

                        <FormControl fullWidth>
                            <InputLabel id="disability">Категория инвалидности</InputLabel>
                            <Select
                                label="disability"
                                labelId="demo-simple-select-standard-label"
                                id="disability-name-autocomplete"
                                value={formData?.disability ? formData.disability.toString() : ''}
                                onChange={(e) => handleChangeTag(e, 'disability')}
                            >
                                {disabilityTag.map((option) => (
                                    <MenuItem key={option.id} value={option.code}>{option.text}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/*<TextField label="Код кат. льготы" variant="outlined" fullWidth/>*/}
                        <TextField label="Снилс" variant="outlined" fullWidth
                                   value={patientData?.snils || ''}
                                   onChange={(e) => handleChangeText(e, 'snils')}
                        />

                        <TextField label="Полис" variant="outlined" fullWidth
                                   value={patientData?.insurance_policy || ''}
                                   onChange={(e) => handleChangeText(e, 'insurance_policy')}
                        />

                            <FormControl fullWidth>
                            <InputLabel id="document_type">Документ личности</InputLabel>
                            <Select
                                label="document_type"
                                labelId="demo-simple-select-standard-label"
                                id="Signature-name-autocomplete"
                                value={patientData?.document_type ? patientData.document_type.toString() : ''}
                                onChange={(e) => handleChangeTagForPatient(e, 'document_type')}
                            >
                                {document_typeTag.map((option) => (
                                    <MenuItem key={option.id} value={option.code}>{option.text}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField label="Серия паспорта" variant="outlined" fullWidth
                                   value={patientData?.passport_series || ''}
                                   onChange={(e) => handleChangeText(e, 'passport_series')}
                        />
                        <TextField label="Номер паспорта" variant="outlined" fullWidth
                                   value={patientData?.passport_number || ''}
                                   onChange={(e) => handleChangeText(e, 'passport_number')}
                        />

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
                        <Grid item xs={6}>

                            <TextField label="Группа ВМП" variant="outlined" fullWidth
                                       value={formData?.vmp_group ? String(formData.vmp_group) : ''}
                                       onChange={(e) => handleChangeTextForms(e, 'vmp_group')}
                            />

                            {/*<Autocomplete*/}
                            {/*    disablePortal*/}
                            {/*    id="combo-box-demo"*/}
                            {/*    options={options}*/}
                            {/*    renderInput={(params) => <TextField {...params} label="Группа ВМП"/>}*/}
                            {/*    value={formData?.vmp_group || ''}*/}
                            {/*    value={formData?.vmp_group ? String(formData.vmp_group) : ''}*/}
                            {/*    onChange={(event, newValue) => handleChangeTextAutoComplete(event, newValue, 'vmp_group')}*/}
                            {/*/>*/}

                            {/*<Autocomplete*/}
                            {/*    disablePortal*/}
                            {/*    id="combo-box-demo"*/}
                            {/*    options={options}*/}
                            {/*    renderInput={(params) => <TextField {...params} label="Группа инвалидности"/>}*/}
                            {/*    value={formData?.disabled_cat || ''}*/}
                            {/*    onChange={(event,newValue) => handleChangeTextAutoComplete(event,newValue, 'disabled_cat')}*/}
                            {/*/>*/}

                            <FormControl fullWidth>
                                <InputLabel id="disabled_cat">Группа инвалидности</InputLabel>
                                <Select
                                    label="disabled_cat"
                                    labelId="demo-simple-select-standard-label"
                                    id="Signature-name-autocomplete"
                                    value={formData?.disabled_cat || ''}
                                    onChange={(e) => handleChangeTag(e, 'disabled_cat')}
                                >
                                    {disabled_catTag.map((option) => (
                                        <MenuItem key={option.id} value={option.code}>{option.text}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/*<TextField label="Нуждается" variant="outlined" fullWidth*/}
                            {/*           value={formData?.need_cat || ''}*/}
                            {/*           onChange={(e) => handleChangeText(e, 'need_cat')}*/}
                            {/*/>*/}

                            <FormControl fullWidth>
                                <InputLabel id="need_cat">Нуждается</InputLabel>
                                <Select
                                    label="need_cat"
                                    labelId="demo-simple-select-standard-label"
                                    id="Signature-name-autocomplete"
                                    value={formData?.need_cat ? formData.need_cat.toString() : ''}
                                    onChange={(e) => handleChangeTag(e, 'need_cat')}
                                >
                                    {need_catTag.map((option) => (
                                        <MenuItem key={option.id} value={option.code}>{option.text}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/*<TextField label="Оплата" variant="outlined" fullWidth*/}
                            {/*           value={formData?.payment_cat || ''}*/}
                            {/*           onChange={(e) => handleChangeText(e, 'payment_cat')}*/}
                            {/*/>*/}

                            <FormControl fullWidth>
                                <InputLabel id="payment_cat">Оплата</InputLabel>
                                <Select
                                    label="payment_cat"
                                    labelId="demo-simple-select-standard-label"
                                    id="payment_cat"
                                    value={formData?.payment_cat ? formData.payment_cat.toString() : ''}
                                    onChange={(e) => handleChangeTag(e, 'payment_cat')}
                                >
                                    {payment_catTag.map((option) => (
                                        // <MenuItem key={option.id} value={option.label}>{option.label}</MenuItem>
                                        <MenuItem key={option.id} value={option.code}>{option.text}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/*<TextField label="Дата Направления" variant="outlined" fullWidth/>*/}

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateField
                                    label="Дата Госпитализации"
                                    value={dayjs(formData?.date_of_hosp)} // Преобразование строки в Dayjs
                                    onChange={handleDateChange}
                                    format="DD-MM-YYYY"
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={6}>

                            <Autocomplete
                                disablePortal
                                id="mkb-code-autocomplete"
                                options={mkbData}
                                getOptionLabel = {(option) => option.mkb_code}
                                value = {formData ? mkbData.find(mkb => mkb.mkb_id === formData.mkb_10) : null}
                                onChange={handleMkbCodeChange}
                                renderInput={(params) => (
                                    <TextField {...params} label="Код МКБ-10" variant="outlined"/>
                                )}
                            />

                            <FormControl fullWidth>
                                <InputLabel id="profile_name">Профиль</InputLabel>
                                <Select
                                    label="profile_name"
                                    labelId="demo-simple-select-standard-label"
                                    id="profile_name-name-autocomplete"
                                    value={formData?.profile_name ? formData.profile_name.toString() : ''}
                                    onChange={(e) => handleChangeTag(e, 'profile_name')}
                                >
                                    {profile_nameTag.map((option) => (
                                        <MenuItem key={option.id} value={option.code}>{option.text}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/*<TextField label="Институт" variant="outlined" fullWidth/>*/}
                            <Autocomplete
                                disablePortal
                                id="institution-name-autocomplete"
                                options={institutionsData}
                                getOptionLabel={(option) => option.inst_name}
                                value = {formData ? institutionsData.find(inst => inst.inst_id === formData.inst_name) : null}
                                onChange={handleInstitutionNamesChange}
                                renderInput={(params) => (
                                    <TextField {...params} label="Наименование учреждения" variant="outlined"/>
                                )}
                            />

                            <FormControl fullWidth>
                                <InputLabel id="signature">Подпись</InputLabel>
                                <Select
                                    label="signature"
                                    labelId="demo-simple-select-standard-label"
                                    id="Signature-name-autocomplete"
                                    value={formData?.signature ? formData.signature.toString() : ''}
                                    onChange={(e) => handleChangeTag(e, 'signature')}
                                >
                                    {signatureTag.map((option) => (
                                        <MenuItem key={option.id} value={option.code}>{option.text}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {/*<TextField label="Характер Заболевания" variant="outlined" fullWidth*/}
                            {/*           value={formData?.char_of_disease || ''}*/}
                            {/*           onChange={(e) => handleChangeText(e, 'char_of_disease')}*/}
                            {/*/>*/}
                            <FormControl fullWidth>
                            <InputLabel id="char_of_disease">Характер Заболевания</InputLabel>
                            <Select
                                label="Характер Заболевания"
                                fullWidth
                                labelId="demo-simple-select-standard-label"
                                id="char_of_disease"
                                value={formData?.char_of_disease ? formData.char_of_disease.toString() : ''}
                                onChange={(e) => handleChangeTag(e, 'char_of_disease')}
                            >
                                {char_of_diseaseTag.map((option) => (
                                    <MenuItem key={option.id} value={option.code}>{option.text}</MenuItem>
                                ))}
                            </Select>
                            </FormControl>
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
                                        label="Дата рождения"
                                        value={dayjs(formData?.accomp_date_of_birth)} // Преобразование строки в Dayjs
                                        onChange={(newDate) => { /* обработка изменения даты */ }}
                                        format="DD-MM-YYYY"
                                    />
                                </LocalizationProvider>

                                <FormControl sx={{
                                    maxWidth: 120,
                                    margin: '6px',
                                }}>
                                    <InputLabel id="accomp_gender">Пол</InputLabel>
                                <Select
                                    labelId="accomp_gender"
                                    id="accomp_gender"
                                    value={patientData?.accomp_gender ? patientData.accomp_gender.toString() : ''}
                                    onChange={(e) => handleChangeTag(e, 'accomp_gender')}
                                    label="Пол"
                                    fullWidth
                                    sx={{
                                        maxWidth: 120,
                                        // margin: '6px',
                                    }}>
                                    {genderTag.map((option) => (
                                        <MenuItem key={option.id} value={option.code}>{option.text}</MenuItem>
                                    ))}
                                </Select>
                                </FormControl>
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
                            label="Модель Пациента"
                            variant="outlined"
                            value={formData?.patient_model || ''}
                            onChange={(e) => handleChangeTextForms(e, 'patient_model')}
                            multiline
                            rows={4}
                        />
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
                            value={formData?.additional_info || ''}
                            onChange={(e) => handleChangeTextForms(e, 'additional_info')}
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