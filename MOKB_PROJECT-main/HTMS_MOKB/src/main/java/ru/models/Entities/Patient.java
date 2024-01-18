package ru.models.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDate;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@Data
@Entity
@Table(name = "patient")
@JsonIgnoreProperties(ignoreUnknown = true)

public class Patient {

    @JsonProperty(value = "patient_id")
    @Id
    @SequenceGenerator(
            name = "patient_id_generator",
            sequenceName = "patient_patient_id_seq",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.AUTO ,
            generator = "patient_id_generator"
    )
    @Column(name = "patient_id")
    @Basic(optional = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer id;

    @Basic(optional = true)
    @Column(name = "last_name")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String lastName;

    @Basic(optional = true)
    @Column(name = "first_name")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String firstName;

    @Basic(optional = true)
    @Column(name = "middle_name")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String middleName;

    @Basic(optional = true)
    @Column(name = "date_of_birth")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private LocalDate dateOfBirth;

    @Basic(optional = true)
    @Column(name = "gender")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer gender;

    @Basic(optional = true)
    @Column(name = "population_category")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer populationCategory;

    @Basic(optional = true)
    @Column(name = "document_type")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer documentType;

    @Basic(optional = true)
    @Column(name = "snils")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String snils;

    @Basic(optional = true)
    @Column(name = "insurance_policy")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String insurancePolicy;

    @Basic(optional = true)
    @Column(name = "passport_series")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer passportSeries;

    @Basic(optional = true)
    @Column(name = "passport_number")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer passportNumber;

    @Column(name = "registration_address")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String registrationAddress;

    @Basic(optional = true)
    @Column(name = "actual_address")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String actualAddress;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL,orphanRemoval = true)
    private Set<Form> forms;
//, fetch = FetchType.LAZY
}
