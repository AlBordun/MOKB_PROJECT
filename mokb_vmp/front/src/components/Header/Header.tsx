import React, {useState} from 'react';
import 'tailwindcss/tailwind.css';
import Button from "../Button/Button";
import Select from "../Select/Select";
import Input from "../Input/Input";
import FormModal from "../FormModal/FormModal";
import {Patient} from "../Patient/Patient";


interface HeaderProps {

    onProtocolClick: () => void;// Функция для обработки клика по кнопке "Протокол"
    onReferralClick: () => void;// Функция для обработки клика по кнопке "Направление"
    onTicketClick: () => void;// Функция для обработки клика по кнопке "Талон 2"

}


// Компонент Header, принимающий пропсы с типом SideBarProps
const Header: React.FC<HeaderProps> = ({onProtocolClick, onReferralClick, onTicketClick}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const initialPatientData: Patient = {
        id: '',
        refType: '',
        firstName: '',
        lastName: '',
        middleName: '',
        dateOfBirth: '',
        snils: '',
        address: '',
        directionNumber: '',
        documentType: '',
        passportSeries: '',
        passportNumber: '',
        policyNumber: '',
        populationCategory: '',
        referralDate: '',
        gender: '',
        // Другие поля, которые могут потребоваться
    };
    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleSaveData = (patientData: Patient) => {
        // Логика для обработки данных формы
        console.log("Сохраняемые данные:", patientData);
        setIsModalOpen(false); // Закрытие модального окна после сохранения данных
    }
    return (
        <>
            {/*Контейнер хедера*/}
            <div className=" top-0 w-full p-4 flex justify-center space-x-10 items-center">

                {/* Список элементов */}
                <button
                    onClick={handleOpenModal}
                    className="text-black border-2 border-black py-2  px-6 text-2xl rounded items-center
                    hover:text-gray-400 hover:border-gray-400 p-2">
                    Протокол
                </button>
                <button
                    onClick={handleOpenModal}
                    className="text-black border-2 border-black py-2  px-6 text-2xl rounded items-center
                    hover:text-gray-400 hover:border-gray-400">
                    Направление
                </button>
                <button
                    onClick={handleOpenModal}
                    className="text-black border-2 border-black py-2  px-6 text-2xl rounded items-center
                    hover:text-gray-400 hover:border-gray-400">
                    Талон
                </button>
                <div
                    className="absolute top-20 bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-black to-transparent"></div>
            </div>
            {/* Модальное окно, которое отображается, когда isModalOpen истинно */}
            {isModalOpen && (
                <FormModal
                    show={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveData}
                    patient={initialPatientData}
                />
            )}
        </>
    );
};

export default Header;