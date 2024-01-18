import axios from 'axios';

// Предполагается, что Patient и ReferenceListItem интерфейсы уже определены где-то в вашем коде
import {ReferenceListItem} from '../DataInterfaces/ReferenceList';
import {Patient} from '../DataInterfaces/Patient'

// Кэш для справочных данных
let referenceDataCache: Record<number, ReferenceListItem[]> = {};

// Функция для запроса данных справочника с сервера
const getReferenceData = async (tag: number): Promise<ReferenceListItem[]> => {
    if (!referenceDataCache[tag]) {
        try {
            const response = await axios.get<ReferenceListItem[]>(`http://localhost:8080/api/reference/byTag?tag=${tag}`);
            referenceDataCache[tag] = response.data;
        } catch (error) {
            console.error('Ошибка при загрузке данных справочника:', error);
            referenceDataCache[tag] = [];
        }
    }
    return referenceDataCache[tag];
};

// Функция для фильтрации одного поля
export const filterField = async (patient: Patient, fieldName: keyof Patient, searchText: string, tag: number): Promise<boolean> => {
    let value = patient[fieldName];

    if (typeof value === 'number') {
        const tagData: ReferenceListItem[] = await getReferenceData(tag);
        const referenceItem = tagData.find(item => item.code === value);
        value = referenceItem ? referenceItem.text : '';
    }

    const valueAsString: string = value ? value.toString() : '';
    return valueAsString.toLowerCase().includes(searchText.toLowerCase());
};