import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Modal,
    IconButton,
    TextField,
    Toolbar,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Collapse,
    Checkbox,
    Menu,
    MenuItem,
    ListItemText,
    TableSortLabel
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import {Patient} from "../Patient/Patient";
import TablePagination from "@mui/material/TablePagination";
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import {styled} from "@mui/material/styles";
import MoreVertIcon from '@mui/icons-material/MoreVert';

// interface ColumnVisibility {
//     [key: string]: boolean;
// }
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
const NewPatientsTable = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [searchText, setSearchText] = useState('');
    const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>({});
    const [orderBy, setOrderBy] = useState<keyof Patient>('id');
    const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');
    const [selected, setSelected] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [AnchorElFirst, setAnchorElFirst] = useState<null | HTMLElement>(null);
    const [AnchorElSecond, setAnchorElSecond] = useState<null | HTMLElement>(null);
    const isMenuOpenFirst = Boolean(AnchorElFirst);
    const isMenuOpenSecond = Boolean(AnchorElSecond);
    const [filter, setFilter] = useState('');
    const [searchVisible, setSearchVisible] = useState(false);
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
    const toggleColumnVisibility = (column: keyof Patient) => {
        setColumnVisibility(prev => ({
            ...prev,
            [column]: !prev[column as keyof typeof prev]
        }));
    };
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

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const filteredPatients = patients.filter(patient =>
        patient.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
        patient.last_name.toLowerCase().includes(searchText.toLowerCase())
    );

    const toggleRow = (id: number) => {
        setExpandedRows(prev => ({...prev, [id]: !prev[id]}));
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = filteredPatients.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };
    const handleClickMenu1 = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElFirst(event.currentTarget);
    };
    const handleClickMenu2 = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElSecond(event.currentTarget);
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


    const handleDeleteSelected = () => {
        setPatients(currentPatients =>
            currentPatients.filter(patient => !selected.includes(patient.id)));
        setSelected([]);
    };

    const isSelected = (id: number) => selected.indexOf(id) !== -1;

    const filterByDocumentType = (type: string) => {
        setFilter(type);
    };
    const handleSearchIconClick = () => {
        setSearchVisible(!searchVisible);
    };
    // const AnimatedTextField = styled(TextField)(({theme}) => ({
    //     transition: theme.transitions.create('width', {
    //         easing: theme.transitions.easing.sharp,
    //         duration: theme.transitions.duration.enteringScreen,
    //     }),
    //     width: '0',
    //     '&.expanded': {
    //         width: '200px', // Можно изменить на желаемую ширину
    //     },
    // }));
    const searchFieldStyles = {
        transition: 'opacity 0.5s, visibility 0.5s',
        opacity: searchVisible ? 1 : 0,
        visibility: searchVisible ? 'visible' : 'hidden',
        marginRight: 2
    };
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

    // const sortedPatients = patients.sort(getComparator(orderDirection, orderBy));

    const sortedAndFilteredPatients = React.useMemo(() => {
        return filteredPatients.sort(getComparator(orderDirection, orderBy));
    }, [filteredPatients, orderDirection, orderBy]);



    return (
        <>
            {/*<MyCustomToolbar/>*/}
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
                                               color: '#1565c0',
                                               fontWeight: 'bold',
                                               padding: '1px',
                                               textAlign: 'center',
                                               borderTop: '1px solid rgba(224, 224, 224, 1)',
                                               ...(column === 'id' && { /* Стили для колонки ID */ }),
                                               ...(column === 'first_name' && { /* Стили для колонки Имя */ }),
                                               // '&:hover': {
                                               //     color: '#e91e63 ',
                                               //     fontSize: '1.1 rem'
                                               // }
                                           }}
                                >
                                    <TableSortLabel
                                        sx={{
                                            '&: hover': {
                                                color: '#e91e63',
                                                transitionDuration: '400ms',
                                            },
                                            '&.Mui-active .MuiTableSortLabel-icon': {
                                                color: '#e91e63',

                                            },
                                            '&.Mui-active': {
                                                color: '#e91e63',
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
                            <TableCell padding="checkbox">
                                <Checkbox checked={isSelected(patient.id)}/>
                            </TableCell>
                            {Object.keys(columnVisibility).map((column) => (
                                columnVisibility[column] && (
                                    <TableCell
                                        key={`${patient.id}-${column}`}
                                        sx={{ padding: '4px' }}
                                    >
                                        {patient[column as keyof Patient]}
                                    </TableCell>
                                )
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
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