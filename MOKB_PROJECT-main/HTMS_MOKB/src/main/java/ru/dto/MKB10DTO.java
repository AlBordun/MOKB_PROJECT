package ru.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MKB10DTO {

    @JsonProperty("mkb_id")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer id;

    @JsonProperty("mkb_code")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String mkbCode;

    @JsonProperty("mkb_name")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String mkbName;

}
