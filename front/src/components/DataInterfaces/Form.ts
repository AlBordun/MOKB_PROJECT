export interface Form {

    id : number | string | any;
    date : string;
    form_name: string;
    inst_name: number | null;
    profile_name: string;
    route: string;
    vmp_group: string;
    disabled_cat: number;
    need_cat: number;
    payment_cat: number;
    signature: number;
    date_of_hosp: Date;
    mkb_10: string | null ;
    char_of_disease: number;
    patient_model: string;
    disability: number;
    patient_id: number | string | any;

}