import React, {useState} from 'react';
import 'tailwindcss/tailwind.css';
import {
    Checkbox,
    Grid,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar
} from '@mui/material';
import {Patient} from "../DataInterfaces/Patient";
import FormModal from "../FormModal/FormModal";
import IconButton from '@mui/material/IconButton';
import SearchIcon from "@mui/icons-material/Search";
import ViewWeekIcon from "@mui/icons-material/ViewWeek";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import DateFilter from "../utils/DateFilter";
import {Form} from "../DataInterfaces/Form";
import axios from "axios";


interface HeaderProps {

    searchText: string;
    setSearchText: (text: string) => void;
    onSearchTextChange: (newSearchText: string) => void;
    columnVisibility: Record<string, boolean>;
    toggleColumnVisibility: (column: keyof Patient) => void;
    selected: number[] | string [];
    onStartDateChange: (date: Date | null) => void;
    onEndDateChange: (date: Date | null) => void;
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
};

const ITEM_HEIGHT = 48;
// Компонент Header, принимающий пропсы с типом SideBarProps
const Header: React.FC<HeaderProps> = ({
                                           onSearchTextChange,
                                           searchText,
                                           setSearchText,
                                           columnVisibility,
                                           toggleColumnVisibility,
                                           onStartDateChange,
                                           onEndDateChange,
                                       }) => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selected, setSelected] = useState<number[]>([]);
    const [AnchorElMenu, setAnchorElMenu] = useState<null | HTMLElement>(null);
    const [AnchorElColumnMenu, setAnchorElColumnMenu] = useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(AnchorElMenu);
    const [filter, setFilter] = useState('');
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const initialPatientData: Patient = {
        id: '',
        refType: '',
        firstName: '',
        lastName: '',
        middleName: '',
        dateOfBirth: '',
        snils: '',
        address: '',
        actualAddress: '',
        registrationAddress: '',
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
    const initialFormData: Form = {
        id: '',
        date: '',
        form_name: '',
        inst_name: '',
        profile_name: '',
        route: '',
        vmp_group: '',
        disabled_cat: 0,
        need_cat: 0,
        payment_cat: 0,
        signature: 0,
        date_of_hosp: new Date(),
        mkb_10: 0,
        char_of_disease: 0,
        patient_model: '',
        disability: 0,
        patient_id: ''
        // Другие начальные значения, если необходимы
    };
    console.log("column visibility: ", columnVisibility);
    const handleDeleteSelected = () => {
        setPatients(currentPatients =>
            currentPatients.filter(patient => !selected.includes(patient.id)));
        setSelected([]);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };
    const handleSave = async (patientData: Patient) => {
        try {
            // Проверяем, существует ли уже ID пациента для обновления или нет
            if (patientData.id) {
                // Обновляем существующего пациента
                await axios.put(`http://localhost:8080/api/patients/${patientData.id}`, patientData);
            } else {
                // Создаём нового пациента
                await axios.post('http://localhost:8080/api/patients', patientData);
            }
            console.log("Пациент сохранён или обновлён:", patientData);
            // Здесь можно добавить дополнительные действия после успешного сохранения
        } catch (error) {
            console.error('Ошибка при сохранении данных пациента', error);
            // Обработка ошибок при сохранении
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        console.log("Menu anchor element", event.currentTarget);
        setIsOpen(prevIsOpen => !prevIsOpen);
        setAnchorElMenu(event.currentTarget);
    };
    const handleColumnMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        console.log("Menu anchor element", event.currentTarget);
        setAnchorElColumnMenu(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorElMenu(null);
        setIsOpen(false);
    };
    const handleCloseColumnMenu = () => {
        setAnchorElColumnMenu(null);
    };

    const filterByDocumentType = (type: string) => {
        setFilter(type);
    };
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newText = event.target.value;
        setSearchText(newText);
        onSearchTextChange(newText);
    };

    const handleSaveData = async (patientData: Patient, formData: Form) => {
        if (!patientData || !formData) {
            console.error("Нет данных для сохранения");
            return;
        }

        try {
            // Сохранение данных пациента
            let patientResponse;
            if (patientData.id) {
                patientResponse = await axios.put(`http://localhost:8080/api/patients/${patientData.id}`, patientData);
            } else {
                patientResponse = await axios.post('http://localhost:8080/api/patients', patientData);
            }

            // Сохранение данных формы
            let formResponse;
            if (formData.id) {
                formResponse = await axios.put(`http://localhost:8080/api/forms/${formData.id}`, formData);
            } else {
                formResponse = await axios.post('http://localhost:8080/api/forms', formData);
            }

            console.log("Ответ сервера по пациенту:", patientResponse.data);
            console.log("Ответ сервера по форме:", formResponse.data);

            // Закрытие модального окна и обновление интерфейса пользователя
            // setIsModalOpen(false); // Обновите состояние вашего компонента соответствующим образом
            // Обновление интерфейса пользователя

            alert("Данные успешно сохранены.");
            // onClose();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Ошибка при сохранении данных:", error.response?.data);
            } else {
                console.error("Неожиданная ошибка:", error);
            }
        }
    };

    // const isDataValid = (patientData: Patient, formData: Form): boolean => {
    //     // Реализуйте логику проверки данных здесь
    //     // Например, проверка на пустые поля, проверка формата данных и т.д.
    //     return true; // Возвращайте true, если данные валидны
    // };

    const MyCustomToolbar = () => (
        <div className="flex flex-row justify-center items-center ">
            <div className="search-box justify-center items-center">
                <button className="btn-search">
                    <SearchIcon className="text-black "/>
                </button>
                <input
                    type="text"
                    className="input-search"
                    placeholder="Поиск..."
                    value={searchText}
                    onChange={handleSearchTextChange}
                />
            </div>
            <Toolbar sx={{
                position: 'relative',
                direction: 'row-reverse',
                justifyContent: 'flex-end',
                alignItems: 'center',
            }}>
                <div className="fill-button"
                >
                    <button onClick={handleOpenModal} className="btn btn-small">Создать</button>
                </div>

                {/* Иконка настроек столбцов */}
                <IconButton
                    aria-label="Настройки столбцов"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleColumnMenuOpen}
                    color="inherit"
                >
                    <ViewWeekIcon/>
                </IconButton>

                {/* Меню выбора столбцов */}
                <Menu
                    anchorEl={AnchorElColumnMenu}
                    open={Boolean(AnchorElColumnMenu)}
                    onClose={handleCloseColumnMenu}
                    sx = {{
                            '.MuiPaper-root': {
                                // borderColor: 'black',
                                borderWidth: '2px',
                                borderStyle: 'solid',
                                borderRadius: 0,
                                boxShadow: '-3px 3px 2px 1px deepskyblue',
                                boxShadowColor: 'deepskyblue',
                                // (0, 0, 255, .2)
                            },
                        '&: hover': {
                            color: 'deepskyblue',
                            transitionDuration: '400ms',
                        },
                        }}
                >
                    {Object.keys(columnVisibility).map((column) => (
                        <MenuItem key={column}
                                  onClick={() => toggleColumnVisibility(column as keyof Patient)}
                                  sx={{
                                      marginY: '1px',
                                      paddingY: '1px',
                                      padding: 1,
                        }} // Уменьшаем вертикальные отступы
                        >
                            <Checkbox
                                checked={columnVisibility[column as keyof Patient]}/>
                            <ListItemText
                                primary={columnNames[column as keyof ColumnTranslations] || column}/>
                        </MenuItem>
                    ))}
                </Menu>
            </Toolbar>
        </div>
    );

    return (
        <>
            <div className="flex flex-row justify-start m-3.5 mb-0 border-0 border-b-2 bg-white border-gray-200">
                <Toolbar sx={{
                    position: 'relative',
                    direction: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                }}>
                    <button
                        className={`menu ${isOpen ? 'opened' : ''}`}
                        onClick={handleMenuOpen}
                        aria-expanded={isMenuOpen}
                        aria-label="Main Menu"
                    >
                        <svg width="50" height="50" viewBox="0 0 100 100">
                            <path className="line line1"
                                  d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058"/>
                            <path className="line line2" d="M 20,50 H 80"/>
                            <path className="line line3"
                                  d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942"/>
                        </svg>
                    </button>
                    {/* Иконка удаления */}
                    <IconButton onClick={handleDeleteSelected}
                                disabled={selected.length === 0}
                        // color="inherit"

                                sx={{
                                    padding: '2px',
                                    paddingTop: '12px',
                                    marginLeft: '12px',
                                    alignItems: 'center',
                                    position: 'relative',
                                    '&:hover': {
                                        color: 'deepskyblue', // Цвет при наведении
                                    }
                                }}>
                        <DeleteForeverOutlinedIcon/>
                    </IconButton>

                    <DateFilter onStartDateChange={onStartDateChange} onEndDateChange={onEndDateChange} />

                    <Menu
                        id="long-menu"
                        anchorEl={AnchorElMenu}
                        open={Boolean(AnchorElMenu)}
                        onClose={handleCloseMenu}
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        sx = {{
                            '.MuiPaper-root': {
                                // borderColor: 'black',
                                borderWidth: '2px',
                                borderStyle: 'solid',
                                borderRadius: 0,
                                boxShadow: '12px 12px 2px 1px rgba(57, 20, 176, .5)',
                            // (0, 0, 255, .2)
                            },

                        }}
                    >
                        <MenuItem onClick={handleCloseMenu}>
                            <button onClick={() => filterByDocumentType('Направления')}
                                    className="btn btn-menu">
                                Направления
                            </button>
                        </MenuItem>

                        <MenuItem onClick={handleCloseMenu}>
                            <button
                                className="btn btn-menu"
                                onClick={() => filterByDocumentType('Протоколы')}>
                                Протоколы
                            </button>
                        </MenuItem>
                        <MenuItem onClick={handleCloseMenu}>
                            <button
                                className="btn btn-menu"
                                onClick={() => filterByDocumentType('Талоны')}
                            >Талоны
                            </button>
                        </MenuItem>
                        <MenuItem onClick={handleCloseMenu}>
                            <button
                                className="btn btn-menu"
                                onClick={() => filterByDocumentType('')}
                            >Пациенты
                            </button>
                        </MenuItem>
                    </Menu>
                </Toolbar>

                <Grid container sx={{
                    position: 'relative',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                }}>
                    {MyCustomToolbar()}
                </Grid>
                {
                    isModalOpen && (
                        <FormModal
                            show={isModalOpen}
                            onClose={handleCloseModal}
                            onSave={handleSave}
                            onSaveData={handleSaveData} // Добавлено здесь
                            patient={initialPatientData}
                            form={initialFormData} // Передача начальных данных для формы
                        />
                    )
                }
            </div>
        </>
    );
};

export default Header;