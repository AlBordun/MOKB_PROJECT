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
import { shadows } from '@mui/system';
import FormModal from "../FormModal/FormModal";
import EditIcon from '@mui/icons-material/Edit';

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
    handleCopyData: (dataToCopy: any) => void
}

const NewPatientsTable: React.FC<newPatientsTableProps> = ({
                                                               searchText,
                                                               setSearchText,
                                                               columnVisibility,
                                                               startDate,
                                                               endDate,
                                                               handleCopyData
                                                           }) => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [patientForms, setPatientForms] = useState<Record<number | string, Form[]>>({})
    const [orderBy, setOrderBy] = useState<keyof Patient>('id');
    const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');
    const [selected, setSelected] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openRows, setOpenRows] = useState<Record<number, boolean>>({});
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [modalData, setModalData] = useState<Form | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        console.log("column visibility in patients", columnVisibility);
    }, [columnVisibility]);

    useEffect(() => {
        const queryParams = new URLSearchParams();
        if(startDate) queryParams.append("startDate", startDate.toISOString());
        if(endDate) queryParams.append("endDate", endDate.toISOString());
        axios.get(`http://localhost:8080/api/patients/find_all?${queryParams.toString()}`)
            .then(response => {
                console.log(response.data);
                setPatients(response.data.map((patient: Patient) => patient));
            })
            .catch(error => console.error('Ошибка при загрузке данных:', error));
        console.log("Загрузка данных для диапозона дат",startDate,endDate)
    }, [startDate,endDate]);

    const fetchPatientForm = async (patient_id: number | string) => {
        try {
            const response = await axios.get<Form[]>(`http://localhost:8080/api/patients/${patient_id}/forms`);
            setPatientForms(prev => ({...prev, [patient_id]: response.data}));
        } catch (error) {
            console.error('error forming data', error);
        }
    }


    const handleRowClick = (event: React.MouseEvent<unknown>, patient: Patient) => {
        event.stopPropagation(); // Предотвратить всплытие события
        setSelectedPatient(patient); // Установка выбранного пациента
        setIsModalOpen(true);
    };


console.log("SetSelected:", setSelectedPatient)
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
        const idField = patient.id ? patient.id.toString() : '';
        const lastNameField = patient.last_name;
        const firstNameField = patient.first_name;
        const middleNameField = patient.middle_name;
        const dateOfBirth = patient.date_of_birth;
        const genderField = patient.gender;
        const populationCategoryField = patient.population_category;
        const passportSeriesField = patient.passport_series;
        const passportNumberField = patient.passport_number;
        const registrationAddressField = patient.registration_address;
        const actualAddressField = patient.actual_address;
        const snilsField = patient.snils;
        const insurancePolicyField = patient.insurance_policy;
        return (
            filterField(idField, searchText) ||
            filterField(lastNameField, searchText) ||
            filterField(firstNameField, searchText) ||
            filterField(middleNameField, searchText) ||
            filterField(dateOfBirth, searchText) ||
            filterField(genderField, searchText) ||
            filterField(populationCategoryField, searchText) ||
            filterField(passportSeriesField, searchText) ||
            filterField(passportNumberField, searchText) ||
            filterField(registrationAddressField, searchText) ||
            filterField(actualAddressField, searchText) ||
            filterField(snilsField, searchText) ||
            filterField(insurancePolicyField, searchText)
        );
    });


    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = filteredPatients.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        event.stopPropagation();
        const selectedIndex = selected.indexOf(id);

        let newSelected: number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

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

    const handlePatientUpdate = (updatedPatientData: Patient) => {
        setPatients(patients.map(patient =>
            patient.id === updatedPatientData.id ? updatedPatientData : patient
        ));
        setSelectedPatient(null); // Закрытие модального окна
    };

    const handleSaveUpdatedPatient = async (updatedPatientData: Patient) => {
        try {
            await updatePatientAPI(updatedPatientData);
            handlePatientUpdate(updatedPatientData);
            // Дополнительные действия после успешного обновления (например, закрытие модального окна)
        } catch (error) {
            console.error('Ошибка при обновлении данных пациента:', error);
            // Обработка ошибок (например, отображение сообщения об ошибке пользователю)
        }
    };

