package ru.models.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@Data
@Entity
@Table(name = "institution_name")
@JsonIgnoreProperties(ignoreUnknown = true)
public class Institutions {

    @JsonProperty(value = "inst_id")
    @Id
    @SequenceGenerator(
            name = "inst_id",
            sequenceName = "inst_id",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.AUTO,
            generator = "inst_id"
    )
    @Column(name = "inst_id")
    @Basic(optional = true)
    private Integer id;

    @Column(name = "inst_name")
    @Basic(optional = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String instName;

    @Column(name = "city")
    @Basic(optional = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer city;

    @Column(name = "inst_adress")
    @Basic(optional = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String instAddress;

    @Column(name = "full_inst_name")
    @Basic(optional = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String fullInstName;

    @OneToMany(mappedBy = "institutions")
    private Set<Form> forms = new HashSet<>();

}

