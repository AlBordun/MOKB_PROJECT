package ru.models.Entities;

import jakarta.persistence.*;

import java.time.LocalDate;
@Entity
public class ReferenceList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code")
    private Integer code;

    @Column(name = "tag")
    private Integer tag;
    @Column(name = "text")
    private String text;


}
