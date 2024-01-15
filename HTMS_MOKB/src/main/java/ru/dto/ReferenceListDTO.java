package ru.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ReferenceListDTO {

    @JsonProperty("id")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer id;

    @JsonProperty("code")
    @Basic(optional = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer code;

    @JsonProperty("tag")
    @Basic(optional = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer tag;

    @JsonProperty("text")
    @Basic(optional = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String text;


    public ReferenceListDTO(Integer code, String text, Integer tag) {
        this.code = code;
        this.text = text;
        this.tag = tag;
    }
}
