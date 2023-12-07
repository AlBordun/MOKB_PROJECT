package ru.dto;

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
    private Long id;

    @JsonProperty("date")
    private LocalDate date;

    @JsonProperty("form_name")
    private String formName;

    @JsonProperty("inst_name")
    private String institution;

    @JsonProperty("vmp_group")
    private String vmpGroup;

    @JsonProperty("route")
    private String route;

    @JsonProperty("patient_id")
    private Patient patient;

    @JsonProperty("profile_name")
    private String profile;

}
