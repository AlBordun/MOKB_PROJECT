import React, {useState} from 'react';
import Header from './components/Header/Header';
import './App.css';
import NewPatientsTable from "./components/PatientsTable/NewPatientsTable";
import {Patient} from "./components/Patient/Patient";


function App() {
    const [isModalActive, setModalActive] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({});

    const toggleColumnVisibility = (column: keyof Patient) => {
        setColumnVisibility(prev => ({
            ...prev,
            [column]: !prev[column]
        }));
    };
    const handleSearchTextChange = (newSearchText: string) => {
        setSearchText(newSearchText);
    }

        const handleModalOpen = () => {
        setModalActive(true);
    };
    const handleModalClose = () => {
        setModalActive(false);
    };
    return (
        <div>
            <Header
                // onProtocolClick={() => {
                // }}
                // onReferralClick={() => {
                // }}
                // onTicketClick={() => {
                // }}
                searchText={searchText}
                setSearchText={setSearchText}
                onSearchTextChange={handleSearchTextChange}
                columnVisibility={columnVisibility}
                toggleColumnVisibility={toggleColumnVisibility}
            />

            {/*<PatientsTable/>*/}
            <NewPatientsTable
                searchText={searchText}
                setSearchText={setSearchText}
                columnVisibility={columnVisibility}
            />
        </div>
    );
}

export default App;