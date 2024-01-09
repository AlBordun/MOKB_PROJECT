package ru.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ru.models.Entities.Patient;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class FormDTO {

    @JsonProperty("id")
    private Integer id;

    @JsonProperty("date")
    @Basic(optional = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private LocalDate date;

    @JsonProperty("form_name")
    @Basic(optional = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer formName;

    @Basic(optional = true)
    @JsonProperty("inst_name")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer instName;

    @Basic(optional = true)
    @JsonProperty("profile_name")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer profile;

    @Basic(optional = true)
    @JsonProperty("route")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String route;

    @Basic(optional = true)
    @JsonProperty("vmp_group")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer vmpGroup;

    @Basic(optional = true)
    @JsonProperty("disabled_cat")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer disabilityCategory;

    @Basic(optional = true)
    @JsonProperty("need_cat")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer needCategory;

    @Basic(optional = true)
    @JsonProperty("payment_cat")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer paymentCategory;

    @Basic(optional = true)
    @JsonProperty("signature")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer signature;

    @Basic(optional = true)
    @JsonProperty("date_of_hosp")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String dateOfHospitality;

    @Basic(optional = true)
    @JsonProperty("vmpoms_group")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer vmpOmsGroup;

    @Basic(optional = true)
    @JsonProperty("doc_type")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer documentType;

    @Basic(optional = true)
    @JsonProperty("char_of_disease")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer characterOfDisease;

    @Basic(optional = true)
    @JsonProperty("disability")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String disability;

    @Basic(optional = true)
    @JsonProperty("patient_model")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String patientModel;

}
