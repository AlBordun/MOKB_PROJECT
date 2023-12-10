import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, TextField, Box, Typography, Modal , TablePagination
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {DataGrid, GridColDef, GridRenderCellParams, GridToolbarContainer, GridToolbarExport} from '@mui/x-data-grid';
import {Patient} from "../Patient/Patient";


const PatientsTable = () => {
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
                    <InfoIcon/>
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
        {field: 'gender', headerName: 'Пол ', width: 100, align : "left"},
        {field: 'population_category', headerName: 'Категория', width: 100},
        {field: 'document_type', headerName: 'Документ', width: 100},
        {field: 'passport_series', headerName: 'Серия паспорта', width: 120, align : "center"},
        {field: 'passport_number', headerName: 'Номер паспорта', width: 120, align : "center"},
        {field: 'registration_address', headerName: 'Место прописки', width: 180},
        {field: 'actual_address', headerName: 'Место жительства', width: 180},
        {field: 'snils', headerName: 'Снилс', width: 150},
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

    return (
        <>
            <div style={{height: '400', width: '100%'}}>

                <DataGrid

                    rows={patients}
                    columns={columns}
                    initialStte={{
                        pagination: {
                            paginationModel: {page: 0, pageSize: 10},
                        },

                    }}
                    pageSizeOptions={[5, 10, 25, 50,100,500]}
                    checkboxSelection

                />

            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4}}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Дополнительная информация
                    </Typography>
                    {selectedRow ? (
                        <Box sx={{ mt: 2 }}>
                            <Typography>Имя: {selectedRow.first_name || 'Не указано'}</Typography>
                            <Typography>Фамилия: {selectedRow.last_name || 'Не указано'}</Typography>
                            {/* Добавьте дополнительные поля для отображения */}
                        </Box>
                    ) : (
                        <Typography sx={{ mt: 2 }}>Информация не доступна</Typography>
                    )}
                </Box>
            </Modal>
        </>
    );
}
    export default PatientsTable;
