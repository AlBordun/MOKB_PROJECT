import React, {createContext, useEffect, useState} from 'react';
import {createBrowserRouter, Route, RouterProvider, Routes} from 'react-router-dom';
import PatientsTable from '../src/components/PatientsTable/PatientsTable';
import Header from './components/Header/Header';
import './App.css';
import FormModal from '../src/components/FormModal/FormModal';
import axios from "axios";
import AppPagination from "./components/Pagination";
import {createTheme} from "@mui/system";
import NewPatientsTable from "./components/PatientsTable/NewPatientsTable";



function App() {
    const [isModalActive, setModalActive] = useState(false);

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
            />

            {/*<PatientsTable/>*/}
            <NewPatientsTable/>
        </div>
    );
}

export default App;