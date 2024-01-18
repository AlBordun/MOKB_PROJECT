import axios from 'axios';

export const deletePatients = (patientIds: number[]): Promise<any> => {
    const deleteRequests = patientIds.map(id =>
        axios.delete(`http://localhost:8080/api/patients/${id}`)
    );
    return Promise.all(deleteRequests);
};

export const deleteForms = (formIds: number[]): Promise<any> => {
    const deleteRequests = formIds.map(id =>
        axios.delete(`http://localhost:8080/api/forms/${id}`)
    );
    return Promise.all(deleteRequests);
};