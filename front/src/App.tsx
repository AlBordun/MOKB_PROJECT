import React, {useState} from 'react';
import Header from './components/Header/Header';
import './App.css';
import NewPatientsTable from "./components/PatientsTable/NewPatientsTable";



function App() {
    const [isModalActive, setModalActive] = useState(false);
const [searchText,setSearchText] = useState('');
    const handleModalOpen = () => {
        setModalActive(true);
    };
    const handleModalClose = () => {
        setModalActive(false);
    };
    return (
        <div>
            <Header
                onProtocolClick={() => {}}
                onReferralClick={() => {}}
                onTicketClick={() => {}}
                searchText={searchText}
                setSearchText={setSearchText()}
            />

            {/*<PatientsTable/>*/}
            <NewPatientsTable
            searchText={searchText}
            />
        </div>
    );
}

export default App;