// Примерная функция API для обновления данных пациента
    async function updatePatientAPI(patientData: Patient) {
        // Здесь будет код для отправки запроса на сервер, например:
        // return axios.put(`/api/patients/${patientData.id}`, patientData);
    }

    const toggleRowDetails = (event: React.MouseEvent<unknown>, patient_id: number | string | any) => {
        event.stopPropagation();
        if(openRows[patient_id]) {
            fetchPatientForm(patient_id);
        }
        setOpenRows(prev => ({...prev, [patient_id]: !prev[patient_id]}))
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
        setIsEditing(true); // Установка флага редактирования в true
    }

    return (
        <>

            <div style={{overflowX: 'auto', margin: '0 15px',backgroundColor: 'white'}}>
                <Table sx = {{
                    border: 2 ,
                    borderColor: 'black',
                }}>
                    <TableHead >
                        <TableRow>
                            <TableCell padding="checkbox"
                                       sx={{
                                ...cellStyle,
                                backgroundColor: 'whitesmoke'
                            }}>
                                <Checkbox
                                    sx={{
                                        ...cellStyle
                                    }}
                                    indeterminate={selected.length > 0 && selected.length < filteredPatients.length}
                                    checked={filteredPatients.length > 0 && selected.length === filteredPatients.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>
                            <TableCell sx={{
                                padding: '2px',
                                backgroundColor: 'whitesmoke',
                                ...cellStyle
                            }}/>
                            {Object.keys(columnVisibility).map((column) => (
                                columnVisibility[column] && (
                                    <TableCell
                                        key={column}
                                        sx={{
                                            ...cellStyle,
                                            // borderRight: '1px solid rgba(0,0,0,0.12)',
                                            backgroundColor: "whitesmoke",
                                            color: 'black',
                                            fontWeight: 'bold',
                                            // width: '30px',
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
                                                    color: 'red',
                                                    transitionDuration: '400ms',
                                                },
                                                '&.Mui-active .MuiTableSortLabel-icon': {
                                                    color: 'red',

                                                },
                                                '&.Mui-active': {
                                                    color: 'red',
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
                    <TableBody>
                        {sortedAndFilteredPatients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((patient) => (
                            <React.Fragment key={patient.id}>
                                {/*<TableCell>*/}
                                {/*    <button onClick={() => handleEditClick(patient)}>Редактировать</button>*/}
                                {/*</TableCell>*/}
                                <TableRow
                                    sx={{...cellStyle}}
                                    // onClick={(event) => handleRowClick(event, patient)} // Добавлен обработчик клика
                                    role="checkbox"
                                    aria-checked={isSelected(patient.id)}
                                    selected={isSelected(patient.id)}
                                >
                                    {/* Отрисовка чекбокса для строки */}
                                    <TableCell padding="checkbox"
                                               onClick={(event) => handleClick(event, patient.id)}
                                               sx={{
                                        ...cellStyle
                                    }}>

                                        <Checkbox checked={isSelected(patient.id)}
                                                  sx={{
                                                      ...cellStyle,
                                                  }}/>
                                        <IconButton onClick={() => handleEditClick(patient)}>
                                            <EditIcon />
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
                                                    '&:hover': {backgroundColor: 'rgba(0,0,0, 0.2)'},
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
                                                {patient[column as keyof Patient]}
                                            </TableCell>
                                        ) : null
                                    ))}

                                </TableRow>
                                {/* Раскрывающейся таблица */}
                                <TableRow>
                                    <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={6}>
                                        <Collapse in={openRows[patient.id]} timeout="auto" unmountOnExit
                                        >
                                            <Box margin={1}>
                                                <Typography variant="h6" gutterBottom component="div">
                                                   Документы
                                                </Typography>
                                                <Table size="small" aria-label="Buttons for forms"
                                                >
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
                                                                    <Button
                                                                        variant="outlined"
                                                                        onClick={() => handleOpenModal(form, patient)}
                                                                    >
                                                                        {form.form_name}
                                                                    </Button>
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
                    borderColor: 'black',
                    margin: '15px',
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
                onSave={handleSaveUpdatedPatient}
                patient={selectedPatient}
                // copyData={handleCopyData}
             />
        </>
    );
};

export default NewPatientsTable;