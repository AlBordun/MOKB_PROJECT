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

// interface ColumnVisibility {
//     [key: string]: boolean;
// }
interface ColumnTranslations {
    [key: string]: string;
}
const columnNames:{ [key: string]: string } = {
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

const NewPatientsTable = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [searchText, setSearchText] = useState('');
    const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>({});
    const [orderBy, setOrderBy] = useState<keyof Patient>('id');
    const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
    const [selected, setSelected] = useState<number[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
    const isMenuOpen = Boolean(menuAnchorEl);
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
    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        console.log(event.currentTarget);
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
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
    const AnimatedTextField = styled(TextField)(({ theme }) => ({
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        width: '0',
        '&.expanded': {
            width: '200px', // Можно изменить на желаемую ширину
        },
    }));
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
    const sortedPatients = patients.sort(getComparator(orderDirection, orderBy));

    const sortedAndFilteredPatients = React.useMemo(() => {
        return filteredPatients.sort(getComparator(orderDirection, orderBy));
    }, [filteredPatients, orderDirection, orderBy]);
    const MyCustomToolbar = () => (

        <Toolbar>
            <Box sx={{display: 'flex', flexGrow: 1,}}>
                <Button
                    variant="outlined"
                    size="small"
                    sx={{
                        mr: 1,
                        color: 'darkcyan',
                        borderColor: 'darkcyan',
                        borderRadius: '16px',
                        '&:hover': {
                            backgroundColor: 'darkcyan', // Цвет фона при наведении
                            color: 'white', // Цвет текста при наведении
                            borderColor: 'darkcyan'
                        }
                    }}
                    onClick={() => filterByDocumentType('Направления')}
                >
                    Направления
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    sx={{
                        mr: 1,
                        color: '#2196f3',
                        borderColor: '#2196f3',
                        borderRadius: '16px',
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
                <Button
                    variant="outlined"
                    size="small"
                    sx={{
                        mr: 1,
                        color: '#e91e63',
                        borderColor: '#e91e63',
                        borderRadius: '16px',
                        '&:hover': {
                            backgroundColor: '#e91e63', // Цвет фона при наведении
                            color: 'white', // Цвет текста при наведении
                            borderColor: '#e91e63'
                        }
                    }}
                    onClick={() => filterByDocumentType('Талоны')}
                >
                    Талоны
                </Button>
                <Button
                    variant="outlined"
                    size="small"
                    sx={{
                        color: 'black',
                        borderColor: 'black',
                        borderRadius: '16px',
                        '&:hover': {
                            backgroundColor: 'black', // Цвет фона при наведении
                            color: 'white', // Цвет текста при наведении
                            borderColor: 'black'
                        }
                    }}
                    onClick={() => filterByDocumentType('')}
                >
                    Пациенты
                </Button>
            </Box>

            {/* Иконка и строка поиска */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    id="standard-basic"
                    label="Search"
                    variant="standard"
                    value={searchText}
                    onChange={handleSearchChange}
                    sx={searchFieldStyles}
                />
                <IconButton onClick={handleSearchIconClick} color="inherit">
                    <SearchIcon />
                </IconButton>
            </Box>

            {/* Иконка настроек столбцов */}
            <IconButton
                aria-label="Настройки столбцов"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
            >
                <ViewWeekIcon />
            </IconButton>

            {/* Иконка удаления */}
            <IconButton onClick={handleDeleteSelected} disabled={selected.length === 0} color="inherit">
                <DeleteIcon/>
            </IconButton>

            {/* Меню выбора столбцов */}
            <Menu
                anchorEl={menuAnchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
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
                              sx={{ marginY: '1px', paddingY: '1px' }} // Уменьшаем вертикальные отступы
                    >

                        <Checkbox
                            checked={columnVisibility[column as keyof Patient]} />
                        <ListItemText
                            primary={columnNames[column as keyof ColumnTranslations] || column} />
                    </MenuItem>
                ))}
            </Menu>
        </Toolbar>
    );


    return (
        <>
            <MyCustomToolbar />
            <Table>
                <TableHead>
                    <TableRow>
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
                                    style={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}>
                                    <TableSortLabel
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
                            hover
                            onClick={(event) => handleClick(event, patient.id)}
                            role="checkbox"
                            aria-checked={isSelected(patient.id)}
                            selected={isSelected(patient.id)}
                        >
                            <TableCell padding="checkbox">
                                <Checkbox checked={isSelected(patient.id)} />
                            </TableCell>
                            {Object.keys(columnVisibility).map((column) => (
                                columnVisibility[column] && (
                                    <TableCell key={`${patient.id}-${column}`}>
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