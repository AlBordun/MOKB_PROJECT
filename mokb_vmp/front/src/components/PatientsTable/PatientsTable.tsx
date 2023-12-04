import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    IconButton, Collapse, Box, Typography
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PropTypes from 'prop-types';
import {Patient} from "../Patient/Patient";

function createData(patient:Patient): Patient {
    return patient;
}
interface RowProps {
    row: Patient;
}
function Row(props: RowProps) {
    const { row } = props;
    const [open, setOpen] = useState(false);

    return (
        <React.Fragment>
            <TableRow
                sx={{
                    '& > *': {
                        borderBottom: 'unset',
                    },
                }}
            >
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">{row.first_name}</TableCell>
                <TableCell align="right">{row.last_name}</TableCell>
                <TableCell align="right">{row.middle_name}</TableCell>
                <TableCell align="right">{row.date_of_birth}</TableCell>
                <TableCell align="right">{row.gender}</TableCell>
                {/* Добавьте другие ячейки таблицы в соответствии с вашими полями */}
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="h6" gutterBottom component="div">
                                Patient Details
                            </Typography>
                            {/* ... Здесь может быть дополнительная информация о пациенте ... */}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

const PatientsTable = () => {
    const [patients, setPatients] = useState<Patient[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/patients/find_all')
            .then(response => {
                const responseData: Patient[] = response.data;
                setPatients(responseData.map(patient => createData(patient)));
            })
            .catch(error => console.error('Ошибка при загрузке данных:', error));
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>First Name</TableCell>
                        <TableCell align="right">Last Name</TableCell>
                        <TableCell align="right">Middle Name</TableCell>
                        <TableCell align="right">Date of Birth</TableCell>
                        <TableCell align="right">Gender</TableCell>
                        {/* Добавьте другие заголовки в соответствии с вашими полями */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {patients.map((patient) => (
                        <Row key={patient.patient_id} row={patient} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};


// const PatientsTable = () => {
//     const [patients, setPatients] = useState<Patient[]>([]);
//
//     useEffect(() => {
//         axios.get('http://localhost:8080/api/patients/find_all')
//             .then(response => setPatients(response.data))
//             .catch(error => console.error('Ошибка при загрузке данных:', error));
//     }, []);
//
//     // Функция для получения ключей объекта (для заголовков таблицы)
//     const getHeaders = (patients:Patient []) => {
//         if (patients.length === 0) return [];
//         return Object.keys(patients[0]);
//     };
//
//     const headers = getHeaders(patients);
//
//
//     const useRowStyles = makeStyles({
//         root: {
//             '& > *': {
//                 borderBottom: 'unset',
//             },
//         },
//     });
//
//     function createData(name, calories, fat, carbs, protein, price) {
//         return {
//             name,
//             calories,
//             fat,
//             carbs,
//             protein,
//             price,
//             history: [
//                 { date: '2020-01-05', customerId: '11091700', amount: 3 },
//                 { date: '2020-01-02', customerId: 'Anonymous', amount: 1 },
//             ],
//         };
//     }
//
//     function Row(props) {
//         const { row } = props;
//         const [open, setOpen] = React.useState(false);
//         const classes = useRowStyles();
//
//         return (
//             <React.Fragment>
//                 <TableRow className={classes.root}>
//                     <TableCell>
//                         <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
//                             {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//                         </IconButton>
//                     </TableCell>
//                     <TableCell component="th" scope="row">
//                         {row.name}
//                     </TableCell>
//                     <TableCell align="right">{row.calories}</TableCell>
//                     <TableCell align="right">{row.fat}</TableCell>
//                     <TableCell align="right">{row.carbs}</TableCell>
//                     <TableCell align="right">{row.protein}</TableCell>
//                 </TableRow>
//                 <TableRow>
//                     <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
//                         <Collapse in={open} timeout="auto" unmountOnExit>
//                             <Box margin={1}>
//                                 <Typography variant="h6" gutterBottom component="div">
//                                     History
//                                 </Typography>
//                                 <Table size="small" aria-label="purchases">
//                                     <TableHead>
//                                         <TableRow>
//                                             <TableCell>Date</TableCell>
//                                             <TableCell>Customer</TableCell>
//                                             <TableCell align="right">Amount</TableCell>
//                                             <TableCell align="right">Total price ($)</TableCell>
//                                         </TableRow>
//                                     </TableHead>
//                                     <TableBody>
//                                         {row.history.map((historyRow) => (
//                                             <TableRow key={historyRow.date}>
//                                                 <TableCell component="th" scope="row">
//                                                     {historyRow.date}
//                                                 </TableCell>
//                                                 <TableCell>{historyRow.customerId}</TableCell>
//                                                 <TableCell align="right">{historyRow.amount}</TableCell>
//                                                 <TableCell align="right">
//                                                     {Math.round(historyRow.amount * row.price * 100) / 100}
//                                                 </TableCell>
//                                             </TableRow>
//                                         ))}
//                                     </TableBody>
//                                 </Table>
//                             </Box>
//                         </Collapse>
//                     </TableCell>
//                 </TableRow>
//             </React.Fragment>
//         );
//     }
//
//     Row.propTypes = {
//         row: PropTypes.shape({
//             calories: PropTypes.number.isRequired,
//             carbs: PropTypes.number.isRequired,
//             fat: PropTypes.number.isRequired,
//             history: PropTypes.arrayOf(
//                 PropTypes.shape({
//                     amount: PropTypes.number.isRequired,
//                     customerId: PropTypes.string.isRequired,
//                     date: PropTypes.string.isRequired,
//                 }),
//             ).isRequired,
//             name: PropTypes.string.isRequired,
//             price: PropTypes.number.isRequired,
//             protein: PropTypes.number.isRequired,
//         }).isRequired,
//     };
//
//     const rows = [
//         createData('Frozen yoghurt', 159, 6.0, 24, 4.0, 3.99),
//         createData('Ice cream sandwich', 237, 9.0, 37, 4.3, 4.99),
//         createData('Eclair', 262, 16.0, 24, 6.0, 3.79),
//         createData('Cupcake', 305, 3.7, 67, 4.3, 2.5),
//         createData('Gingerbread', 356, 16.0, 49, 3.9, 1.5),
//     ];
//
//     export default function CollapsibleTable() {
//         return (
//             <TableContainer component={Paper}>
//                 <Table aria-label="collapsible table">
//                     <TableHead>
//                         <TableRow>
//                             <TableCell />
//                             <TableCell>Dessert (100g serving)</TableCell>
//                             <TableCell align="right">Calories</TableCell>
//                             <TableCell align="right">Fat&nbsp;(g)</TableCell>
//                             <TableCell align="right">Carbs&nbsp;(g)</TableCell>
//                             <TableCell align="right">Protein&nbsp;(g)</TableCell>
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {rows.map((row) => (
//                             <Row key={row.name} row={row} />
//                         ))}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//         );
//     }
//
//
//     return (
//         <div className="w-full h-full overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200"></table>
//             <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4">
//                 {headers.map(header => (
//                     <div key={header} className="font-bold">{header}</div>
//                 ))}
//             </div>
//             {patients.map(patient => (
//                 <div key={patient.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4">
//                     {headers.map(key => (
//                         <div key={`${patient.id}-${key}`}>
//                             {typeof patient[key] === 'object'
//                                 ? <pre>{JSON.stringify(patient[key], null, 2)}</pre>
//                                 : patient[key]}
//                         </div>
//                     ))}
//                 </div>
//             ))}
//         </div>
//     );
// };

export default PatientsTable;

// Предполагаемый API endpoint
// const API_ENDPOINT = '/api/forms/find_all';

// Компонент для отображения строки таблицы
// const PatientRow = ({ patient, style }: { patient: Patient; style: React.CSSProperties }) => (
//     <div
//         style={style}
//         className="grid grid-cols-5 gap-4 p-4 items-center border-b border-gray-200 hover:bg-gray-400 bg-gray-200"
//     >
//         <div>{patient.directionNumber}</div>
//         <div>{`${patient.lastName} ${patient.firstName} ${patient.middleName}`}</div>
//         <div>{patient.populationCategory}</div>
//         <div>{patient.documentType}</div>
//         <div>{`${patient.passportSeries} ${patient.passportNumber}`}</div>
//     </div>
// );
// const TableHeader = () => (
//     <div className="grid grid-cols-6 gap-4 p-4 items-center  border-b border-gray-400">
//         <div>Тип Направления</div>
//         <div>Номер документа</div>
//         <div>ФИО</div>
//         <div>Категория населения</div>
//         <div>Тип документа</div>
//         <div>Номер паспорта</div>
//     </div>
// );
// // Тестовые данные для симуляции загрузки
// const mockData = [
//     { refType : "Направление", directionNumber: "123", lastName: "Иванов", firstName: "Иван", middleName: "Иванович", populationCategory: "Взрослый", documentType: "Паспорт", passportSeries: "1234", passportNumber: "567890" },
//     { refType : "Направление", directionNumber: "123", lastName: "Иванов", firstName: "Иван", middleName: "Иванович", populationCategory: "Взрослый", documentType: "Паспорт", passportSeries: "1234", passportNumber: "567890" },
//     // Добавьте столько объектов, сколько нужно для теста
//     ];
// // Основной компонент таблицы пациентов
// const PatientsTable = () => {
//     const [patients, setPatients] = useState([]);
//     const [loadedRowCount, setLoadedRowCount] = useState(0);
//     const [tableSize, setTableSize] = useState({ width: window.innerWidth, height: window.innerHeight });
//     const [selectedPatient, setSelectedPatient] = useState<Patient|null>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//
//     useEffect(() => {
//         const handleResize = () => {
//             setTableSize({ width: window.innerWidth, height: window.innerHeight });
//         };
//
//         // Установка начального размера и добавление обработчика событий
//         window.addEventListener('resize', handleResize);
//
//         // Очистка обработчика событий при размонтировании компонента
//         return () => window.removeEventListener('resize', handleResize);
//     }, []);
//
//     // const loadMoreRows = useCallback(async ({ startIndex, stopIndex }: IndexRange) => {
//     //     try {
//     //         const { data } = await axios.get(${API_ENDPOINT}?page=${startIndex}&size=${stopIndex - startIndex});
//     //         setPatients(prev => [...prev, ...data.content]);
//     //         setLoadedRowCount(data.totalElements);
//     //     } catch (error) {
//     //         console.error('Ошибка при загрузке данных:', error);
//     //     }
//     // }, []);
//     const handleRowClick = (patient:Patient) => {
//         setSelectedPatient(patient);
//         setIsModalOpen(true);
//     };
//
//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//     };
//     const handleSaveData = (patientData: Patient) => {
//         // Логика для обработки данных формы
//         console.log("Сохраняемые данные:", patientData);
//         setIsModalOpen(false); // Закрытие модального окна после сохранения данных
//     }
//     const isRowLoaded = ({ index }: { index: number }) => !!patients[index];
//
//     const rowRenderer = ({ index, key, style }: { index: number; key: string; style: React.CSSProperties }) => {
//         const patient = patients[index];
//         if (!patient) {
//             return <div key={key} style={style}>Загрузка...</div>;
//         }
//         return patient ? (
//             <PatientRow key={key} patient={patient} style={style} />
//         ) : (
//             <div key={key} style={style} className="loading-placeholder">
//                 Загрузка...
//             </div>
//         );
//     };
//
//     return (
//         <div className="h-full w-full">
//             {/*<TableHeader />*/}
//             {/*{patients.map((patient, index) => (*/}
//             {/*    <div onClick={() => handleRowClick(patient)} key={index}>*/}
//             {/*        <PatientRow patient={patient} />*/}
//             {/*    </div>*/}
//             {/*))}*/}
//             {isModalOpen && (
//                 <FormModal
//                     show={isModalOpen}
//                     onClose={handleCloseModal}
//                     onSave={handleSaveData}
//                     patient={selectedPatient}
//                 />
//             )}
//             {/*<InfiniteLoader*/}
//             {/*    isRowLoaded={isRowLoaded}*/}
//             {/*    loadMoreRows={loadMoreRows}*/}
//             {/*    rowCount={loadedRowCount}*/}
//             {/*>*/}
//             {/*    {({ onRowsRendered, registerChild }) => (*/}
//             {/*        <List*/}
//             {/*            height={tableSize.height}*/}
//             {/*            width={tableSize.width}*/}
//             {/*            onRowsRendered={onRowsRendered}*/}
//             {/*            ref={registerChild}*/}
//             {/*            rowCount={loadedRowCount}*/}
//             {/*            rowHeight={50}*/}
//             {/*            rowRenderer={rowRenderer}*/}
//             {/*            overscanRowCount={3}*/}
//             {/*        />*/}
//             {/*    )}*/}
//             {/*</InfiniteLoader>*/}
//         </div>
//     );
// };
//
// export default PatientsTable;