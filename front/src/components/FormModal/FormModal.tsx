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
import {MKB10} from "../DataInterfaces/MKB10";
import {Institutions} from "../DataInterfaces/Institutions";
import {Form} from "../DataInterfaces/Form";
import {fetchDocumentNumber} from "../utils/documentService";

// Определение интерфейса для свойств FormModal
interface FormModalProps {
    show: boolean;
    onClose: () => void;
    onSave?: (patientData: Patient) => void;
    onSaveData?: (patientData: Patient, formData: Form) => void;
    patient: Patient | null;
    form?: Form | null;
    handleCopyData?: (dataToCopy: any) => void; // Функция для копирования данных из других модалок
    onPatientSaved?: (savedPatient: Patient) => void;
    refreshPatientsList?: () => Promise<void>;
    // mkb10: MKB10 | null;
}

interface TagValue {
    [key: string]: string;
}

// Маппинги для различных категорий
// const genderMap: { [key: string]: number } = {
//     "женский": 1,
//     "мужской": 2
// };
//
// const populationCategoryMap: { [key: string]: number } = {
//     "ребенок": 1,
//     "взрослый": 2
// };
// const genderMap: { [key: string]: number } = {
//      "женский": 1,
//      "мужской": 2
// };
//
// const populationCategoryMap: { [key: string]: number } = {
//      "взрослый": 1,
//      "ребенок": 2
// };

const genderMap: { [key: number]: string } = {
    1: "женский",
    2: "мужской"
};

const populationCategoryMap: { [key: number]: string } = {
    1: "взрослый",
    2: "ребенок"
};
const documentTypeMap: { [key: string]: number } = {
    "Протокол": 1,
    "Направление": 2,
    "Талон": 3
};

const disabilityCategoryMap: { [key: string]: number } = {
    "Инвалиды войны": 1,
    "Участники Великой Отечественной войны": 2,
    "Ветераны боевых действий": 3,
    "Военнослужащие в/ч 1941-1945 г.": 4,
    "Жители блокадного Ленинграда": 5,
    "Лица, работавшие в период ВОВ": 6,
    "Члены семей погибших в/с": 7,
    "Инвалиды": 8,
    "Дети-инвалиды": 9,
    "Ликвидатор аварии на ЧАЭС (1986-1987гг)": 10,
    // ... Другие категории инвалидности
};

const profileMap: { [key: string]: number } = {
    "Абдоминальная хирургия": 1,
    "Акушерство и гинекология": 2,
    "Гастроэнтерология": 3,
    "Гематология": 4,
    "Дерматовенерология": 5,
    "Комбустиология": 6,
    "Неврология": 7,
    "Нейрохирургия": 8,
    "Онкология": 9,
    "Оториноларингология": 10,
    "Офтальмология": 11,
    "Педиатрия": 12,
    "Ревматология": 13,
    "Сердечно-сосудистая хирургия": 14,
    "Торакальная хирургия": 15,
    "Травматология и ортопедия": 16,
    "Трансплантация": 17,
    "Урология": 18,
    "Челюстно-лицевая хирургия": 19,
    "Эндокринология": 20,
    "неонатология": 21,
    "Хирургия": 22,
    "Микрохирургия": 23,
    "Сосудистая хирургия": 24,
    "Кардиология": 25,
};

const cityMap: { [key: string]: number } = {
    "Москва": 1,
    "Санкт-Петербург": 2,
    "Другой город": 3
};

const reverseGenderMap: { [key: string]: number } = {
    "женский": 1,
    "мужской": 2
};

const reversePopulationCategoryMap: { [key: string]: number } = {
    "взрослый": 1,
    "ребенок": 2
};

const reverseDocumentTypeMap: { [key: number]: string } = {
    1: "Протокол",
    2: "Направление",
    3: "Талон"
};

const reverseDisabilityCategoryMap: { [key: number]: string } = {
    1: "Инвалиды войны",
    2: "Участники Великой Отечественной войны",
    3: "Ветераны боевых действий",
    4: "Военнослужащие в/ч 1941-1945 г.",
    5: "Жители блокадного Ленинграда",
    6: "Лица, работавшие в период ВОВ",
    7: "Члены семей погибших в/с",
    8: "Инвалиды",
    9: "Дети-инвалиды",
    10: "Ликвидатор аварии на ЧАЭС (1986-1987гг)"
    // ... Другие категории инвалидности
};

