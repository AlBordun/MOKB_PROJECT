package ru.models.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@Data
@Entity
@Table(name = "mkb_10")
@JsonIgnoreProperties(ignoreUnknown = true)
public class MKB10 {

    @JsonProperty(value = "mkb_id")
    @Id
    @SequenceGenerator(
            name = "mkb_10_id_generator",
            sequenceName = "mkb_10_id_seq",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.AUTO ,
            generator = "mkb_10_id_generator"
    )
    @Column(name = "mkb_id")
    @Basic(optional = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private Integer id;

    @Column(name = "mkb_code")
    @Basic(optional = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String mkbCode;

    @Column(name = "mkb_name")
    @Basic(optional = true)
    @JsonIgnoreProperties(ignoreUnknown = true)
    private String mkbName;

    @OneToMany(mappedBy = "mkb10")
    private Set<Form> forms = new HashSet<>();

}
