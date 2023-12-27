package ru.dto;

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
    private Long id;

    @JsonProperty("inst_name")
    private String instName;

    @JsonProperty("city")
    private Integer city;

    @JsonProperty("inst_adress")
    private String instAddress;

    @JsonProperty("full_inst_name")
    private String fullInstName;

}
