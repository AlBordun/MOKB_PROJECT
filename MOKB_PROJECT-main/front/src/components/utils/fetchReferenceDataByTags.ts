import axios from 'axios';
import {ReferenceListItem} from "../DataInterfaces/ReferenceList";

const fetchOptions = async (tag: number): Promise<ReferenceListItem[]> => {
    const hostname = window.location.protocol + `//` + window.location.hostname;
    const url = `${hostname}:8080/api/reference/byTag?tag=${tag}`;
    const response = await axios.get<ReferenceListItem[]>(url);
    return response.data;
};

export const fetchReferenceDataByTags = async (tags: number[]) => {
    try {
        const results = await Promise.allSettled(tags.map(fetchOptions));
        const dataByTag = new Map<number, ReferenceListItem[]>();
        results.forEach((result, index) => {
            if (result.status === "fulfilled") {
                dataByTag.set(tags[index], result.value);
            }
        });
        return dataByTag;
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return new Map<number, ReferenceListItem[]>();
    }
};