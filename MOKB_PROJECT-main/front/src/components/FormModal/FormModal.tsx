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

const needCategoryMap: { [key: number]: string } = {
    1: "первично",
};

const FormNameMap: { [key: string]: number } = {
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

const reverseFormNameMap: { [key: number]: string } = {
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

const FormModal: React.FC<FormModalProps> = ({show,
                                                 onClose,
                                                 onSave,
                                                 onSaveData,
                                                 patient,
                                                 form,
                                                 refreshPatientsList,}) => {
    const [patientData, setPatientData] = useState<Patient | null>(patient);
    const [formData, setFormData] = useState<Form | null>(form || null);
    // const [localFormData, setLocalFormData] = useState<Form | null>(form || null);
    const [patientsList, setPatientsList] = useState<Patient[]>([]);
    const [formsList, setFormsList] = useState<Form[]>([]);
    const [isDataChanged, setIsDataChanged] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null)
    const [options, setOptions] = useState<string[]>([])
    const [value, setValue] = React.useState<Dayjs | null>(dayjs());
    const [tagValue, setTagValue] = React.useState<TagValue>({})
    // const [dataByTag, setDataByTag] = useState<Map<number, string[]>>(new Map());
    const [dataByTag, setDataByTag] = useState<Map<number, { id: number; label: string; }[]>>(new Map());
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [radioGroupValue, setRadioGroupValue] = React.useState('Направление');
    const [mkbCodes, setMkbCodes] = useState<string[]>([]);
    const [selectedCode, setSelectedCode] = useState<string | null>(null);
    // const [institutionNames, setInstitutionNames] = useState<number[]>([]);
    // const [selectedinstitutionNames, setSelectedinstitutionNames] = useState<number | null>(null);
    // const [institutions, setInstitutions] = useState<{ inst_id: number, name: string }[]>([]);
    const [institutions, setInstitutions] = useState<Institutions[]>([]);
    const [profiles, setProfiles] = useState<string | null>(null)

    // const [documentNumber, setDocumentNumber] = useState<number | null>(null);
    // const [combinedData, setCombinedData] = useState({
    //     patientData: null,
    //     formData: null
    // });

    useEffect(() => {
        // console.log("refreshPatientsList в FormModal:", refreshPatientsList);
    }, [refreshPatientsList]);

// Фетч для тэгов
//     useEffect(() => {
//         const fetchOptions = async (tag: number): Promise<string[]> => {
//             const response = await axios.get<string[]>(`http://localhost:8080/api/reference/ref_listss?tag=${tag}`);
//             return response.data;
//         };
//
//         const tags = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140];
//
//         Promise.allSettled(tags.map(tag => fetchOptions(tag)))
//             .then(results => {
//                 const newDataByTag = new Map<number, string[]>();
//                 results.forEach((result, index) => {
//                     if (result.status === "fulfilled") {
//                         console.log(`Response for tag ${tags[index]}:, response.data`);
//                         newDataByTag.set(tags[index], result.value);
//                     }
//                     // Обработка данных для каждого запроса
//                     // Например, обновление состояния для селекторов и автокомплитеров
//                 });
//                 setDataByTag(newDataByTag);
//                 console.log(`Data for tag:`, newDataByTag);
//             })
//             .catch(error => {
//                 console.error('Ошибка при загрузке данных:', error);
//             });
//     }, []);

    useEffect(() => {
        const fetchOptions = async (tag: number): Promise<{ id: number; label: string }[]> => {
            const response = await axios.get(`http://localhost:8080/api/reference/ref_listss?tag=${tag}`);
            return response.data; // предполагаем, что данные возвращаются в нужном формате
        };

        const tags = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140];

        Promise.allSettled(tags.map(tag => fetchOptions(tag)))
            .then(results => {
                const newDataByTag = new Map<number, { id: number; label: string }[]>();
                results.forEach((result, index) => {
                    if (result.status === "fulfilled") {
                        console.log(`Response for tag ${tags[index]}:, response.data`);
                        newDataByTag.set(tags[index], result.value);
                    }
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
    console.log("Selected mkb codes", mkbCodes);
    const handleMkbCodeChange = (event: React.SyntheticEvent, newValue: string | null) => {
        setSelectedCode(newValue);
        setFormData(prevFormData => {
            // Проверяем, не является ли prevFormData null перед обновлением
            return prevFormData ? { ...prevFormData, mkb_10: newValue } : null;
        });
    };

    useEffect(() => {
        axios.get('http://localhost:8080/api/institution_name/all')
            .then(response => {
                setInstitutions(response.data);
                console.log("Inst", response.data)
            })
            .catch(error => console.error('Ошибка при загрузке данных:', error));
    }, []);

    const handleInstitutionNamesChange = (
        event: React.SyntheticEvent<Element, Event>,
        newValue: Institutions   | null
    ) => {
        console.log("Selected institution", newValue);
        setFormData(prevFormData => {
            return prevFormData ? { ...prevFormData, inst_name: newValue ? newValue.inst_id : null } : null;
        });
    };

    // const handleProfileChange = (event: React.SyntheticEvent, newValue: string | null) => {
    //     console.log("Selected profiles", newValue);
    //     setProfiles(prevFormData => {
    //         return prevFormData ? { ...prevFormData, profile_name: newValue. null } : null;
    //     });
    // };

    // useEffect(() => {
    //     if (formData !== undefined) {
    //         setFormData(formData);
    //     }
    //     if (patient !== undefined) {
    //         setPatientData(patient);
    //     }
    // }, [patient, form]);

    // useEffect(() => {
    //     setLocalFormData(form);
    // }, [form]);

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
        // console.log("Исходные данные пациента:", patient);
        if (patient) {
            const populationCategoryValue = Number(patient.populationCategory);
            // console.log("Преобразованное значение категории населения (число):", populationCategoryValue);
            const newPopulationCategory = populationCategoryMap[populationCategoryValue] || '';
            // console.log("Преобразованное значение категории населения:", newPopulationCategory);

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

    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     if (!patientData) {
    //         console.error("Нет данных для отправки");
    //         return;
    //     }
    //     console.log("handleSubmit в FormModal вызван");
    //     // Преобразование всех не заполненных полей в null
    //     const patientDataToSend = Object.entries(patientData).reduce((acc, [key, value]) => {
    //         if (typeof value === 'string') {
    //             acc[key as keyof Patient] = value.trim() === '' ? null : value;
    //         } else {
    //             acc[key as keyof Patient] = value;
    //         }
    //         return acc;
    //     }, {} as Patient);
    //
    //     try {
    //         let response;
    //         // Проверяем, существует ли уже ID пациента для обновления
    //         if (patientDataToSend.id) {
    //             // Обновляем существующего пациента
    //             response = await axios.put(`http://localhost:8080/api/patients/${patientDataToSend.id}`, patientDataToSend);
    //         } else {
    //             // Создаем нового пациента
    //             response = await axios.post('http://localhost:8080/api/patients', patientDataToSend);
    //         }
    //         console.log("Ответ сервера:", response.data);
    //
    //         const formDataToSend = Object.entries(formData).reduce((acc, [key, value]) => {
    //             if (typeof value === 'string') {
    //                 // Очистка строковых значений
    //                 acc[key as keyof Form] = value.trim() === '' ? null : value;
    //             } else {
    //                 // Оставляем нестроковые значения без изменений
    //                 acc[key as keyof Form] = value;
    //             }
    //             return acc;
    //         }, {} as Form);
    //
    //         const formValue = radioGroupValue === 'Направление' ? 1:
    //             radioGroupValue === 'Протокол' ? 2: 3;
    //         patientDataToSend.form_name = formValue;
    //         try {
    //             let response;
    //         if (formDataToSend.id) {
    //             response = await axios.put(`http://localhost:8080/api/forms/${formDataToSend.id}`, formDataToSend);
    //         } else {
    //             response = await axios.post('http://localhost:8080/api/forms', formDataToSend);
    //         }
    //
    //
    //         if (typeof refreshPatientsList === 'function') {
    //             console.log('Обновление списка пациентов начато');
    //             await refreshPatientsList();
    //             console.log('Обновление списка пациентов завершено'); // Обновление списка пациентов
    //         }
    //         // if (typeof refreshPatientsList === 'function') {
    //         //     refreshPatientsList();
    //         // }
    //         // if (refreshPatientsList) {
    //         //     console.log("refreshPatientsList вызвана в FormModal");
    //         //     await refreshPatientsList();
    //         //     console.log("refreshPatientsList выполнена в FormModal");
    //         // }
    //         // await refreshPatientsList();
    //         // Вызываем handleSave для обработки сохраненных данных
    //         // handleSave(response.data);
    //         // await refreshPatientsList();
    //         // onSave(patientData);
    //         console.log("Вызов refreshPatientsList в FormModal");
    //
    //         console.log("refreshPatientsList в FormModal выполнен");
    //         onClose(); // Закрытие модального окна
    //         // Дополнительные действия после успешной отправки
    //         // handleModalClose();
    //         // await loadPatients();
    //         // await loadForms();
    //     } catch (error) {
    //         console.error("Ошибка при отправке данных:", error);
    //         // Обработка ошибок при отправке
    //     }
    // };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

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
            } catch (error) {
                console.error("Ошибка при отправке данных пациента:", error);
            }
        }

        // Обработка и отправка данных формы
        if (formData) {
            const formDataToSend = Object.entries(formData).reduce((acc, [key, value]) => {
                acc[key as keyof Form] = typeof value === 'string' && value.trim() === '' ? null : value;
                return acc;
            }, {} as Form);

            // Присваиваем form_name в соответствии с radioGroupValue
            formDataToSend.form_name = radioGroupValue === 'Направление' ? '1' :
                radioGroupValue === 'Протокол' ? '2' : '3';

            try {
                const formResponse = formData.id
                    ? await axios.put(`http://localhost:8080/api/forms/${formData.id}`, formDataToSend)
                    : await axios.post('http://localhost:8080/api/forms', formDataToSend);

                console.log("Ответ сервера по форме:", formResponse.data);
            } catch (error) {
                console.error("Ошибка при отправке данных формы:", error);
            }
        }

        // Действия после отправки данных
        if (typeof refreshPatientsList === 'function') {
            await refreshPatientsList();
        }

        onClose(); // Закрытие модального окна
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

    // const transformFormData = (formData: Patient): Patient => {
    //     return {
    //         ...formData,
    //         // gender: genderMap[formData.gender] ? genderMap[formData.gender].toString() : formData.gender,
    //         // populationCategory: populationCategoryMap[patientData.populationCategory] ? populationCategoryMap[patientData.populationCategory].toString() : patientData.populationCategory,
    //         // documentType: documentTypeMap[patientData.documentType] ? documentTypeMap[patientData.documentType].toString() : patientData.documentType,
    //         // gender: genderMap[patientData.gender] || patientData.gender,
    //         // populationCategory: populationCategoryMap[formData.populationCategory] || formData.populationCategory,
    //         documentType: documentTypeMap[formData.documentType] || formData.documentType,
    //         disabilityCategory: disabilityCategoryMap[formData.disabilityCategory] || formData.disabilityCategory,
    //         profile: profileMap[formData.profile] || formData.profile,
    //         city: cityMap[formData.city] || formData.city
    //     };
    // };


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


    // const handleChangeRadioGroup = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setRadioGroupValue((event.target as HTMLInputElement).value);
    // };

    const handleChangeRadioGroup = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = (event.target as HTMLInputElement).value;
        setRadioGroupValue(newValue);
        // Также обновите formData, если это необходимо
        // setFormData({...formData, form_name: newValue});
        setFormData(prevFormData => {
            // Проверяем, не является ли prevFormData null перед обновлением
            return prevFormData ? { ...prevFormData, form_name: newValue } : null;
        });
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

    // console.log("formData", formData);
    // console.log("institutions", institutions);
    //
    // if (formData && formData.inst_name !== undefined) {
    //     console.log("Searching for institution with id:", formData.inst_name);
    //
    //     const selectedInstitution = institutions.find(inst => {
    //         console.log(`Checking institution with id ${inst.inst_id}`);
    //         return inst.inst_id === formData.inst_name;
    //     });
    //
    //     console.log("selectedInstitution", selectedInstitution);
    //
    //     const isInOptions = selectedInstitution ? institutions.includes(selectedInstitution) : false;
    //     console.log("isInOptions", isInOptions);
    // }\

    const handleChangeTest = (
        event: React.SyntheticEvent<Element, Event>,
        newValue: { id: number; label: string; }  | null ,
    ) => {
        const newProfileNameIndex = newValue ? DataProfileOptions.indexOf(newValue) : -1;
        setFormData(prevFormData => ({
            ...prevFormData,
            profile_name: newProfileNameIndex
        }as Form));
    };

    // const genderString = Object.keys(genderMap).find(key => genderMap[key] === Number(patientData?.gender));
    // const populationString = Object.keys(populationCategoryMap).find(key => populationCategoryMap[key] === Number(patientData?.populationCategory));
    const disabilityOptions = dataByTag.get(60) || [];
    const DataProfileOptions = dataByTag.get(80) || [];
    // const optionDataCategoryDisability = dataByTag.get(60)?.map((option) => ({label: option})) || [];
    // const optionDataProfile = dataByTag.get(80)?.map((option) => ({label: option})) || [];
    const optionDataInstitution = dataByTag.get(90)?.map((option) => ({label: option})) || [];
    const optionDataDocType = dataByTag.get(30) || [];

    const currentProfileLabel = formData ? DataProfileOptions[formData.profile_name] || '' : '';


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
                                   label="№"
                                   value={formData?.id || ''}
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
                                value={patientData?.population_category ? patientData.population_category.toString() : ''}
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
                            options={disabilityOptions}
                            getOptionLabel = {(option) => option}
                            renderInput={(params) => <TextField {...params} label="Категория льготы"/>}
                            // value={formData ? disabilityOptions.find(option => option.id === formData.disability) : null}
                            value = {formData?.profile_name}
                            onChange={(event, newValue) => handleChangeTextAutoCompleteForms(event, newValue, 'disabled_cat')}
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
                                value={formData?.vmp_group || ''}
                                // value={formData?.vmp_group ? String(formData.vmp_group) : ''}
                                // onChange={(event, newValue) => handleChangeTextAutoComplete(event, newValue, 'vmp_group')}
                            />

                            {/*<Autocomplete*/}
                            {/*    disablePortal*/}
                            {/*    id="combo-box-demo"*/}
                            {/*    options={options}*/}
                            {/*    renderInput={(params) => <TextField {...params} label="Группа инвалидности"/>}*/}
                            {/*    value={formData?.disabled_cat || ''}*/}
                            {/*    onChange={(event,newValue) => handleChangeTextAutoComplete(event,newValue, 'disabled_cat')}*/}
                            {/*/>*/}

                            <FormControl fullWidth>
                                <InputLabel id="signature">Группа инвалидности</InputLabel>
                                <Select
                                    label="disabled_cat"
                                    labelId="demo-simple-select-standard-label"
                                    id="Signature-name-autocomplete"
                                    value={formData?.disabled_cat || ''}
                                    onChange={(e) => handleChange(e, 'disabled_cat')}
                                />
                                {/*{dataByTag.get(60)?.map((option, index) => (*/}
                                {/*    <MenuItem key={index} value={option}>{option}</MenuItem>*/}
                                {/*))}*/}
                            </FormControl>

                            {/*<TextField label="Нуждается" variant="outlined" fullWidth*/}
                            {/*           value={formData?.need_cat || ''}*/}
                            {/*           onChange={(e) => handleChangeText(e, 'need_cat')}*/}
                            {/*/>*/}

                            <FormControl fullWidth>
                                <InputLabel id="signature">Нуждается</InputLabel>
                                <Select
                                    label="need_cat"
                                    labelId="demo-simple-select-standard-label"
                                    id="Signature-name-autocomplete"
                                    value={formData?.need_cat ? formData.need_cat.toString() : ''}
                                    onChange={(e) => handleChange(e, 'need_cat')}
                                />
                            </FormControl>

                            {/*<TextField label="Оплата" variant="outlined" fullWidth*/}
                            {/*           value={formData?.payment_cat || ''}*/}
                            {/*           onChange={(e) => handleChangeText(e, 'payment_cat')}*/}
                            {/*/>*/}

                            <FormControl fullWidth>
                                <InputLabel id="signature">Оплата</InputLabel>
                                <Select
                                    label="need_cat"
                                    labelId="demo-simple-select-standard-label"
                                    id="Signature-name-autocomplete"
                                    value={formData?.payment_cat ? formData.payment_cat.toString() : ''}
                                    onChange={(e) => handleChange(e, 'payment_cat')}
                                />
                            </FormControl>

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
                                getOptionLabel = {(option) => option}
                                // value={selectedCode}
                                value={formData?.mkb_10 || ''}
                                onChange={handleMkbCodeChange}
                                renderInput={(params) => (
                                    <TextField {...params} label="Код МКБ-10" variant="outlined"/>
                                )}
                            />

                            {/*<Autocomplete*/}
                            {/*    disablePortal*/}
                            {/*    id="combo-box-demo"*/}
                            {/*    options={DataProfileOptions}*/}
                            {/*    getOptionLabel={(option) => option ? option.label : ''}*/}
                            {/*    value={formData ? DataProfileOptions.find(option => option.id === formData.profile_name) : null}*/}
                            {/*    renderInput={(params) => <TextField {...params} label="Профиль"/>}*/}
                            {/*    onChange={(event, newValue) => handleChangeTextAutoCompleteForms(event, newValue, 'profile_name')}*/}
                            {/*/>*/}

                            <Autocomplete
                                disablePortal
                                id="profile-autocomplete"
                                renderInput={(params) => <TextField {...params} label="Профиль"/>}
                                options={DataProfileOptions}
                                getOptionLabel={(option) => option}
                                value={formData?.profile_name}
                                onChange={handleChangeTest}
                                fullWidth
                            />

                            {/*<TextField label="Институт" variant="outlined" fullWidth/>*/}
                            <Autocomplete
                                disablePortal
                                id="institution-name-autocomplete"
                                options={institutions}
                                getOptionLabel={(option) => option.instName}
                                value = {formData ? institutions.find(inst => inst.inst_id === formData.inst_name) : null}
                                onChange={handleInstitutionNamesChange}
                                renderInput={(params) => (
                                    <TextField {...params} label="Наименование учреждения" variant="outlined"/>
                                )}
                            />
                            {/*<TextField label="Подпись" variant="outlined" fullWidth*/}
                            {/*           value={formData?.signature || ''}*/}
                            {/*           onChange={(e) => handleChangeText(e, 'signature')}*/}
                            {/*/>*/}
                            <FormControl fullWidth>
                            <InputLabel id="signature">Подпись</InputLabel>
                            <Select
                                label="signature"
                                labelId="demo-simple-select-standard-label"
                                id="Signature-name-autocomplete"
                                multiple
                                value={formData?.signature ? formData.signature.toString() : ''}
                                onChange={(e) => handleChange(e, 'signature')}
                            />
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
                                onChange={(e) => handleChange(e, 'char_of_disease')}
                            />
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
                                        label="Дата Рождения"
                                        value={value}
                                        onChange={(newValue) => setValue(newValue)}
                                        format="DD-MM-YYYY"
                                    />
                                </LocalizationProvider>

                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="gender2"
                                    value={patientData?.gender ? patientData.gender.toString() : ''}
                                    onChange={(e) => handleChange(e, 'gender2')}
                                    label="Пол"
                                    fullWidth
                                    sx={{
                                        maxWidth: 120,
                                        // margin: '6px',
                                    }}>
                                    {options.map((option, index) => (
                                        <MenuItem key={index} value={option}>{option}</MenuItem>
                                    ))}
                                    {/*{dataByTag.get(10)?.map((option: string, index: number) => (*/}
                                    {/*    <MenuItem key={index} value={option}>{option}</MenuItem>*/}
                                    {/*))}*/}
                                    {Object.entries(genderMap).map(([key, value]) => (
                                        <MenuItem key={key} value={key}>{value}</MenuItem>
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
                            value={formData?.patient_model || ''}
                            onChange={(e) => handleChangeText(e, 'patient_model')}
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