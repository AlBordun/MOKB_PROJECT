package ru.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PatientAndFormDTO {

    private PatientDTO patient;
    private FormDTO form;

}
