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
            name = "patient_id",
            sequenceName = "patient_id",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.IDENTITY,
            generator = "patient_id"
    )
    @Column(name = "patient_id")
    private Long id;

    @Basic(optional = true)
    @Column(name = "first_name")
    private String firstName;

    @Basic(optional = true)
    @Column(name = "last_name")
    private String lastName;

    @Basic(optional = true)
    @Column(name = "middle_name")
    private String middleName;

    @Basic(optional = true)
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Basic(optional = true)
    @Column(name = "gender")
    private String gender;

    @Basic(optional = true)
    @Column(name = "population_category")
    private String populationCategory;

    @Basic(optional = true)
    @Column(name = "document_type")
    private String documentType;

    @Basic(optional = true)
    @Column(name = "snils")
    private String snils;

    @Basic(optional = true)
    @Column(name = "insurance_policy")
    private String insurancePolicy;

    @Basic(optional = true)
    @Column(name = "passport_series")
    private String passportSeries;

    @Basic(optional = true)
    @Column(name = "passport_number")
    private String passportNumber;

    @Column(name = "registration_address")
    private String registrationAddress;

    @Basic(optional = true)
    @Column(name = "actual_address")
    private String actualAddress;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL,orphanRemoval = true)
    private Set<Form> forms;
//, fetch = FetchType.LAZY
}