const reverseProfileMap: { [key: number]: string } = {
    1: "Абдоминальная хирургия",
    2: "Акушерство и гинекология",
    3: "Гастроэнтерология",
    4: "Гематология",
    5: "Дерматовенерология",
    6: "Комбустиология",
    7: "Неврология",
    8: "Нейрохирургия",
    9: "Онкология",
    10: "Оториноларингология",
    11: "Офтальмология",
    12: "Педиатрия",
    13: "Ревматология",
    14: "Сердечно-сосудистая хирургия",
    15: "Торакальная хирургия",
    16: "Травматология и ортопедия",
    17: "Трансплантация",
    18: "Урология",
    19: "Челюстно-лицевая хирургия",
    20: "Эндокринология",
    21: "неонатология",
    22: "Хирургия",
    23: "Микрохирургия",
    24: "Сосудистая хирургия",
    25: "Кардиология"
};

const reverseCityMap: { [key: number]: string } = {
    1: "Москва",
    2: "Санкт-Петербург",
    3: "Другой город"
};

const FormModal: React.FC<FormModalProps> = ({show, onClose, onSave, onSaveData, patient, form,refreshPatientsList}) => {
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
    const [dataByTag, setDataByTag] = useState<Map<number, string[]>>(new Map());
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [radioGroupValue, setRadioGroupValue] = React.useState('Направление');
    const [mkbCodes, setMkbCodes] = useState<string[]>([]);
    const [selectedCode, setSelectedCode] = useState<string | null>(null);
    const [institutionNames, setInstitutionNames] = useState<string[]>([]);
    const [selectedName, setSelectedName] = useState<string | null>(null);
    const [documentNumber, setDocumentNumber] = useState<number | null>(null);
    const [combinedData, setCombinedData] = useState({
        patientData: null,
        formData: null
    });


    useEffect(() => {
        console.log("refreshPatientsList в FormModal:", refreshPatientsList);
    }, [refreshPatientsList]);

// Фетч для тэгов
    useEffect(() => {
        const fetchOptions = async (tag: number): Promise<string[]> => {
            const response = await axios.get<string[]>(`http://localhost:8080/api/reference/ref_listss?tag=${tag}`);
            return response.data;
        };

        const tags = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140];

        Promise.allSettled(tags.map(tag => fetchOptions(tag)))
            .then(results => {
                const newDataByTag = new Map<number, string[]>();
                results.forEach((result, index) => {
                    if (result.status === "fulfilled") {
                        console.log(`Response for tag ${tags[index]}:, response.data`);
                        newDataByTag.set(tags[index], result.value);
                    }
                    // Обработка данных для каждого запроса
                    // Например, обновление состояния для селекторов и автокомплитеров
                });
                setDataByTag(newDataByTag);
                console.log(`Data for tag:`, newDataByTag);
            })
            .catch(error => {
                console.error('Ошибка при загрузке данных:', error);
            });
    }, []);

    useEffect(() => {
        axios.get<string[]>(`http://localhost:8080/api/mkb_10/codes`)
            .then(response => setMkbCodes(response.data))
            .catch(error => console.error('Ошибка при загрузке данных:', error));

    }, []);

    useEffect(() => {
        axios.get<string[]>('http://localhost:8080/api/institution_name/names') // Замените на актуальный URL
            .then(response => setInstitutionNames(response.data))
            .catch(error => console.error('Ошибка при загрузке данных:', error));
    }, []);

    useEffect(() => {
        if (formData !== undefined) {
            setFormData(formData);
        }
        if (patient !== undefined) {
            setPatientData(patient);
        }
    }, [patient, form]);

    // useEffect(() => {
    //     if (patient) {
    //         const updatedTagValue = {
    //             ...tagValue,
    //             gender: Object.keys(genderMap).find(key => genderMap[key].toString() === patient.gender) || '',
    //             populationCategory: Object.keys(populationCategoryMap).find(key => populationCategoryMap[key] === patient.population_category) || ''
    //             // Добавьте дополнительные преобразования для других полей, если они есть
    //         };
    //         setTagValue(updatedTagValue);
    //     }
    // }, [patient, tagValue]);
    // useEffect(() => {
    //     if (patient) {
    //         setTagValue({
    //             gender: mapValueToString(patient.gender, genderMap),
    //             populationCategory: mapValueToString(patient.populationCategory, populationCategoryMap)
    //         });
    //     }
    // }, [patient]);
    //

    useEffect(() => {
        console.log("Содержимое populationCategoryMap:", populationCategoryMap);
    }, []);

    useEffect(() => {
        console.log("Исходные данные пациента:", patient);
        if (patient) {
            const populationCategoryValue = Number(patient.populationCategory);
            console.log("Преобразованное значение категории населения (число):", populationCategoryValue);
            const newPopulationCategory = populationCategoryMap[populationCategoryValue] || '';
            console.log("Преобразованное значение категории населения:", newPopulationCategory);

            setTagValue({
                gender: genderMap[Number(patient.gender)] || '',
                populationCategory: newPopulationCategory
            });
        }
    }, [patient]);

    useEffect(() => {
        console.log("Обновленное состояние tagValue:", tagValue);
    }, [tagValue]);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>,
        fieldName: keyof Patient
    ) => {
        const target = event.target as HTMLInputElement | { value: string };
        let value: string | number | null = target.value;

        if (fieldName === 'gender' || fieldName === 'populationCategory') {
            const numericValue = parseInt(target.value, 10);
            value = !isNaN(numericValue) ? numericValue : null;
        } else {
            value = value === '' ? null : value;
        }

        setPatientData(prevData => {
            if (!prevData) return null;
            return {
                ...prevData,
                [fieldName]: value
            } as Patient;
        });
    };

    const handleCopyData = () => {
        if (patient) {
            setPatientData(patient); // Копирование данных из patient в patientData
            setIsDataChanged(true); // Установка флага, что данные были изменены
        }
    };

    const loadPatients = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/patients/find_all`);
            setPatientsList(response.data);
        } catch (error) {
            console.error("Ошибка при загрузке списка пациентов:", error);
            // Обработка ошибок (например, отображение сообщения об ошибке)
        }
    };

    const loadForms = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/forms/find_all`);
            setFormsList(response.data);
        } catch (error) {
            console.error("Ошибка при загрузке списка форм:", error);
            // Обработка ошибок
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!patientData) {
            console.error("Нет данных для отправки");
            return;
        }
        console.log("handleSubmit в FormModal вызван");
        // Преобразование всех не заполненных полей в null
        const patientDataToSend = Object.entries(patientData).reduce((acc, [key, value]) => {
            if (typeof value === 'string') {
                acc[key as keyof Patient] = value.trim() === '' ? null : value;
            } else {
                acc[key as keyof Patient] = value;
            }
            return acc;
        }, {} as Patient);

        try {
            let response;
            // Проверяем, существует ли уже ID пациента для обновления
            if (patientDataToSend.id) {
                // Обновляем существующего пациента
                response = await axios.put(`http://localhost:8080/api/patients/${patientDataToSend.id}`, patientDataToSend);
            } else {
                // Создаем нового пациента
                response = await axios.post('http://localhost:8080/api/patients', patientDataToSend);
            }
            console.log("Ответ сервера:", response.data);

            if (typeof refreshPatientsList === 'function') {
                console.log('Обновление списка пациентов начато');
                await refreshPatientsList();
                console.log('Обновление списка пациентов завершено'); // Обновление списка пациентов
            }
            // if (typeof refreshPatientsList === 'function') {
            //     refreshPatientsList();
            // }
            // if (refreshPatientsList) {
            //     console.log("refreshPatientsList вызвана в FormModal");
            //     await refreshPatientsList();
            //     console.log("refreshPatientsList выполнена в FormModal");
            // }
            // await refreshPatientsList();
            // Вызываем handleSave для обработки сохраненных данных
            // handleSave(response.data);
            // await refreshPatientsList();
            // onSave(patientData);
            console.log("Вызов refreshPatientsList в FormModal");

            console.log("refreshPatientsList в FormModal выполнен");
            onClose(); // Закрытие модального окна
            // Дополнительные действия после успешной отправки
            // handleModalClose();
            // await loadPatients();
            // await loadForms();
        } catch (error) {
            console.error("Ошибка при отправке данных:", error);
            // Обработка ошибок при отправке
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

    const transformFormData = (formData: Patient): Patient => {
        return {
            ...formData,
            // gender: genderMap[formData.gender] ? genderMap[formData.gender].toString() : formData.gender,
            // populationCategory: populationCategoryMap[patientData.populationCategory] ? populationCategoryMap[patientData.populationCategory].toString() : patientData.populationCategory,
            // documentType: documentTypeMap[patientData.documentType] ? documentTypeMap[patientData.documentType].toString() : patientData.documentType,
            // gender: genderMap[patientData.gender] || patientData.gender,
            populationCategory: populationCategoryMap[formData.populationCategory] || formData.populationCategory,
            documentType: documentTypeMap[formData.documentType] || formData.documentType,
            disabilityCategory: disabilityCategoryMap[formData.disabilityCategory] || formData.disabilityCategory,
            profile: profileMap[formData.profile] || formData.profile,
            city: cityMap[formData.city] || formData.city
        };
    };


    // const handleChange = (event: SelectChangeEvent, id: string) => {
    //     console.log("значение:", event.target.value);
    //     setTagValue(prev => ({...prev, [id]: event.target.value}))
    // };

    // const handleChange = (event: SelectChangeEvent, id: keyof Patient | keyof Form) => {
    //     const { value } = event.target;
    //
    //     // Обновление данных пациента
    //     if (patientData && Object.keys(patientData).includes(id as string)) {
    //         setPatientData(prev => {
    //             // Проверка на null
    //             if (prev === null) return null;
    //
    //             // Гарантируем, что возвращаемый объект соответствует типу Patient
    //             const updatedPatient: Patient = {
    //                 ...prev,
    //                 [id]: value
    //             };
    //
    //             return updatedPatient;
    //         });
    //     }
    //
    //     // Обновление данных формы
    //     if (formData && Object.keys(formData).includes(id as string)) {
    //         setFormData(prev => {
    //             // Проверка на null
    //             if (prev === null) return null;
    //
    //             // Возвращаем обновленный объект формы
    //             const updatedForm: Form = {
    //                 ...prev,
    //                 [id]: value
    //             };
    //
    //             return updatedForm;
    //         });
    //     }
    // };
    // const handleChange = (event: SelectChangeEvent, id: keyof Patient) => {
    //     const selectedValue = event.target.value as string;
    //
    //     setPatientData((prevData) => {
    //         if (prevData === null) return null;
    //
    //         let newValue: string | number;
    //         if (id === 'gender') {
    //             newValue = genderMap[selectedValue] || selectedValue;
    //         } else if (id === 'populationCategory') {
    //             newValue = populationCategoryMap[selectedValue] || selectedValue;
    //         } else {
    //             newValue = selectedValue;
    //         }
    //
    //         return {
    //             ...prevData,
    //             [id]: newValue,
    //         };
    //     });
    // };


    const handleChangeRadioGroup = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRadioGroupValue((event.target as HTMLInputElement).value);
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

    const handleChangeTextAutoComplete = (
        event: React.SyntheticEvent<Element, Event>,
        newValue: { label: string; } | null,
        fieldName: string
    ) => {
        setPatientData(prevFormData => ({
            ...prevFormData,
            [fieldName]: newValue ? newValue.label : null
        } as Patient));
    };

    // const handleChangeTextAutoCompleteForms = (
    //     event: React.SyntheticEvent<Element, Event>,
    //     newValue: { label: string; } | null,
    //     fieldName: string
    // ) => {
    //     setFormData(prevFormData => ({
    //         ...prevFormData,
    //         [fieldName]: newValue ? newValue.label : null
    //     }));
    // };

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

    useEffect(() => {
        console.log("Полученный пациент:", patient);
        if (patient) {
            setPatientData(patient);
        } else {
            setPatientData(null)
        }
    }, [patient]);

    const handleModalClose = () => {
        const hasChanges = isDataChanged || (patientData && JSON.stringify(patientData) !== JSON.stringify(patient));
        if (isDataChanged && !window.confirm('Данные не сохранены. Вы уверены, что хотите выйти?')) {
            return;
        }
        onClose();
    };

    // const handleDateChange = (newValue: Dayjs | null) => {
    //     setPatientData(prevData => ({
    //         ...prevData,
    //         dateOfBirth: newValue // Предполагается, что dateOfBirth может быть Dayjs или null
    //     }));
    // };

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
        if (form) {
            setFormData(form);
        } else {
            // Очистите данные формы, если form не передан
            setFormData(null);
        }
    }, [form]);

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

    // const genderString = Object.keys(genderMap).find(key => genderMap[key] === Number(patientData?.gender));
    // const populationString = Object.keys(populationCategoryMap).find(key => populationCategoryMap[key] === Number(patientData?.populationCategory));

    const optionDataCategoryDisability = dataByTag.get(60)?.map((option) => ({label: option})) || [];

    const optionDataProfile = dataByTag.get(80)?.map((option) => ({label: option})) || [];
    const selectedProfile = optionDataProfile.find(option => option.label === String(formData?.profile_name));

    const optionDataInstitution = dataByTag.get(90)?.map((option) => ({label: option})) || [];
    const optionDataDocType = dataByTag.get(30)?.map((option) => ({label: option})) || [];

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
                                   label="№"
                                   value={documentNumber !== null ? documentNumber.toString() : ''}
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
                            <InputLabel id="populationCategory">Категория Населения</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                // value={patientData?.populationCategory !== undefined ? patientData.populationCategory.toString() : ''}
                                // onChange={(e) => handleChange(e, 'populationCategory')}
                                // value={tagValue['populationCategory'] || ''}
                                // value={patientData?.gender.toString() || ''}
                                // onChange={(e) => handleChange(e, 'population_category')}
                                value={populationCategoryMap[patientData?.populationCategory] || ''}
                                onChange={(e) => handleChange(e, 'populationCategory')}
                                label="populationCategory"
                            >
                                {Object.entries(populationCategoryMap).map(([key, value]) => (
                                    <MenuItem key={key} value={key}>{value}</MenuItem>
                                ))}
                                {/*{options.map((option, index) => (*/}
                                {/*    <MenuItem key={index} value={option}>{option}</MenuItem>*/}
                                {/*))}*/}
                                {/*{dataByTag.get(20)?.map((option: string, index: number)=>(*/}
                                {/*    <MenuItem key={index} value={option}>{option}</MenuItem>*/}
                                {/*))}*/}
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
                                // value={genderString || ''}
                                // onChange={(e) => handleChange(e, 'gender')}
                                // value={patientData?.gender.toString() || ''}
                                // onChange={(e) => handleChange(e, 'gender')}
                                // value={genderMap[patientData?.gender] || ''}
                                // onChange={(e) => handleChange(e, 'gender')}
                                value={patientData?.gender ? patientData.gender.toString() : ''}
                                onChange={(e) => handleChange(e, 'gender')}
                                label="Gender"
                            >
                                {/*{dataByTag.get(10)?.map((option, index) => (*/}
                                {/*    <MenuItem key={index} value={option}>{option}</MenuItem>*/}
                                {/*))}*/}
                                {Object.entries(genderMap).map(([key, value]) => (
                                    <MenuItem key={key} value={key}>{value}</MenuItem>
                                ))}
                                {/*{dataByTag.get(10)?.map((option: string, index: number) => (*/}
                                {/*    <MenuItem key={index} value={option}>{option}</MenuItem>*/}
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
                            >Вид Документа</FormLabel>
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
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateField
                                label="Дата Рождения"
                                value={value} // установка значения
                                onChange={(newValue) => setValue(newValue)} // обработка изменения
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
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={optionDataCategoryDisability}
                            renderInput={(params) => <TextField {...params} label="Категория льготы"/>}
                            value={formData?.disabled_cat ? optionDataCategoryDisability.find(option => option.label === String(formData.disabled_cat)) : null}
                            onChange={(event, newValue) => handleChangeTextAutoComplete(event, newValue, 'disabled_cat')}
                        />
                        {/*<TextField label="Код кат. льготы" variant="outlined" fullWidth/>*/}
                        <TextField label="Снилс" variant="outlined" fullWidth
                                   value={patientData?.snils || ''}
                                   onChange={(e) => handleChangeText(e, 'snils')}
                        />
                        <TextField label="Полис" variant="outlined" fullWidth
                                   value={patientData?.insurance_policy || ''}
                                   onChange={(e) => handleChangeText(e, 'insurance_policy')}
                        />
                        {/*<TextField label="Документ" variant="outlined" fullWidth/>*/}
                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={optionDataDocType}
                            renderInput={(params) => <TextField {...params} label="Документ личности"/>}
                            value={patientData?.document_type || ''}
                            onChange={(event, newValue) => handleChangeTextAutoComplete(event, newValue, 'documentType')}
                        />
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
                            {/* Три текстовых поля для левой колонки */}
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={options}
                                renderInput={(params) => <TextField {...params} label="Группа ВМП"/>}
                                // value={formData?.vmp_group ? String(formData.vmp_group) : ''}
                                // onChange={(event, newValue) => handleChangeTextAutoComplete(event, newValue, 'vmp_group')}
                            />
                            {/*<TextField label="Группа инвалидности" variant="outlined" fullWidth/>*/}
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={options}
                                renderInput={(params) => <TextField {...params} label="Группа инвалидности"/>}
                                // value={formData?.disabled_cat || ''}
                                // onChange={(event,newValue) => handleChangeTextAutoComplete(event,newValue, 'disabled_cat')}
                            />
                            <TextField label="Нуждается" variant="outlined" fullWidth
                                       value={patientData?.need_cat || ''}
                                       onChange={(e) => handleChangeText(e, 'need_cat')}
                            />
                            <TextField label="Оплата" variant="outlined" fullWidth
                                       value={patientData?.payment_cat || ''}
                                       onChange={(e) => handleChangeText(e, 'payment_cat')}
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
                            {/*<Autocomplete*/}
                            {/*    disablePortal*/}
                            {/*    id="combo-box-demo"*/}
                            {/*    options={options}*/}
                            {/*    renderInput={(params) => <TextField {...params} label="МКБ10"/>}*/}
                            {/*    // value={formData?.mkb_10 ? String(formData.mkb_10) : ''}*/}
                            {/*    // onChange={(event, newValue) => handleChangeTextAutoComplete(event, newValue, 'mkb_10')}*/}
                            {/*/>*/}

                            <Autocomplete
                                disablePortal
                                id="mkb-code-autocomplete"
                                options={mkbCodes}
                                value={selectedCode}
                                onChange={(event: React.SyntheticEvent, newValue: string | null) => setSelectedCode(newValue)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Код МКБ-10" variant="outlined"/>
                                )}
                            />
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={optionDataProfile}
                                // value={selectedProfile}
                                // onChange={(event, newValue: string | null) => handleChangeTextAutoCompleteForms(event,newValue,'profile_name')}
                                // renderInput={(params) => (
                                //     <TextField {...params} label="Профиль" variant="outlined"/>
                                //)}
                                renderInput={(params) => <TextField {...params} label="Профиль"/>}
                                // value={formData?.profile_name ? String(formData.profile_name) : ''}
                                // onChange={(event, newValue) => handleChangeTextAutoComplete(event, newValue, 'profile_name')}
                            />
                            {/*<TextField label="Институт" variant="outlined" fullWidth/>*/}
                            <Autocomplete
                                disablePortal
                                id="institution-name-autocomplete"
                                options={institutionNames}
                                value={selectedName}
                                onChange={(event: React.SyntheticEvent, newValue: string | null) => setSelectedName(newValue)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Наименование учреждения" variant="outlined"/>
                                )}
                            />
                            <TextField label="Подпись" variant="outlined" fullWidth
                                       value={patientData?.signature || ''}
                                       onChange={(e) => handleChangeText(e, 'signature')}
                            />
                            <TextField label="Характер Заболевания" variant="outlined" fullWidth
                                       value={patientData?.char_of_disease || ''}
                                       onChange={(e) => handleChangeText(e, 'char_of_disease')}
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

                                <InputLabel id="gender2">Пол</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="gender2"
                                    value={tagValue['gender2'] || ''}
                                    onChange={(e) => handleChange(e, 'gender2')}
                                    label="Gender"
                                    fullWidth
                                    sx={{
                                        maxWidth: 120,
                                        // margin: '6px',
                                    }}>
                                    {options.map((option, index) => (
                                        <MenuItem key={index} value={option}>{option}</MenuItem>
                                    ))}
                                    {dataByTag.get(10)?.map((option: string, index: number) => (
                                        <MenuItem key={index} value={option}>{option}</MenuItem>
                                    ))}
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
                            label="Модель Пациента"
                            variant="outlined"
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