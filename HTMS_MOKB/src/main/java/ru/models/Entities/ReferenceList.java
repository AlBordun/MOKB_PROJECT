package ru.models.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;
@Entity
public class ReferenceList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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
