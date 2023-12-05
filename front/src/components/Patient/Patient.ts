export interface Patient {
    id: number | string;

    [key: string]: any;

    refType: string;
    directionNumber: string;
    populationCategory: string;
    referralDate: number | string;
    snils: number | string;
    policyNumber: string;
    lastName: string;
    firstName: string;
    middleName: string;
    gender: string;
    dateOfBirth: number | string;
    documentType: string;
    passportSeries: number | string;
    passportNumber: number | string;
    address: string;
    realAddress: string;
}