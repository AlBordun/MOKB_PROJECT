
export interface Patient {
    id: number | string;
    [key: string]: any;
    refType: string;
    directionNumber: string;
    populationCategory: string;
    referralDate: string;
    snils: string;
    policyNumber: string;
    lastName: string;
    firstName: string;
    middleName: string;
    gender: string;
    dateOfBirth: string;
    documentType: string;
    passportSeries: string;
    passportNumber: string;
    address: string;
}