
export interface Patient {
    id: number | string | any;
    [key: string]: any;
    population_category: string | any;
    snils: string;
    policy_number: string;
    last_name: string;
    first_name: string;
    middle_name: string;
    gender: string | any;
    date_of_birth: string;
    document_type: string | number | any;
    passport_series: string;
    passport_number: string;
    actual_address: string;
    registration_address: string;
}