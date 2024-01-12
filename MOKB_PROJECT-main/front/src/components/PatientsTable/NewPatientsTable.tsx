import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Checkbox,
    TableSortLabel, IconButton, Collapse, Box, Button, Typography
} from '@mui/material';
import {Patient} from "../DataInterfaces/Patient";
import TablePagination from "@mui/material/TablePagination";
import {Form} from "../DataInterfaces/Form";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import {shadows} from '@mui/system';
import FormModal from "../FormModal/FormModal";
import EditIcon from '@mui/icons-material/Edit';
import {grey200} from "material-ui/styles/colors";
import {grey} from "@mui/material/colors";
import {deleteForms} from "../utils/DeleteService";

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

interface newPatientsTableProps {
    searchText: string,
    setSearchText: (text: string) => void,
    columnVisibility: Record<string, boolean>,
    selected: number[] | string [],
    setSelected: React.Dispatch<React.SetStateAction<number[]>>,
    startDate: Date | null,
    endDate: Date | null,
    handleCopyData: (dataToCopy: any) => void,
    patients: Patient[],
    setSelectedPatients: React.Dispatch<React.SetStateAction<number[]>>,
    selectedForms: { [patientId: number]: number[] },
    selectedPatients: number[],
    setSelectedForms: React.Dispatch<React.SetStateAction<{ [patientId: number]: number[] }>>,
    onFormsDeleted: () => void,
    handleSelectAllClick: (selectedIds: number[]) => void;
    refreshPatientsList?: () => Promise<void>;
    updatePatients: (newPatients: Patient[]) => void;
}

const genderDictionary: { [key: number]: string } = {
    1: "Женщина",
    2: "Мужчина",
};

const categoryDictionary: { [key: number]: string } = {
    1: "Взрослый",
    2: "Ребенок",
};

const documentTypeDictionary: { [key: number]: string } = {
    1: "Паспорт",
}

