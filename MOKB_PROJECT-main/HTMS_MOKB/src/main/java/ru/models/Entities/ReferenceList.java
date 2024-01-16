package ru.models.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@Entity
@Table(name = "reference_list")
@NoArgsConstructor
@AllArgsConstructor
public class ReferenceList {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Basic(optional = true)
    private Integer id;

    @Column(name = "code")
    @Basic(optional = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer code;

    @Column(name = "tag")
    @Basic(optional = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer tag;
    @Column(name = "text")
    @Basic(optional = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String text;


}
