package ru.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class InstitutionsDTO {

    @JsonProperty("inst_id")
    private Integer id;

    @JsonProperty("inst_name")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String instName;

    @JsonProperty("city")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer city;

    @JsonProperty("inst_adress")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String instAddress;

    @JsonProperty("full_inst_name")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String fullInstName;

}
