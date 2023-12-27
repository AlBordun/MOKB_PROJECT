import React, {useEffect, useState} from 'react';
import Header from './components/Header/Header';
import './App.css';
import NewPatientsTable from "./components/PatientsTable/NewPatientsTable";
import {Patient} from "./components/DataInterfaces/Patient";


function App() {
    const [selected, setSelected] = useState<number []>([]);
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    const [searchText, setSearchText] = useState('');
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

    return (
        <div>
            <Header
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
            />
        </div>
    );
}

export default App;