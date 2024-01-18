import React, {useCallback, useEffect, useState} from 'react';
import Header from './components/Header/Header';
import './App.css';
import NewPatientsTable from "./components/PatientsTable/NewPatientsTable";
import {Patient} from "./components/DataInterfaces/Patient";
import FormModal from "./components/FormModal/FormModal";
import axios from "axios";
import usePatientsService from "./components/utils/usePatientsService";


const App: React.FC = () => {
    const [selected, setSelected] = useState<number []>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [searchText, setSearchText] = useState('');
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [selectedPatients, setSelectedPatients] = useState<number[]>([]);
    const [selectedForms, setSelectedForms] = useState<{ [patientId: number]: number[] }>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        id: false,
        last_name: true,
        first_name: true,
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
    });


    const toggleColumnVisibility = (column: keyof Patient) => {
        setColumnVisibility(prev => {
            const newVisibility = {...prev, [column]: !prev[column]};
            console.log("Обновленная видимость столбцов в App:", newVisibility);
            return newVisibility;
        });
    };

    useEffect(() => {
        console.log("App: Current Column Visibility", columnVisibility);
    }, [columnVisibility]);

    const handleSearchTextChange = (newSearchText: string) => {
        setSearchText(newSearchText);
    }

    const handleCopyData = (dataToCopy: Patient) => {
        console.log("copy: ", dataToCopy);
    }

    const handlePatientsDeleted = () => {
        setPatients(prevPatients => prevPatients.filter(patient =>
            !selectedPatients.includes(patient.id)));
        setSelectedPatients([]);
    };

    const handleFormsDeleted = () => {
        setSelectedForms({});
    };

    const handleSelectAllClick = (selectedIds: number[]) => {
        setSelectedPatients(selectedIds);
    };

    const handlePatientSaved = (savedPatient: Patient) => {
        setPatients(prevPatients => {
            const updatedPatients = prevPatients.map(patient =>
                patient.id === savedPatient.id ? savedPatient : patient
            );
            return updatedPatients;
        });
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };
    const updatePatients = (newPatients: Patient[]) => {
        setPatients(newPatients);
    };

    // const handleSave = (savedPatient: Patient) => {
    //     console.log("Сохраненные данные пациента:", savedPatient);
    // };

    const refreshPatientsList = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/patients/find_all`);
            setPatients(response.data);
        } catch (error) {
        }
    };

    return (
        <div>
            <Header
                selectedPatients={selectedPatients}
                onPatientsDeleted={handlePatientsDeleted}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                selected={selected}
                searchText={searchText}
                setSearchText={setSearchText}
                onSearchTextChange={handleSearchTextChange}
                columnVisibility={columnVisibility}
                toggleColumnVisibility={toggleColumnVisibility}
                />

            <NewPatientsTable
                startDate={startDate}
                endDate={endDate}
                selected={selected}
                setSelected={setSelected}
                searchText={searchText}
                setSearchText={setSearchText}
                columnVisibility={columnVisibility}
                handleCopyData={handleCopyData}
                patients={patients}
                setSelectedPatients={setSelectedPatients}
                selectedPatients={selectedPatients}
                selectedForms={selectedForms}
                setSelectedForms={setSelectedForms}
                onFormsDeleted={handleFormsDeleted}
                handleSelectAllClick={handleSelectAllClick}
                refreshPatientsList={refreshPatientsList}
                updatePatients={updatePatients}
            />
            <FormModal
                show={isModalOpen} // Состояние показа модального окна
                onClose={handleModalClose} // Функция для закрытия модального окна
                // onSave={handleSave} // Функция для сохранения данных
                onSave={refreshPatientsList}
                patient={selectedPatient} // Данные пациента для редактирования
                onPatientSaved={handlePatientSaved} // Функция для обработки сохранённых данных
                refreshPatientsList={refreshPatientsList}
            />
        </div>
    );
}

export default App;