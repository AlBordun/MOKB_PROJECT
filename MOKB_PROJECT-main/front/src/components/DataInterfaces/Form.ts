export interface Form {

    id? : number | string | any;
    date? : string;
    form_name?: string | number;
    inst_name?: number | null;
    profile_name?: number | any | null;
    route?: string;
    vmp_group?: number | any | null;
    vmpoms_group?: number | null;
    disabled_cat?: string | number | any;
    need_cat?: number | null;
    payment_cat?: number | null;
    signature?: number | null;
    date_of_hosp?: string;
    mkb_10?: string | null;
    char_of_disease?: number | null;
    patient_model?: string;
    additional_info?: string;
    disability?: number | null;
    patient_id?: number | string | any;
    accomp_last_name?: string ;
    accomp_first_name?: string ;
    accomp_middle_name?: string ;
    accomp_gender?: number | null;
    accomp_document_type?: number | null;
    accomp_passport_series?: number | null;
    accomp_passport_number?: number | null;
    accomp_registration_address?: string;
    accomp_actual_address?: string;
    accomp_date_of_birth?: string;
}