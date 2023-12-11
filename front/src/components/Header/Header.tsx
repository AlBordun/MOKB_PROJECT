import React, {useEffect, useRef, useState} from 'react';
import 'tailwindcss/tailwind.css';
// import Button from "../Button/Button";
import {
    Box,
    Button,
    ButtonBase,
    Checkbox,
    Grid,
    InputLabel,
    ListItemText,
    Menu,
    MenuItem,
    Modal,
    SelectChangeEvent,
    TextField,
    Toolbar
} from '@mui/material';
import {Patient} from "../Patient/Patient";
import FormModal from "../FormModal/FormModal";
import IconButton from '@mui/material/IconButton';
// import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import Tooltip from '@mui/material/Tooltip';
import {styled} from '@mui/material/styles';
import {black} from "material-ui/styles/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import DeleteIcon from "@mui/icons-material/Delete";

interface HeaderProps {

    onProtocolClick: () => void;// Функция для обработки клика по кнопке "Протокол"
    onReferralClick: () => void;// Функция для обработки клика по кнопке "Направление"
    onTicketClick: () => void;// Функция для обработки клика по кнопке "Талон 2"
}

interface ColumnTranslations {
    [key: string]: string;
}

const columnNames: { [key: string]: string } = {
    id: "ID",
    first_name: "Имя",
    last_name: "Фамилия",
    middle_name: "Отчество",
    date_of_birth: "Дата рождения",
    gender: "Пол",
    population_category: "Категория",
    document_type: "Документ",
    passport_series: "Серия паспорта",
    passport_number: "Номер паспорта",
    registration_address: "Адрес прописки",
    actual_address: "Фактический адрес",
    snils: "СНИЛС",
    insurance_policy: "Полис",
    // ... Другие поля
};

