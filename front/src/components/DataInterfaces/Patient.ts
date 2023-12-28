
export interface Patient {
    id: number | string | any;
    [key: string]: any;
    refType: string;
    directionNumber: string;
    populationCategory: string | number;
    referralDate: string;
    snils: string;
    policyNumber: string;
    lastName: string;
    firstName: string;
    middleName: string;
    gender: string;
    dateOfBirth: string;
    documentType: string | number;
    passportSeries: string;
    passportNumber: string;
    address: string;
}