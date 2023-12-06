import React, {useEffect, useState} from 'react';
import 'tailwindcss/tailwind.css';
import axios from 'axios';
import {Patient} from '../Patient/Patient'; // Импорт типа данных пациента


// Определение интерфейса для свойств FormModal
interface FormModalProps {
    show: boolean;
    onClose: () => void;
    onSave: (data: Patient) => void;
    patient: Patient | null;
    copyData?: () => Patient; // Функция для копирования данных из других модалок
}

const FormModal: React.FC<FormModalProps> = ({show, onClose, onSave, patient, copyData}) => {
    const [formData, setFormData] = useState<Patient | null>(patient);
    const [isDataChanged, setIsDataChanged] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);


    // Функции обработчики событий формы
    const handlePreview = async () => {
        if (formData) {
            try {
                const response = await axios.post('/api/preview', formData, {responseType: 'blob'});
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

    const handlePrint = () => {
        handlePreview(); // Показать предпросмотр перед печатью
        window.print();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData({...formData,id: '',refType: "", address: "", dateOfBirth: "", directionNumber: "", documentType: "", firstName: "", gender: "", lastName: "", passportNumber: "", passportSeries: "", middleName: "", policyNumber: "", populationCategory: "", referralDate: "", snils: "", [name]: value});
        setIsDataChanged(true);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/patients', formData);
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

    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="absolute bg-white w-3/4 h-3/4 p-5 rounded-lg top-10 left-1/2 -translate-x-1/2 ">
                <form onSubmit={handleSubmit}>
                    {/* Форма с полями ввода */}
                    <input type="text" name="directionNumber" value={formData?.directionNumber || ''}
                           onChange={handleChange} placeholder="Направление №" className="mb-2 pateint-table-data"/>
                    {/* Категория населения */}
                    <select name="populationCategory" value={formData?.populationCategory} onChange={handleChange}
                            className="mb-2">
                        {/* Здесь добавьте опции */}
                    </select>

                    {/* Дата направления */}
                    <input type="date" name="referralDate" value={formData?.referralDate} onChange={handleChange}
                           className="mb-2"/>

                    {/* СНИЛС */}
                    <input type="text" name="snils" value={formData?.snils} onChange={handleChange} placeholder="СНИЛС"
                           className="mb-2"/>

                    {/* ... Дополнительные поля, аналогично указанным выше */}

                    {/* Фамилия */}
                    <input type="text" name="lastName" value={formData?.lastName} onChange={handleChange}
                           placeholder="Фамилия" className="mb-2"/>

                    {/* Имя */}
                    <input type="text" name="firstName" value={formData?.firstName} onChange={handleChange}
                           placeholder="Имя" className="mb-2"/>

                    {/* Отчество */}
                    <input type="text" name="patronymic" value={formData?.middleName} onChange={handleChange}
                           placeholder="Отчество" className="mb-2"/>

                    {/* Пол */}
                    <select name="gender" value={formData?.gender} onChange={handleChange} className="mb-2">
                        {/* Опции для выбора пола */}
                    </select>

                    {/* Дата рождения */}
                    <input type="date" name="dateOfBirth" value={formData?.dateOfBirth} onChange={handleChange}
                           className="mb-2"/>

                    {/* Тип документа */}
                    <input type="text" name="documentType" value={formData?.documentType} onChange={handleChange}
                           placeholder="Тип документа" className="mb-2"/>

                    {/* Серия паспорта */}
                    <input type="text" name="passportSeries" value={formData?.passportSeries} onChange={handleChange}
                           placeholder="Серия паспорта" className="mb-2"/>

                    {/* Номер паспорта */}
                    <input type="text" name="passportNumber" value={formData?.passportNumber} onChange={handleChange}
                           placeholder="Номер паспорта" className="mb-2"/>

                    {/* Адрес */}
                    <input type="text" name="address" value={formData?.address} onChange={handleChange}
                           placeholder="Адрес" className="mb-2"/>

                    {/* ... Другие поля, как требуется */}

                </form>
                <div className="flex justify-center space-x-4 items-center">
                    <button onClick={handlePreview} className="text-black  py-2  px-6 text-2xl items-center hover:text-gray-400 ">
                        Предпросмотр
                    </button>
                    <button onClick={handlePrint} className="text-black  py-2  px-6 text-2xl items-center hover:text-gray-400 ">
                        Печать
                    </button>
                    <button onClick={handleCopyData} className="ttext-black  py-2  px-6 text-2xl items-center hover:text-gray-400 ">
                        Копировать данные
                    </button>
                    <button onClick={handleModalClose} className="text-black  py-2  px-6 text-2xl items-center hover:text-gray-400 ">
                        Закрыть
                    </button>
                    <button type="submit"
                            className="text-black  py-2  px-6 text-2xl items-center hover:text-gray-400 ">
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormModal;