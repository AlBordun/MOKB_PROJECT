import React, {useEffect, useRef, useState} from 'react';
import 'tailwindcss/tailwind.css';
// import Button from "../Button/Button";
import {
    Box,
    Button, Grid, InputLabel, MenuItem, Modal, SelectChangeEvent, TextField
} from '@mui/material';
import {Patient} from "../Patient/Patient";
import FormModal from "../FormModal/FormModal";
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

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
    const CustomIconButton = styled(IconButton)(({ theme }) => ({
        position: 'absolute',
        right: theme.spacing(2),
        top: theme.spacing(2),
        zIndex: 1000,
        '&:hover': {
            color: 'cyan',
            '& .text': {
                width: 'auto', // Развернуть текст при наведении
                opacity: 1, // Сделать текст полностью видимым
                display: 'inline', // Показать текст
                fontSize: '2em', // Увеличить размер шрифта текста при наведении
            }
        },
        '& .text': {
            width: 0, // Скрыть текст по умолчанию
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            opacity: 0,
            fontSize: '2em', // Увеличить размер шрифта текста
            marginLeft: theme.spacing(1),
            // marginLeft: '8px', // Отступ слева от иконки
            transition: 'width 0.3s ease, opacity 0.3s ease',
        },
        transition: 'color 0.3s ease-in-out',
        fontSize: '96px',
    }));
    return (
        <>
          <Grid sx = {{
              padding: '60px 20px'
          }}>  <CustomIconButton onClick={handleOpenModal}>
                <Tooltip title="Создать" placement="right">
                    <AddCircleOutlineOutlinedIcon style={{ fontSize: '96px' }}/>
                </Tooltip>
            </CustomIconButton>
          </Grid>
    {
        isModalOpen && (
            <FormModal
                show={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveData}
                patient={initialPatientData}
            />
        )
    }
</>
)
    ;
};

export default Header;