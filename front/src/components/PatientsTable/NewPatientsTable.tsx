import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Checkbox,
    TableSortLabel
} from '@mui/material';
import {Patient} from "../Patient/Patient";
import TablePagination from "@mui/material/TablePagination";

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
const NewPatientsTable = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [searchText, setSearchText] = useState('');
    const [orderBy, setOrderBy] = useState<keyof Patient>('id');
    const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');
    const [selected, setSelected] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

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

    useEffect(() => {
        axios.get('http://localhost:8080/api/patients/find_all')
            .then(response => {
                setPatients(response.data.map((patient: Patient) => patient));
            })
            .catch(error => console.error('Ошибка при загрузке данных:', error));
    }, []);


    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Patient
    ) => {
        const isAsc = orderBy === property && orderDirection === 'asc';
        setOrderDirection(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const filteredPatients = patients.filter(patient =>
        patient.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
        patient.last_name.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = filteredPatients.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
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


    return (
        <>
            <div style={{overflowX: 'auto'}}>
                <Table>
                    <TableHead
                    >
                        <TableRow
                        >
                            <TableCell padding="checkbox">
                                <Checkbox
                                    indeterminate={selected.length > 0 && selected.length < filteredPatients.length}
                                    checked={filteredPatients.length > 0 && selected.length === filteredPatients.length}
                                    onChange={handleSelectAllClick}
                                />
                            </TableCell>
                            {Object.keys(columnVisibility).map((column) => (
                                columnVisibility[column] && (
                                    <TableCell
                                        key={column}

                                        sx={{
                                            backgroundColor: "whitesmoke",
                                            color: 'black',
                                            fontWeight: 'bold',
                                            width: '30px',
                                            padding: '2px',
                                            textAlign:
                                                (column === 'first_name'
                                                    || column === 'last_name'
                                                    || column === 'middle_name'
                                                    || column === 'date_of_birth'
                                                    || column === 'registration_address'
                                                    || column === 'passport_series'
                                                    || column === 'passport_number'
                                                    || column === 'actual_address'
                                                    || column === 'registration_address')
                                                    ? 'left' : 'center',

                                            borderTop: '1px solid rgba(224, 224, 224, 1)',
                                        }}
                                    >
                                        <TableSortLabel
                                            sx={{
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
                            <TableRow
                                key={patient.id}
                                // hover
                                sx={{
                                    height: '25px',
                                }}
                                onClick={(event) => handleClick(event, patient.id)}
                                role="checkbox"
                                aria-checked={isSelected(patient.id)}
                                selected={isSelected(patient.id)}
                            >
                                <TableCell padding="checkbox"
                                sx = {{
                                    backgroundColor: "whitesmoke",
                                    '&: hover': {
                                        color: 'red',
                                        transitionDuration: '400ms',
                                    },
                                }}
                                >
                                    <Checkbox checked={isSelected(patient.id)}/>
                                </TableCell>
                                {Object.keys(columnVisibility).map((column) => (
                                    columnVisibility[column] && (
                                        <TableCell
                                            key={`${patient.id}-${column}`}
                                            className={column}
                                            onMouseEnter={()=> handleColumnHover(column,true)}
                                            onMouseLeave={()=> handleColumnHover(column,false)}
                                            sx={{
                                                padding: '4px',
                                                transition: 'background-color 0.3s',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(0,0,0, 0.2)'
                                                },
                                                textAlign:
                                                    (column === 'first_name'
                                                        || column === 'last_name'
                                                        || column === 'middle_name'
                                                        || column === 'date_of_birth'
                                                        || column === 'registration_address'
                                                        || column === 'passport_series'
                                                        || column === 'passport_number'
                                                        || column === 'actual_address'
                                                        || column === 'registration_address'
                                                        || column === 'document_type')
                                                        ? 'left' : 'center',
                                            }}
                                        >
                                            {patient[column as keyof Patient]}
                                        </TableCell>
                                    )
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                component="div"
                count={filteredPatients.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </>
    );
};

export default NewPatientsTable;