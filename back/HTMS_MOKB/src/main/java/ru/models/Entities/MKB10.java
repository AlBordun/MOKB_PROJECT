package ru.models.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@Data
@Entity
@Table(name = "mkb_10")
@JsonIgnoreProperties(ignoreUnknown = true)
public class MKB10 {

    @JsonProperty(value = "mkb_id")
    @Id
    @SequenceGenerator(
            name = "mkb_id",
            sequenceName = "mkb_id",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.IDENTITY,
            generator = "mkb_id"
    )
    @Column(name = "mkb_id")
    private Long id;

    @Column(name = "mkb_code")
    private String instName;

    @Column(name = "mkb_name")
    private Integer city;

}
