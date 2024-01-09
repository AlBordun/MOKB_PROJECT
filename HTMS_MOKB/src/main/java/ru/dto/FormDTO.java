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
    @JsonIgnoreProperties(ignoreUnknown = true)
    private LocalDate date;

    @JsonProperty("form_name")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String formName;

    @JsonProperty("inst_name")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String institution;

    @JsonProperty("vmp_group")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String vmpGroup;

    @JsonProperty("route")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String route;

    @JsonProperty("patient_id")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Patient patient;

    @JsonProperty("profile_name")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String profile;

}
