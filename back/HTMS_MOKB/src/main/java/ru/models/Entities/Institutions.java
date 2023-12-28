package ru.models.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

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
            strategy = GenerationType.IDENTITY,
            generator = "inst_id"
    )
    @Column(name = "inst_id")
    private Long id;

    @Column(name = "inst_name")
    private String instName;

    @Column(name = "city")
    private Integer city;

    @Column(name = "inst_adress")
    private String instAddress;

    @Column(name = "full_inst_name")
    private String fullInstName;
}