const NewPatientsTable: React.FC<newPatientsTableProps> = ({
                                                               searchText,
                                                               setSearchText,
                                                               columnVisibility,
                                                               startDate,
                                                               endDate,
                                                               handleCopyData,
                                                               selectedForms,
                                                               onFormsDeleted,
                                                               setSelectedPatients,
                                                               refreshPatientsList,
                                                               patients,
                                                               updatePatients
                                                           }) => {
    // const [patients, setPatients] = useState<Patient[]>([]);
    const [patientForms, setPatientForms] = useState<Record<number | string, Form[]>>({})
    const [orderBy, setOrderBy] = useState<keyof Patient>('id');
    const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');
    const [selected, setSelected] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openRows, setOpenRows] = useState<Record<number, boolean>>({});
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [formData, setFormData] = useState<Form | null>(null);
    const [selectedForm, setSelectedForm] = useState<Form | null>(null);
    const [selectedPatients, setSelectedPatientsLocal] = useState<number[]>([]);
    const [modalData, setModalData] = useState<Form | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formNames, setFormNames] = useState<string[]>([]);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [modalForm, setModalForm] = useState<Form | null>(null);
    const [localSelected, setLocalSelected] = useState<number[]>([]);

    useEffect(() => {
        console.log("patients updated in NewPatientsTable", patients);
    }, [patients]);

    useEffect(() => {
        console.log("column visibility in patients", columnVisibility);
    }, [columnVisibility]);

    useEffect(() => {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append("startDate", startDate.toISOString());
        if (endDate) queryParams.append("endDate", endDate.toISOString());
        axios.get(`http://localhost:8080/api/patients/find_all?${queryParams.toString()}`)
            .then(response => {
                console.log(response.data);
                // setPatients(response.data.map((patient: Patient) => patient));
                updatePatients(response.data.map((patient: Patient) => patient));
            })
            .catch(error => console.error('Ошибка при загрузке данных:', error));
        console.log("Загрузка данных для диапозона дат", startDate, endDate)
    }, [startDate, endDate]);


    const fetchPatient = async (patientId: number) => {
        const response = await axios.get(`http://localhost:8080/api/patients/${patientId}`);
        return response.data;
    };

    const fetchForm = async (formId: number) => {
        const response = await axios.get(`http://localhost:8080/api/forms/${formId}`);
        console.log("Forms: ", response.data)
        return response.data;
    };

    const fetchFormByPatientId = async (patientId: number) => {
        try {
        const response = await axios.get(`http://localhost:8080/api/forms/patient/${patientId}`);
        setFormData(response.data);
        console.log("Forms: ", response.data)
        } catch (error) {
            console.error('Ошибка при загрузке данных формы:', error);
        }
    };

    const handleEditDocument = async (patientId: number, formId: number) => {
        try {
            const patientData = await fetchPatient(patientId);
            const formData = await fetchForm(formId);
        } catch (error) {
            console.error('Ошибка при получении данных', error);
        }
    };

    const handleDeleteForms = () => {
        const allSelectedForms = Object.values(selectedForms).flat();

        deleteForms(allSelectedForms)
            .then(onFormsDeleted)
            .catch(error => console.error("Ошибка при удалении форм:", error));
    };

    const handleFormOpenModal = async (form: Form, patient: Patient) => {
        setSelectedPatient(patient); // Установка выбранного пациента
        setSelectedForm(form);
        console.log("Selected form: ", selectedForm)
        console.log("form: ", form)
        setIsModalOpen(true); // Открытие модального окна
        try {
            const response = await axios.get(`http://localhost:8080/api/forms/${form.id}`);
            // Предполагается, что API возвращает данные формы по её ID
            setModalForm(response.data);
            console.log("Data: ", response.data)
        } catch (error) {
            console.error('Ошибка при загрузке данных формы:', error);
        }
    };
    console.log("Selected form: ", selectedForm)
    const handleRowClick = (event: React.MouseEvent<unknown>, patient: Patient) => {
        event.stopPropagation(); // Предотвратить всплытие события
        setSelectedPatient(patient); // Установка выбранного пациента
        setIsModalOpen(true);
    };

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Patient
    ) => {
        const isAsc = orderBy === property && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const filterField = (fieldValue: string | null | undefined, searchText: string): boolean => {
        if (fieldValue !== undefined && fieldValue !== null) {
            const fieldValueLower = fieldValue.toLowerCase();
            const searchLowerCase = searchText.toLowerCase();
            return fieldValueLower.includes(searchLowerCase);
        }
        return false;
    };

    const filteredPatients = patients.filter((patient) => {
        // Проверка даты рождения на соответствие диапазону дат
        let isDateInRange = true;
        if (startDate && endDate) {
            const dob = new Date(patient.date_of_birth);
            isDateInRange = dob >= startDate && dob <= endDate;
        }

        // Логика фильтрации по строке поиска
        const matchesSearch = filterField(patient.id ? patient.id.toString() : '', searchText) ||
            filterField(patient.last_name, searchText) ||
            filterField(patient.first_name, searchText) ||
            filterField(patient.middle_name, searchText) ||
            filterField(patient.gender, searchText) ||
            filterField(patient.population_category, searchText) ||
            filterField(patient.passport_series, searchText) ||
            filterField(patient.passport_number, searchText) ||
            filterField(patient.registration_address, searchText) ||
            filterField(patient.actual_address, searchText) ||
            filterField(patient.snils, searchText) ||
            filterField(patient.insurance_policy, searchText);

        // Пациент включается в финальный список, если он проходит обе проверки
        return isDateInRange && matchesSearch;
    });

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            // Если чекбокс активирован, выбрать все строки
            const newSelectedIds = filteredPatients.map((patient) => patient.id);
            setLocalSelected(newSelectedIds); // Обновление локального состояния в NewPatientsTable
            setSelectedPatients(newSelectedIds); // Обновление состояния в App
        } else {
            // Если чекбокс не активирован, снять выбор со всех строк
            setLocalSelected([]); // Сброс локального состояния в NewPatientsTable
            setSelectedPatients([]); // Сброс состояния в App
        }
    };

    // Синхронизация локального состояния с пропсами
    useEffect(() => {
        setLocalSelected(selectedPatients);
    }, [selectedPatients]);

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        event.stopPropagation();
        const selectedIndex = localSelected.indexOf(id);
        let newSelected: number[] = [];

        if (selectedIndex === -1) {
            newSelected = [...localSelected, id];
        } else {
            newSelected = localSelected.filter(patientId => patientId !== id);
        }

        setLocalSelected(newSelected);
        setSelectedPatients(newSelected); // Обновление состояния в App
    };


    // const handleCheckboxClick = (patientId: number) => {
    //     setSelectedPatient(prevSelected => {
    //         const isSelected = prevSelected.includes(patientId);
    //         if (isSelected) {
    //             return prevSelected.filter(id => id !== patientId);
    //         } else {
    //             return [...prevSelected, patientId];
    //         }
    //     });
    // };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id: number) => selectedPatients.includes(id);

    type Order = 'asc' | 'desc';

    function getComparator(order: Order, orderBy: keyof Patient) {
        return order === 'desc'
            ? (a: Patient, b: Patient) => descendingComparator(a, b, orderBy)
            : (a: Patient, b: Patient) => -descendingComparator(a, b, orderBy);
    }

    function descendingComparator(a: Patient, b: Patient, orderBy: keyof Patient) {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }

    const sortedAndFilteredPatients = React.useMemo(() => {
        return filteredPatients.sort(getComparator(orderDirection, orderBy));
    }, [filteredPatients, orderDirection, orderBy]);

    const handleColumnHover = (columnId: string, isHover: boolean) => {
        const cells = document.querySelectorAll(`.${columnId}`);
        cells.forEach(cell => {
            if (isHover) {
                cell.classList.add('hovered');
            } else {
                cell.classList.remove('hovered');
            }
        });
    };

    // const handlePatientUpdate = (updatedPatientData: Patient) => {
    //     setPatients(patients.map(patient =>
    //         patient.id === updatedPatientData.id ? updatedPatientData : patient
    //     ));
    //     setSelectedPatient(null); // Закрытие модального окна
    // };

    // const handleSaveUpdatedPatient = async (updatedPatientData: Patient) => {
    //     try {
    //         await updatePatientAPI(updatedPatientData);
    //         handlePatientUpdate(updatedPatientData);
    //         // Дополнительные действия после успешного обновления (например, закрытие модального окна)
    //     } catch (error) {
    //         console.error('Ошибка при обновлении данных пациента:', error);
    //         // Обработка ошибок (например, отображение сообщения об ошибке пользователю)
    //     }
    // };