const ITEM_HEIGHT = 48;
// Компонент Header, принимающий пропсы с типом SideBarProps
const Header: React.FC<HeaderProps> = ({onProtocolClick, onReferralClick, onTicketClick}) => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selected, setSelected] = useState<number[]>([]);
    const [AnchorElFirst, setAnchorElFirst] = useState<null | HTMLElement>(null);
    const [AnchorElSecond, setAnchorElSecond] = useState<null | HTMLElement>(null);
    const isMenuOpenFirst = Boolean(AnchorElFirst);
    const [searchVisible, setSearchVisible] = useState(false);
    const [filter, setFilter] = useState('');
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
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        id: true,
        first_name: true,
        last_name: true,
        middle_name: true,
        date_of_birth: true,
        gender: true,
        population_category: true,
        document_type: true,
        passport_series: true,
        passport_number: true,
        registration_address: true,
        actual_address: true,
        snils: true,
        insurance_policy: true,
        // ... остальные поля
    });

    const handleDeleteSelected = () => {
        setPatients(currentPatients =>
            currentPatients.filter(patient => !selected.includes(patient.id)));
        setSelected([]);
    };

    const toggleColumnVisibility = (column: keyof Patient) => {
        setColumnVisibility(prev => ({
            ...prev,
            [column]: !prev[column as keyof typeof prev]
        }));
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

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const handleMenuOpen1 = (event: React.MouseEvent<HTMLElement>) => {
        console.log(event.currentTarget);
        setAnchorElFirst(event.currentTarget);
    };
    const handleMenuOpen2 = (event: React.MouseEvent<HTMLElement>) => {
        console.log(event.currentTarget);
        setAnchorElSecond(event.currentTarget);
    };
    const handleCloseMenu1 = () => {
        setAnchorElFirst(null);
    };
    const handleCloseMenu2 = () => {
        setAnchorElSecond(null);
    };

    const filterByDocumentType = (type: string) => {
        setFilter(type);
    };
    const handleSearchIconClick = () => {
        setSearchVisible(!searchVisible);
    };
    const searchFieldStyles = {
        transition: 'opacity 0.5s, visibility 0.5s',
        opacity: searchVisible ? 1 : 0,
        visibility: searchVisible ? 'visible' : 'hidden',
        marginRight: 2
    };
    type Order = 'asc' | 'desc';

    const MyCustomToolbar = () => (

        <Toolbar sx={{
            position: 'relative',
            direction: 'row-reverse',
            justifyContent: 'flex-end',
            alignItems: 'center',
        }}>
             <span className="h-12 flex items-center justify-center uppercase font-semibold px-8 mr-2
                     border border-black hover:bg-black hover:text-white transition duration-500 ease-in-out cursor-pointer"
                   onClick={handleOpenModal}
             >Создать</span>
            <div>
                <IconButton
                    aria-label="Документы"
                    id="long-button"
                    aria-controls={isMenuOpenFirst ? 'long-menu' : undefined}
                    aria-expanded={isMenuOpenFirst ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleMenuOpen1}
                >
                    <MoreVertIcon/>
                </IconButton>
                <Menu
                    id="long-menu"
                    MenuListProps={{
                        'aria-labelledby': 'long-button',
                    }}
                    anchorEl={AnchorElFirst}
                    open={Boolean(AnchorElFirst)}
                    onClose={handleCloseMenu1}
                    PaperProps={{
                        style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: '20ch',
                        },
                    }}
                >
                    <MenuItem onClick={handleCloseMenu1}>
                        <Button
                            variant="text"
                            size="small"
                            sx={{
                                mr: 1,
                                color: 'darkcyan',
                                borderColor: 'darkcyan',
                                // borderRadius: '16px',
                                '&:hover': {
                                    transitionDuration: '500ms',
                                    backgroundColor: 'darkcyan', // Цвет фона при наведении
                                    color: 'white', // Цвет текста при наведении
                                    borderColor: 'darkcyan'
                                }
                            }}
                            onClick={() => filterByDocumentType('Направления')}
                        >
                            Направления
                        </Button>
                    </MenuItem>
                    <MenuItem onClick={handleCloseMenu1}><Button
                        variant="text"
                        size="small"
                        sx={{
                            mr: 1,
                            color: '#2196f3',
                            borderColor: '#2196f3',
                            // borderRadius: '16px',
                            '&:hover': {
                                backgroundColor: '#2196f3', // Цвет фона при наведении
                                color: 'white', // Цвет текста при наведении
                                borderColor: '#2196f3'
                            }
                        }}
                        onClick={() => filterByDocumentType('Протоколы')}
                    >
                        Протоколы
                    </Button>
                    </MenuItem>
                    <MenuItem onClick={handleCloseMenu1}><Button
                        variant="text"
                        size="small"
                        sx={{
                            mr: 1,
                            color: '#e91e63',
                            borderColor: '#e91e63',
                            // borderRadius: '16px',
                            '&:hover': {
                                backgroundColor: '#e91e63', // Цвет фона при наведении
                                color: 'white', // Цвет текста при наведении
                                borderColor: '#e91e63'
                            }
                        }}
                        onClick={() => filterByDocumentType('Талоны')}
                    >
                        Талоны
                    </Button></MenuItem>
                    <MenuItem onClick={handleCloseMenu1}><Button
                        variant="text"
                        size="small"
                        sx={{
                            color: 'black',
                            borderColor: 'black',
                            // borderRadius: '16px',
                            '&:hover': {
                                backgroundColor: 'black', // Цвет фона при наведении
                                color: 'white', // Цвет текста при наведении
                                borderColor: 'black'
                            }
                        }}
                        onClick={() => filterByDocumentType('')}
                    >
                        Пациенты
                    </Button></MenuItem>
                </Menu>
            </div>
            <Box sx={{
                // display: 'flex-end',
                // alignItems: 'center',
                // justifyContent: 'flex-end'
            }}
            >
                <TextField
                    id="standard-basic"
                    label="Search"
                    variant="standard"
                    value={searchText}
                    onChange={handleSearchChange}
                    sx={searchFieldStyles}
                />
                <IconButton onClick={handleSearchIconClick} color="inherit">
                    <SearchIcon/>
                </IconButton>
            </Box>

            {/* Иконка настроек столбцов */}
            <IconButton
                aria-label="Настройки столбцов"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen2}
                color="inherit"
            >
                <ViewWeekIcon/>
            </IconButton>

            {/* Иконка удаления */}
            <IconButton onClick={handleDeleteSelected} disabled={selected.length === 0} color="inherit">
                <DeleteIcon/>
            </IconButton>

            {/* Меню выбора столбцов */}
            <Menu
                anchorEl={AnchorElSecond}
                open={Boolean(AnchorElSecond)}
                onClose={handleCloseMenu2}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {Object.keys(columnVisibility).map((column) => (
                    <MenuItem key={column}
                              onClick={() => toggleColumnVisibility(column as keyof Patient)}
                              sx={{marginY: '1px', paddingY: '1px'}} // Уменьшаем вертикальные отступы
                    >

                        <Checkbox
                            checked={columnVisibility[column as keyof Patient]}/>
                        <ListItemText
                            primary={columnNames[column as keyof ColumnTranslations] || column}/>
                    </MenuItem>
                ))}
            </Menu>
        </Toolbar>
    );
    return (
        <>

            <Grid container sx={{
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'flex-end',
            }}>
                <MyCustomToolbar/>
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