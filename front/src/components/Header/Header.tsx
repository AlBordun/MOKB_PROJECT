import React, {useEffect, useRef, useState} from 'react';
import 'tailwindcss/tailwind.css';
// import Button from "../Button/Button";
import Select from "../Select/Select";
import Input from "../Input/Input";
import {
    Box,
    Button, FormControl, Grid, InputLabel, MenuItem, Modal, SelectChangeEvent, TextField
} from '@mui/material';
import {Patient} from "../Patient/Patient";
import axios from "axios";
import FormModal from "../FormModal/FormModal";


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
        realAddress: '',
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
                <Button
                    onClick={handleOpenModal}
                    variant="outlined"
                    sx={{
                        fontSize: '1.2rem', // Увеличить размер шрифта
                        padding: '10px 20px', // Добавить padding
                        width: '200px', // Задать ширину
                        height: '50px', // Задать высоту
                        border: '1.5px solid',
                    }}
                >
                    Протокол

                </Button>
                <Button
                    onClick={handleOpenModal}
                    variant="outlined"
                    sx={{
                        fontSize: '1.2rem', // Увеличить размер шрифта
                        padding: '10px 20px', // Добавить padding
                        width: '200px', // Задать ширину
                        height: '50px', // Задать высоту
                        border: '1.5px solid',
                    }}
                >Направление
                </Button>
                <Button
                    onClick={handleOpenModal}
                    variant="outlined"
                    sx={{
                        fontSize: '1.2rem', // Увеличить размер шрифта
                        padding: '10px 20px', // Добавить padding
                        width: '200px', // Задать ширину
                        height: '50px', // Задать высоту
                        border: '1.5px solid',
                    }}
                >Талон
                </Button>
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