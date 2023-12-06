import React, {useState} from 'react';
import 'tailwindcss/tailwind.css';
// import Button from "../Button/Button";
import Select from "../Select/Select";
import Input from "../Input/Input";
import {
    Box,
    Button, Modal, TextField
} from '@mui/material';
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

    // function CustomModal({ open, handleClose }) {
    //     return (
    //         <Modal open={open} onClose={handleClose}>
    //             <Box sx={{
    //                 position: 'absolute',
    //                 top: '50%',
    //                 left: '50%',
    //                 transform: 'translate(-50%, -50%)',
    //                 width: '70%',
    //                 bgcolor: 'background.paper',
    //                 boxShadow: 24,
    //                 p: 4,
    //                 display: 'flex',
    //                 flexDirection: 'column',
    //                 gap: 2
    //             }}>
    //                 <TextField label="refType" variant="outlined" fullWidth />
    //                 <TextField label="directionNumber" variant="outlined" fullWidth />
    //                 <TextField label="populationCategory" variant="outlined" fullWidth />
    //                 <TextField label="referralDate" variant="outlined" fullWidth />
    //                 <TextField label="snils" variant="outlined" fullWidth />
    //                 <TextField label="policyNumber" variant="outlined" fullWidth />
    //                 <TextField label="lastName" variant="outlined" fullWidth />
    //                 <TextField label="firstName" variant="outlined" fullWidth />
    //                 <TextField label="middleName" variant="outlined" fullWidth />
    //                 <TextField label="gender" variant="outlined" fullWidth />
    //                 <TextField label="dateOfBirth" variant="outlined" fullWidth />
    //                 <TextField label="documentType" variant="outlined" fullWidth />
    //                 <TextField label="passportSeries" variant="outlined" fullWidth />
    //                 <TextField label="passportNumber" variant="outlined" fullWidth />
    //                 <TextField label="address" variant="outlined" fullWidth />
    //                 <TextField label="Additional Information" variant="outlined" fullWidth multiline rows={4} />
    //                 <Button variant="contained" color="primary">Submit</Button>
    //             </Box>
    //         </Modal>
    //     );
    // }

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