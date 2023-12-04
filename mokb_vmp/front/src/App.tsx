import React, {createContext, useEffect, useState} from 'react';
import {createBrowserRouter, Route, RouterProvider, Routes} from 'react-router-dom';
import PatientsTable from '../src/components/PatientsTable/PatientsTable';
import Header from './components/Header/Header';
import './App.css';
import FormModal from '../src/components/FormModal/FormModal';
import axios from "axios";
// export const UserContext = createContext();

// const router = createBrowserRouter([
//     { path: '/patients', element: <PatientsTable /> },
// ])
function App() {

    return (

        // <div>
        //     <RouterProvider router={router} />
        // </div>
        // // <Suspense fallback={<PreLoad />}>
        // // <Route exact path="*">
        // // <PageNotFound />
        <div>
            <Header
                onProtocolClick={() => {}}
                onReferralClick={() => {}}
                onTicketClick={() => {}}
            />

            <PatientsTable />
            {/*<Routes>*/}
            {/*    <Route path="/" element={<PatientsTable/>}/>*/}
            {/*</Routes>*/}
        </div>
    );
}

export default App;