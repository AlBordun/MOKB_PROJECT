import axios from 'axios';
import {Form} from "../DataInterfaces/Form";

// Типы и интерфейсы, если они необходимы для вашего API
interface DocumentNumberResponse {
    lastId: number;
}

export const fetchDocumentNumber = async (): Promise<number> => {
    try {
        const response = await axios.get<number>('http://localhost:8080/api/forms/last_id');
        const lastId = response.data;
        return lastId + 1;
    } catch (error) {
        console.error('Ошибка при получении последнего ID формы:', error);
        throw error;
    }
};