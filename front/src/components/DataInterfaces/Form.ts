export interface Form {

    id : number | string | any;
    date : string;
    form_name: string;
    inst_name: number | null;
    profile_name: number;
    route: string;
    vmp_group: number | any;
    vmpoms_group: number;
    disabled_cat: string | number | any;
    need_cat: number;
    payment_cat: number;
    signature: number;
    date_of_hosp: string;
    mkb_10: string | null ;
    char_of_disease: number;
    patient_model: string;
    disability: number;
    patient_id: number | string | any;
    accomp_last_name: string;
    accomp_first_name: string;
    accomp_middle_name: string;
    accomp_gender: number;
    accomp_document_type: number;
    accomp_passport_series: number;
    accomp_passport_number: number;
    accomp_registration_address: string;
    accomp_actual_address: string;
}