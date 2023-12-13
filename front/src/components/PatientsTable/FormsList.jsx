import React, { useState, useEffect } from 'react';
import axios from "axios";

// const FormsList = () => {
//     const [forms, setForms] = useState([]);
//
//     useEffect(() => {
//         axios.get('/api/forms/find_all')
//             .then(response => setForms(response.data))
//             .catch(error => console.error('Ошибка при загрузке данных:', error));
//     }, []);
//
//     // Функция для получения ключей объекта (для заголовков таблицы)
//     const getHeaders = (patients) => {
//         if (patients.length === 0) return [];
//         return Object.keys(patients[0]);
//     };
//
//     const headers = getHeaders(patients);
//
//     return (
//         <div className="w-full">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4">
//                 {headers.map(header => (
//                     <div key={header} className="font-bold">{header}</div>
//                 ))}
//             </div>
//             {forms.map(form => (
//                 <div key={form.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 gap-4">
//                     {headers.map(header => (
//                         <div key={${form.id}-${header}}>{patient[header]}</div>
//                     ))}
//                 </div>
//             ))}
//         </div>
//     );
// };
//
//
// export default FormsList;