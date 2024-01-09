package ru.models.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@Entity
@Table(name = "forms")
@NoArgsConstructor
public class Form {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer id;

    @Column(name = "date")
    @Basic(optional = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private LocalDate date;

    @Column(name = "form_name")
    @Basic(optional = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String formName;

    @Basic(optional = true)
    @Column(name = "vmp_group")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String vmpGroup;

    @Basic(optional = true)
    @Column(name = "route")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String route;

    @Basic(optional = true)
    @Column(name = "profile_name")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String profile;

    @ManyToOne
    @JoinColumn (name = "patient_id")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "inst_id", referencedColumnName = "inst_id")
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Institutions institutions;

//(fetch = FetchType.LAZY)



}
