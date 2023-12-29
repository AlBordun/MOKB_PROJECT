package ru.dto;

import java.time.LocalDate;

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
    private Long id;

    @JsonProperty("first_name")
    private String firstName;

    @JsonProperty("last_name")
    private String lastName;

    @JsonProperty("middle_name")
    private String middleName;

    @JsonProperty("date_of_birth")
    private LocalDate dateOfBirth;

    @JsonProperty("gender")
    private String gender;

    @JsonProperty("population_category")
    private String populationCategory;

    @JsonProperty("document_type")
    private String documentType;

    @JsonProperty("snils")
    private String snils;

    @JsonProperty("insurance_policy")
    private String insurancePolicy;

    @JsonProperty("passport_series")
    private String passportSeries;

    @JsonProperty("passport_number")
    private String passportNumber;

    @JsonProperty("registration_address")
    private String registrationAddress;

    @JsonProperty("actual_address")
    private String actualAddress;

    @JsonProperty("patient_model")
    private String patientModel;
    // Конструктор, геттеры, сеттеры, equals, hashCode и toString методы сгенерируются автоматически
}

