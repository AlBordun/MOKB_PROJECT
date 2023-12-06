import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
    IconButton, Box, Typography, Modal, Pagination, LinearProgress, TextField, Toolbar, Button
} from '@mui/material';
import {styled} from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import {
    DataGrid,
    GridColDef,
    GridRenderCellParams,
    GridToolbarContainer,
    GridToolbarExport,
    GridToolbar
} from '@mui/x-data-grid';
import {Patient} from "../Patient/Patient";
import AppPagination from "../Pagination";
import {createTheme, ThemeProvider} from "@mui/system";


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
        {
            field: 'details',
            headerName: 'Детали',
            renderCell: (params: GridRenderCellParams) => (
                <IconButton onClick={() => handleOpen(params.row)}>
                    <InfoIcon style={{color: '#1976d2'}}/>
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

    const handleOpen = (row: any) => {
        setSelectedRow(row);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    function createData(patient: Patient): Patient {
        return patient;
    }

    // Функция для обновления состояния поискового запроса
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    // Фильтрация данных на основе поискового запроса
    const filteredRows = patients.filter((patients) => {
        return patients.first_name.toLowerCase().includes(searchText.toLowerCase());

    });
    const MyCustomToolbar = () => (
        <Toolbar>
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

    return (
        <>
            <MyCustomToolbar/>
            <div style={{height: '400', width: '100%'}}>
                <DataGrid
                    sx={{
                        '.MuiDataGrid-columnHeader': {
                            color: '#1565c0',
                        },
                    }}
                    rows={filteredRows}
                    columns={columns}
                    slots={{
                        loadingOverlay: LinearProgress,

                    }}
                    {...patients}
                    initialState={{
                        pagination: {
                            paginationModel: {page: 0, pageSize: 10},
                        },
                    }}
                    pageSizeOptions={[5, 10, 25, 50, 100, 500]}
                    checkboxSelection

                />
                {/*<AppPagination count={patients.length} patients = {patients} />*/}
                <AppPagination count={-1} patients={patients}/>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4}}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Дополнительная информация
                    </Typography>
                    {selectedRow ? (
                        <Box sx={{mt: 2}}>
                            <Typography>Имя: {selectedRow.first_name || 'Не указано'}</Typography>
                            <Typography>Фамилия: {selectedRow.last_name || 'Не указано'}</Typography>
                            {/* Добавьте дополнительные поля для отображения */}
                        </Box>
                    ) : (
                        <Typography sx={{mt: 2}}>Информация не доступна</Typography>
                    )}
                </Box>
            </Modal>
        </>
    );
}
export default PatientsTable;
