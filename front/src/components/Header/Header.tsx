import React, {useEffect, useRef, useState} from 'react';
import 'tailwindcss/tailwind.css';
// import Button from "../Button/Button";
import {
    Box,
    Button, ButtonBase, Grid, InputLabel, MenuItem, Modal, SelectChangeEvent, TextField
} from '@mui/material';
import {Patient} from "../Patient/Patient";
import FormModal from "../FormModal/FormModal";
import IconButton from '@mui/material/IconButton';
// import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import {black} from "material-ui/styles/colors";

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
    // const buttonColor = 'black';
    // const hoverBorderColor = 'black';
    // const hoverUnderlineColor = 'black';
    //
    // const ImageButton = styled(ButtonBase)(({ theme }) => ({
    //     position: 'relative',
    //     height: 200,
    //     backgroundColor: buttonColor,
    //     [theme.breakpoints.down('sm')]: {
    //         width: '100% !important', // Overrides inline-style
    //         height: 100,
    //     },
    //     '&:hover, &.Mui-focusVisible': {
    //         zIndex: 1,
    //         '& .MuiImageBackdrop-root': {
    //             opacity: 0.15,
    //         },
    //         '& .MuiImageMarked-root': {
    //             opacity: 0,
    //         },
    //         '& .MuiTypography-root': {
    //             border: `4px solid ${hoverBorderColor}`,
    //         },
            // '&:after': {
            //     content: '"',
            //     position: 'absolute',
            //     bottom: 0,
            //     left: 0,
            //     right: 0,
            //     height: '4px',
            //     backgroundColor: hoverUnderlineColor,
            // },
    //     },
    // }));
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
          }}>
                {/*<ImageButton*/}
                {/*    focusRipple*/}
                {/*    key = "key"*/}
                {/*   style = {{*/}
                {/*       fontSize: '32px',*/}
                {/*   }}>*/}
                {/*    Создать*/}
                {/*</ImageButton>*/}

              <CustomIconButton onClick={handleOpenModal}>
                <Tooltip title="Создать" placement="right">
                    {/*<AddCircleOutlineOutlinedIcon style={{ fontSize: '96px' }}/>*/}
                    <Button
                        variant="outlined"
                        size="large"
                        sx={{
                            // mr: 1,
                            color: '#00b0ff',
                            borderColor: '#00b0ff',
                            borderRadius: '48px',
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: '#00b0ff', // Цвет фона при наведении
                                color: 'white', // Цвет текста при наведении
                                borderColor: '#00b0ff'
                            },
                            '&.MuiButton-sizeLarge':{
                                fontSize: '32px',

                            }
                        }}
                    >Создать
                    </Button>
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