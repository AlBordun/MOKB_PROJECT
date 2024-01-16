package ru.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import ru.dto.FormDTO;
import ru.dto.PatientDTO;
import ru.models.Entities.Form;
import ru.models.Entities.Patient;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;


@Mapper(
        componentModel = "spring"
)
public interface PatientMapper {

    PatientMapper INSTANCE = Mappers.getMapper(PatientMapper.class);

    @Mapping(target = "firstName", expression = "java(convertEmptyToNull(patientDTO.getFirstName()))")
    @Mapping(target = "lastName", expression = "java(convertEmptyToNull(patientDTO.getLastName()))")
    @Mapping(target = "middleName", expression = "java(convertEmptyToNull(patientDTO.getMiddleName()))")
// @Mapping(target = "dateOfBirth", expression = "java(convertStringToLocalDate(patientDTO.getDateOfBirth()))")
    @Mapping(target = "gender", source = "gender")
    @Mapping(target = "populationCategory", source = "populationCategory")
    @Mapping(target = "documentType", source = "documentType")
    @Mapping(target = "snils", expression = "java(convertEmptyToNull(patientDTO.getSnils()))")
    @Mapping(target = "insurancePolicy", expression = "java(convertEmptyToNull(patientDTO.getInsurancePolicy()))")
    @Mapping(target = "passportSeries", source = "passportSeries")
    @Mapping(target = "passportNumber", source = "passportNumber")
    @Mapping(target = "registrationAddress", expression = "java(convertEmptyToNull(patientDTO.getRegistrationAddress()))")
    @Mapping(target = "actualAddress", expression = "java(convertEmptyToNull(patientDTO.getActualAddress()))")
    @Mapping(target = "id", ignore = true)
    Patient dtoToPatient(PatientDTO patientDTO);

    @Mapping(target = "firstName", expression = "java(convertEmptyToNull(patientDTO.getFirstName()))")
    @Mapping(target = "lastName", expression = "java(convertEmptyToNull(patientDTO.getLastName()))")
    @Mapping(target = "middleName", expression = "java(convertEmptyToNull(patientDTO.getMiddleName()))")
// @Mapping(target = "dateOfBirth", expression = "java(convertStringToLocalDate(patientDTO.getDateOfBirth()))")
    @Mapping(target = "gender", source = "gender")
    @Mapping(target = "populationCategory", source = "populationCategory")
    @Mapping(target = "documentType", source = "documentType")
    @Mapping(target = "snils", expression = "java(convertEmptyToNull(patientDTO.getSnils()))")
    @Mapping(target = "insurancePolicy", expression = "java(convertEmptyToNull(patientDTO.getInsurancePolicy()))")
    @Mapping(target = "passportSeries", source = "passportSeries")
    @Mapping(target = "passportNumber", source = "passportNumber")
    @Mapping(target = "registrationAddress", expression = "java(convertEmptyToNull(patientDTO.getRegistrationAddress()))")
    @Mapping(target = "actualAddress", expression = "java(convertEmptyToNull(patientDTO.getActualAddress()))")
    @Mapping(target = "id", ignore = true)
    Patient toEntity(PatientDTO patientDTO);

    @Mapping(target = "firstName", expression = "java(convertEmptyToNull(patient.getFirstName()))")
    @Mapping(target = "lastName", expression = "java(convertEmptyToNull(patient.getLastName()))")
    @Mapping(target = "middleName", expression = "java(convertEmptyToNull(patient.getMiddleName()))")
// @Mapping(target = "dateOfBirth", expression = "java(convertLocalDateToString(patient.getDateOfBirth()))")
    @Mapping(target = "gender", source = "gender")
    @Mapping(target = "populationCategory", source = "populationCategory")
    @Mapping(target = "documentType", source = "documentType")
    @Mapping(target = "snils", expression = "java(convertEmptyToNull(patient.getSnils()))")
    @Mapping(target = "insurancePolicy", expression = "java(convertEmptyToNull(patient.getInsurancePolicy()))")
    @Mapping(target = "passportSeries", source = "passportSeries")
    @Mapping(target = "passportNumber", source = "passportNumber")
    @Mapping(target = "registrationAddress", expression = "java(convertEmptyToNull(patient.getRegistrationAddress()))")
    @Mapping(target = "actualAddress", expression = "java(convertEmptyToNull(patient.getActualAddress()))")
// @Mapping(target = "id", ignore = true)
// @Mapping(source = "populationCategory", target = "populationCategory")
    PatientDTO toDto(Patient patient);

    @Mapping(target = "id", ignore = true)
        // Игнорировать поле id при обновлении
    void updateEntity(PatientDTO patientDTO, @MappingTarget Patient patient);

    // Для строковых полей
    default String convertEmptyToNull(String input) {
        return (input == null || input.trim().isEmpty()) ? null : input;
    }

    // Для числовых полей
    default Integer convertEmptyToNullInteger(String input) {
        if (input == null || input.trim().isEmpty()) {
            return null;
        }
        try {
            return Integer.parseInt(input);
        } catch (NumberFormatException e) {
            return null; // или выбросить исключение, если это предпочтительнее
        }
    }

}