// Примерная функция API для обновления данных пациента
    async function updatePatientAPI(patientData: Patient) {
        // Здесь будет код для отправки запроса на сервер, например:
        // return axios.put(`/api/patients/${patientData.id}`, patientData);
    }

    const fetchPatientForms = async (patientId: number): Promise<Form[]> => {
        try {
            const response = await axios.get(`http://localhost:8080/api/forms/patient/{patientId}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке документов:', error);
            return [];
        }
    };

    // const toggleRowDetails = (event: React.MouseEvent<unknown>, patient_id: number | string | any) => {
    //     event.stopPropagation();
    //     if (!openRows[patient_id]) {
    //         fetchPatient(patient_id);
    //     }
    //     setOpenRows((prevOpenRows) => ({...prevOpenRows, [patient_id]: !prevOpenRows[patient_id]}));
    // };

    // const toggleRowDetails = async (event: React.MouseEvent<unknown>, patientId: number) => {
    //     event.stopPropagation();
    //     if (!openRows[patientId]) {
    //         const forms = await fetchPatientForms(patientId);
    //         setPatientForms(prevForms => ({ ...prevForms, [patientId]: forms }));
    //     }
    //     setOpenRows(prevOpenRows => ({ ...prevOpenRows, [patientId]: !prevOpenRows[patientId] }));
    // };

    const toggleRowDetails = async (event: React.MouseEvent<unknown>, patientId: number) => {
        event.stopPropagation();
        if (!openRows[patientId]) {
            try {
                const response = await axios.get(`http://localhost:8080/api/forms/patient/${patientId}`);
                setPatientForms(prevForms => ({ ...prevForms, [patientId]: response.data }));
            } catch (error) {
                console.error('Ошибка при загрузке форм:', error);
                // Обработка ошибок (например, показать сообщение пользователю)
            }
        }
        setOpenRows(prevOpenRows => ({ ...prevOpenRows, [patientId]: !prevOpenRows[patientId] }));
    };

    const handleOpenModal = (form: Form, patient: Patient) => {
        setSelectedPatient(patient); // установка выбранного пациента
        setModalData(form); // предполагая, что у вас есть состояние modalData
        setIsModalOpen(true); // открытие модального окна
    };


    const cellStyle = {

        minWidth: '50px',
        maxWidth: '150px',

    }
    const handleEditClick = (patient: Patient) => {
        setSelectedPatient(patient); // Сохранение выбранного пациента
        fetchFormByPatientId(patient.id); // Загрузка данных формы
        setIsEditing(true); // Установка флага редактирования в true
    }

