import React, {useEffect, useState} from 'react';
import Header from './components/Header/Header';
import './App.css';
import NewPatientsTable from "./components/PatientsTable/NewPatientsTable";
import {Patient} from "./components/Patient/Patient";


function App() {
    // const [isModalActive, setModalActive] = useState(false);
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
            const newVisibility = { ...prev, [column]: !prev[column] };
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

    return (
        <div>
            <Header
                searchText={searchText}
                setSearchText={setSearchText}
                onSearchTextChange={handleSearchTextChange}
                columnVisibility={columnVisibility}
                toggleColumnVisibility={toggleColumnVisibility}
            />

            <NewPatientsTable
                searchText={searchText}
                setSearchText={setSearchText}
                columnVisibility={columnVisibility}
            />
        </div>
    );
}

export default App;