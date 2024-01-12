package ru.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// TODO post and get DTOs

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PatientDTO {
    @JsonProperty("id")
    private Integer id;

    @JsonProperty("first_name")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String firstName;

    @JsonProperty("last_name")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String lastName;

    @JsonProperty("middle_name")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String middleName;

    @JsonProperty("date_of_birth")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private LocalDate dateOfBirth;

    @JsonProperty("gender")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer gender;

    @JsonProperty("population_category")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer populationCategory;

    @JsonProperty("document_type")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer documentType;

    @JsonProperty("snils")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String snils;

    @JsonProperty("insurance_policy")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String insurancePolicy;

    @JsonProperty("passport_series")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer passportSeries;

    @JsonProperty("passport_number")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer passportNumber;

    @JsonProperty("registration_address")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String registrationAddress;

    @JsonProperty("actual_address")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String actualAddress;

//    @JsonProperty("patient_model")
//    @JsonIgnoreProperties(ignoreUnknown = true)
//    private String patientModel;
    // Конструктор, геттеры, сеттеры, equals, hashCode и toString методы сгенерируются автоматически
}