console.log("Forms :", patientForms)
    return (
        <>

            <div style={{
                overflowX: 'auto', margin: '0 14px',
                // backgroundColor: 'white'
            }}>
                <Table sx={{
                    "& .MuiTableRow-root:hover": {
                        backgroundColor: grey[200],
                    }
                }}>
                    <TableHead sx={{
                        backgroundColor: 'white',
                        borderBottom: 1.5,
                        borderColor: grey[300],
                    }}>
                        <TableRow
                        >
                            <TableCell padding="checkbox"
                                       sx={{
                                           ...cellStyle,
                                       }}>
                                <Checkbox
                                    sx={{
                                        ...cellStyle
                                    }}
                                    indeterminate={localSelected.length > 0 && localSelected.length < filteredPatients.length}
                                    checked={filteredPatients.length > 0 && localSelected.length === filteredPatients.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>
                            <TableCell sx={{
                                ...cellStyle
                            }}/>
                            {Object.keys(columnVisibility).map((column) => (
                                columnVisibility[column] && (

                                    <TableCell
                                        key={column}
                                        sx={{
                                            ...cellStyle,
                                            fontWeight: 'bold',
                                            padding: '3px',
                                            textAlign:
                                                (column === 'first_name'
                                                    || column === 'last_name'
                                                    || column === 'middle_name'
                                                    // || column === 'date_of_birth'
                                                    || column === 'registration_address'
                                                    // || column === 'passport_series'
                                                    // || column === 'passport_number'
                                                    || column === 'actual_address'
                                                    || column === 'registration_address'
                                                )
                                                    ? 'left' : 'center',
                                        }}
                                    >
                                        <TableSortLabel
                                            sx={{
                                                ...cellStyle,
                                                '&: hover': {
                                                    color: 'deepskyblue',
                                                    transitionDuration: '400ms',
                                                },
                                                '&.Mui-active .MuiTableSortLabel-icon': {
                                                    color: 'deepskyblue',

                                                },
                                                '&.Mui-active': {
                                                    color: 'deepskyblue',
                                                    fontSize: '1.5 rem',
                                                }
                                            }}
                                            active={orderBy === column}
                                            direction={orderBy === column ? orderDirection : 'asc'}
                                            onClick={(event) => handleRequestSort(event, column as keyof Patient)}
                                        >
                                            {columnNames[column as keyof typeof columnNames] || column}
                                        </TableSortLabel>
                                    </TableCell>
                                )
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{
                        borderRadius: 3,
                        backgroundColor: 'white',
                        '.MuiTableCell-root': {
                            borderBottom: 0,
                            fontSize: 16,
                            // fontFamily: 'Open'
                        }
                    }}>
                        {sortedAndFilteredPatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((patient) => (
                            <React.Fragment key={patient.id}>
                                <TableRow
                                    sx={{
                                        ...cellStyle,
                                        borderBottom: 2,
                                        borderColor: grey[300],

                                    }}
                                    // onClick={(event) => handleRowClick(event, patient)} // Добавлен обработчик клика
                                    role="checkbox"
                                    aria-checked={isSelected(patient.id)}
                                    key={patient.id}
                                    selected={localSelected.includes(patient.id)}
                                >
                                    {/* Отрисовка чекбокса для строки */}
                                    <TableCell padding="checkbox"
                                        // onClick={(event) => handleClick(event, patient.id)}
                                               sx={{
                                                   ...cellStyle,

                                               }}>

                                        <Checkbox
                                            checked={localSelected.includes(patient.id)}
                                            onClick={(event) => handleClick(event, patient.id)}

                                            sx={{
                                                ...cellStyle,
                                            }}

                                        />
                                        <IconButton onClick={() => handleEditClick(patient)}>
                                            <EditIcon/>
                                        </IconButton>
                                    </TableCell>

                                    <TableCell
                                        sx={{
                                            ...cellStyle,
                                            padding: '2px',

                                        }}>
                                        <IconButton onClick={(event) => toggleRowDetails(event, patient.id)}>
                                            {openRows[patient.id] ? <ExpandLess/> : <ExpandMore/>}
                                        </IconButton>
                                    </TableCell>
                                    {/* Отрисовка данных для каждой видимой колонки */}
                                    {Object.keys(columnVisibility).map((column) => (
                                        columnVisibility[column] ? (
                                            <TableCell

                                                key={`${patient.id}-${column}`}
                                                className={column}
                                                onMouseEnter={() => handleColumnHover(column, true)}
                                                onMouseLeave={() => handleColumnHover(column, false)}
                                                sx={{
                                                    ...cellStyle,
                                                    padding: '4px',
                                                    transition: 'background-color 0.3s',
                                                    '&:hover': {backgroundColor: grey[500]},
                                                    textAlign:
                                                        (column === 'first_name'
                                                            || column === 'last_name'
                                                            || column === 'middle_name'
                                                            || column === 'registration_address'
                                                            // || column === 'passport_series'
                                                            // || column === 'passport_number'
                                                            || column === 'actual_address'
                                                            || column === 'registration_address'
                                                            || column === 'document_type')
                                                            ? 'left' : 'center',
                                                }}
                                            >
                                                {column === 'gender' ?
                                                    genderDictionary[Number(patient.gender)] || patient.gender :
                                                    column === 'population_category' ?
                                                        categoryDictionary[Number(patient.population_category)] || patient.population_category :
                                                        column === 'document_type' ?
                                                            documentTypeDictionary[Number(patient.document_type)] || patient.document_type :
                                                            patient[column as keyof typeof patient]}
                                            </TableCell>
                                        ) : null
                                    ))}

                                </TableRow>
                                {/* Раскрывающейся таблица */}
                                <TableRow>
                                    <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                                        <Collapse in={openRows[patient.id]} timeout="auto" unmountOnExit>
                                            <Box margin={1}>
                                                {/* Содержимое раскрывающейся строки */}
                                                <Typography variant="h6" gutterBottom component="div">
                                                    Документы
                                                </Typography>
                                                <Table size="small" aria-label="Документы">
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>Название</TableCell>
                                                            <TableCell>Дата</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {patientForms[patient.id]?.map((form) => (
                                                            <TableRow key={form.id}>
                                                                <TableCell>
                                                                    {String(form.form_name) === '1' && (
                                                                        <Button variant="outlined"
                                                                                onClick={() => handleFormOpenModal(form, patient)}>
                                                                            Направление
                                                                        </Button>
                                                                    )}
                                                                    {String(form.form_name) === '2' && (
                                                                        <Button variant="outlined"
                                                                                onClick={() => handleFormOpenModal(form, patient)}>
                                                                            Протокол
                                                                        </Button>
                                                                    )}
                                                                    {String(form.form_name) === '3' && (
                                                                        <Button variant="outlined"
                                                                                onClick={() => handleFormOpenModal(form, patient)}>
                                                                            Талон
                                                                        </Button>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>{form.date}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <TablePagination
                sx={{
                    border: 2,
                    borderColor: grey[300],
                    margin: '14px',
                    backgroundColor: 'white'

                }}
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={filteredPatients.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <FormModal
                show={Boolean(selectedPatient)}
                onClose={() => setSelectedPatient(null)}
                // onSave={handleSaveUpdatedPatient}
                refreshPatientsList={refreshPatientsList}
                patient={selectedPatient}
                form={selectedForm}
                // copyData={handleCopyData}
            />
        </>
    );
};

export default NewPatientsTable;