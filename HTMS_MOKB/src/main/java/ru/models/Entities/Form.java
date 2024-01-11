package ru.models.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@Entity
@Table(name = "forms")
@NoArgsConstructor
public class Form {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Basic(optional = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer id;

    @Column(name = "date")
    @Basic(optional = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private LocalDate date;

    @Column(name = "form_name")
    @Basic(optional = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer formName;

    @Basic(optional = true)
    @Column(name = "profile_name")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer profile;

    @Basic(optional = true)
    @Column(name = "route")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String route;

    @Basic(optional = true)
    @Column(name = "vmp_group")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer vmpGroup;

    @Basic(optional = true)
    @Column(name = "disabled_cat")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer disabilityCategory;

    @Basic(optional = true)
    @Column(name = "need_cat")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer needCategory;

    @Basic(optional = true)
    @Column(name = "payment_cat")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer paymentCategory;

    @Basic(optional = true)
    @Column(name = "signature")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer signature;

    @Basic(optional = true)
    @Column(name = "date_of_hosp")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String dateOfHospitality;

    @Basic(optional = true)
    @Column(name = "vmpoms_group")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer vmpOmsGroup;

    @Basic(optional = true)
    @Column(name = "char_of_disease")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer characterOfDisease;

    @Basic(optional = true)
    @Column(name = "disability")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer disability;

    @Basic(optional = true)
    @Column(name = "patient_model")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String patientModel;

    @ManyToOne
    @JoinColumn (name = "patient_id")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "inst_name", referencedColumnName = "inst_id")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Institutions institutions;

    @ManyToOne
    @JoinColumn(name = "mkb_10", referencedColumnName = "mkb_id")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private MKB10 mkb10;


//(fetch = FetchType.LAZY)



}
