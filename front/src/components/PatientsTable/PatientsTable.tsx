import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
    IconButton, Box, Typography, Modal, Pagination, LinearProgress, TextField, Toolbar, Button, Grid, Collapse
} from '@mui/material';
import {styled} from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbar,
} from '@mui/x-data-grid';
import {Patient} from "../Patient/Patient";
import {createTheme, ThemeProvider} from "@mui/system";
import {GridRowParams} from "@mui/x-data-grid-pro";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const StyledGridOverlay = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& .ant-empty-img-1': {
        fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
    },
    '& .ant-empty-img-2': {
        fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
    },
    '& .ant-empty-img-3': {
        fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
    },
    '& .ant-empty-img-4': {
        fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
    },
    '& .ant-empty-img-5': {
        fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
        fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
    },
}));

const theme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                columnHeader: {
                    backgroundColor: 'blue', // Указываем цвет фона
                    color: 'white', // Указываем цвет текста
                    // Дополнительные стили...
                },
            },
        },
    },
});


const PatientsTable = () => {
    const [searchText, setSearchText] = useState('');
    const [open, setOpen] = React.useState(false);
    const [selectedRow, setSelectedRow] = React.useState<any>(null);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [filter, setFilter] = useState('');
    const [expandedRows, setExpandedRows] = useState<{ [key: number]: boolean }>({});
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(5);
    console.log(pageSize)

    useEffect(() => {
        axios.get('http://localhost:8080/api/patients/find_all')
            .then(response => {
                const responseData: Patient[] = response.data;
                console.log(response.data);
                setPatients(responseData.map(patient => createData(patient)));
            })
            .catch(error => console.error('Ошибка при загрузке данных:', error));

    }, []);

    const columns: GridColDef[] = [
        // {
        //     field: 'expand',
        //     headerName: 'Раскрыть',
        //     renderCell: (params: GridRenderCellParams) => (
        //         <div>
        //             <IconButton onClick={() => toggleRow(params.row.id)}>
        //                 {expandedRows[params.row.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        //             </IconButton>
        //             <Collapse in={expandedRows[params.row.id]} timeout="auto" unmountOnExit>
        //                 <YourCustomComponent data={params.row} />
        //             </Collapse>
        //         </div>
        //     ),
        //     width: 80,
        //     sortable: false,
        // },
        {
            field: 'expand',
            headerName: 'Раскрыть',
            renderCell: (params: GridRenderCellParams) => (
                <IconButton onClick={() => toggleRow(params.row.id)}>
                    {expandedRows[params.row.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            ),
            width: 80,
            sortable: false,
        },
        {field: 'id', headerName: 'ID', width: 80, align: "left"},
        {field: 'first_name', headerName: 'Имя', width: 100},
        {field: 'last_name', headerName: 'Фамилия', width: 120},
        {field: 'middle_name', headerName: 'Отчество', width: 120},
        {field: 'date_of_birth', headerName: 'Дата рождения', width: 120},
        {field: 'gender', headerName: 'Пол ', width: 100, align: "left"},
        {field: 'population_category', headerName: 'Категория', width: 100},
        {field: 'document_type', headerName: 'Документ', width: 100},
        {field: 'passport_series', headerName: 'Серия паспорта', width: 120, align: "center"},
        {field: 'passport_number', headerName: 'Номер паспорта', width: 150, align: "center"},
        {field: 'registration_address', headerName: 'Место прописки', width: 180},
        {field: 'actual_address', headerName: 'Место жительства', width: 180},
        {field: 'snils', headerName: 'Снилс', width: 150,},
        {field: 'insurance_policy', headerName: 'Полис', width: 150},

    ]
    // const YourCustomComponent = ({ data: Patient }) => {
    //     return (
    //         <Box p={2} bgcolor="#f5f5f5" boxShadow={1}>
    //             <Typography variant="h6">Детали Пациента</Typography>
    //             <Typography>Имя: {data.first_name}</Typography>
    //             <Typography>Фамилия: {data.last_name}</Typography>
    //             {/* Добавьте здесь другие поля, если это необходимо */}
    //         </Box>
    //     );
    // };
    function createData(patient: Patient): Patient {
        return patient;
    }

    const handleOpen = (row: any) => {
        setSelectedRow(row);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    // Функция для обновления состояния поискового запроса
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const handlePageSizeChange = (params: any) => {

        setPageSize(params.pageSize);
    };

    const handlePageChange = (params: any) => {
        setPage(params.page);
    };

    const filterByDocumentType = (type: string) => {
        setFilter(type);
    };

    // Фильтрация данных на основе поискового запроса
    const filteredRows = patients.filter((patient) => {
        return (filter ? patient.document_type === filter : true) &&
            patient.first_name.toLowerCase().includes(searchText.toLowerCase());
    });
    const toggleRow = (rowId: number) => {
        setExpandedRows(prevExpandedRows => ({
            ...prevExpandedRows,
            [rowId]: !prevExpandedRows[rowId]
        }));
    };
    const handleRowClick = (params: GridRowParams) => {
        setSelectedRow(params.row);
        setOpen(true);
    };
    const MyCustomToolbar = () => (
        <Toolbar>
            <Box sx={{ display: 'flex', flexGrow: 1 , }}>
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
                    sx={{ mr: 1,
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

            <Box
                component="form"
                sx={{
                    '& > :not(style)': {m: 1, width: '25ch'},
                    display: 'flex',
                    justifyContent: 'flex-end',
                    ml: 'auto'
                }}
                noValidate
                autoComplete="off"
            >
                <TextField
                    id="standard-basic"
                    label="Search"
                    variant="standard"
                    value={searchText}
                    onChange={handleSearchChange}
                />
            </Box>
        </Toolbar>
    );

    console.log(pageSize)
    return (
        <>
            <MyCustomToolbar/>
            <div style={{ height: '100%', width: '100%' }}>
            {filteredRows.length > 0 ? (
                <DataGrid
                    sx={{
                        '.MuiDataGrid-columnHeader': {
                            color: '#1565c0',
                        },
                    }}
                    // pageSize = {pageSize}
                    // pagination
                    // paginationMode="server"
                    // page={page}
                    // onPageChange={handlePageChange}
                    // onPageSizeChange={handlePageSizeChange}
                    rows={filteredRows}
                    columns={columns}
                    onRowClick={handleRowClick}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25, 50, 100, 500]}
                    checkboxSelection

                />
            ) : (
                <div>Нет пациентов с типом документа: {filter}</div>
            )}
            </div>
            {/*<div style={{height: '400', width: '100%'}}>*/}
                {/*{filteredRows.length > 0 ? (*/}
                {/*<DataGrid*/}
                {/*    sx={{*/}
                {/*        '.MuiDataGrid-columnHeader': {*/}
                {/*            color: '#1565c0',*/}
                {/*        },*/}
                {/*    }}*/}
                {/*    rows={filteredRows}*/}
                {/*    columns={columns}*/}
                {/*    pageSize = {pageSize}*/}
                {/*    pageSizeOptions={[5, 10, 25, 50, 100, 500]}*/}
                {/*    pagination*/}
                {/*    paginationMode="server"*/}
                {/*    checkboxSelection*/}
                {/*    page={page}*/}
                {/*    onPageChange={handlePageChange}*/}
                {/*    onPageSizeChange={handlePageSizeChange}*/}
                {/*    // initialState={{*/}
                {/*    //     pagination: {*/}
                {/*    //         paginationModel: { page: 0, pageSize: 10 },*/}
                {/*    //     },*/}
                {/*    // }}*/}
                {/*/>*/}
                {/*) : (*/}
                {/*    <div>Нет пациентов с типом документа: {filter}</div>*/}
                {/*)}*/}
            {/*</div>*/}
            {/*<Modal*/}
            {/*    open={open}*/}
            {/*    onClose={handleClose}*/}
            {/*    aria-labelledby="modal-modal-title"*/}
            {/*    aria-describedby="modal-modal-description"*/}
            {/*>*/}
            {/*    <Box*/}
            {/*        sx={{*/}
            {/*            position: 'absolute',*/}
            {/*            top: '50%',*/}
            {/*            left: '50%',*/}
            {/*            transform: 'translate(-50%, -50%)',*/}
            {/*            width: 400,*/}
            {/*            bgcolor: 'background.paper',*/}
            {/*            boxShadow: 24,*/}
            {/*            p: 4*/}
            {/*        }}>*/}
            {/*        <Typography id="modal-modal-title" variant="h6" component="h2">*/}
            {/*            Дополнительная информация*/}
            {/*        </Typography>*/}
            {/*        {selectedRow ? (*/}
            {/*            <Box sx={{mt: 2}}>*/}
            {/*                <Typography>Имя: {selectedRow.first_name || 'Не указано'}</Typography>*/}
            {/*                <Typography>Фамилия: {selectedRow.last_name || 'Не указано'}</Typography>*/}
            {/*                /!* Добавьте дополнительные поля для отображения *!/*/}
            {/*            </Box>*/}
            {/*        ) : (*/}
            {/*            <Typography sx={{mt: 2}}>Информация не доступна</Typography>*/}
            {/*        )}*/}
            {/*    </Box>*/}
            {/*</Modal>*/}
            {/*<TablePagination*/}
            {/*    component="div"*/}
            {/*    count={100}*/}
            {/*    page={page}*/}
            {/*    onPageChange={handleChangePage}*/}
            {/*    rowsPerPage={rowsPerPage}*/}
            {/*    onRowsPerPageChange={handleChangeRowsPerPage}*/}
            {/*/>*/}

        </>
    );
}
export default PatientsTable;
