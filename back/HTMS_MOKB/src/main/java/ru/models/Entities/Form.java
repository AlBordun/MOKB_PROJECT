package ru.models.Entities;

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
    private Long id;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "form_name")
    private String formName;

//    @Basic(optional = true)
//    @Column(name = "population_category")
//    private String populationCategory;

//    @Basic(optional = true)
//    @Column(name = "postal_code")
//    private String postalCode;
//
//    @Basic(optional = true)
//    @Column(name = "city_index")
//    private Integer cityIndex;

    @Basic(optional = true)
//            fetch = FetchType.LAZY)
    @Column(name = "inst_name")
    private String institution;

//    @Basic(optional = true)
//    @Column(name = "vmp_profile")
//    private String vmpProfile;

    @Basic(optional = true)
    @Column(name = "vmp_group")
    private String vmpGroup;

    @Basic(optional = true)
    @Column(name = "route")
    private String route;

    @Basic(optional = true)
    @Column(name = "profile_name")
    private String profile;

    @ManyToOne
    @JoinColumn (name = "patient_id")
    private Patient patient;

//(fetch = FetchType.LAZY)



}
