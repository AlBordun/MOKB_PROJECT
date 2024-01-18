import { useState, useEffect } from 'react';
import axios from 'axios';
import { Patient } from '../DataInterfaces/Patient'; // Предполагая, что у вас есть такой тип

const usePatientsService = () => {
    const [patients, setPatients] = useState<Patient[]>([]);

    // Получение списка пациентов
    const fetchPatients = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/patients/find_all`);
            setPatients(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке данных о пациентах:', error);
        }
    };

    // Удаление пациента
    const deletePatient = async (patientId: number) => {
        try {
            await axios.delete(`http://localhost:8080/api/patients/${patientId}`);
            setPatients(prevPatients => prevPatients.filter(patient => patient.id !== patientId));
        } catch (error) {
            console.error('Ошибка при удалении пациента:', error);
        }
    };

    // Удаление нескольких пациентов
    const deleteMultiplePatients = async (patientIds: number[]) => {
        try {
            await Promise.all(patientIds.map(id => axios.delete(`http://localhost:8080/api/patients/${id}`)));
            setPatients(prevPatients => prevPatients.filter(patient => !patientIds.includes(patient.id)));
        } catch (error) {
            console.error('Ошибка при удалении пациентов:', error);
        }
    };

    // Вызов fetchPatients при монтировании компонента
    useEffect(() => {
        fetchPatients();
    }, []);

    return { patients, fetchPatients, deletePatient, deleteMultiplePatients };
};

export default usePatientsService;