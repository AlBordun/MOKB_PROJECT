package ru.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import ru.dto.PatientDTO;
import ru.models.Entities.Patient;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2023-12-04T22:12:28+0300",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 17.0.7 (Oracle Corporation)"
)
@Component
public class PatientMapperImpl implements PatientMapper {

    @Override
    public Patient dtoToPatient(PatientDTO patientDTO) {
        if ( patientDTO == null ) {
            return null;
        }

        Patient patient = new Patient();

        patient.setId( patientDTO.getId() );
        patient.setFirstName( patientDTO.getFirstName() );
        patient.setLastName( patientDTO.getLastName() );
        patient.setMiddleName( patientDTO.getMiddleName() );
        patient.setDateOfBirth( patientDTO.getDateOfBirth() );
        patient.setGender( patientDTO.getGender() );
        patient.setDocumentType( patientDTO.getDocumentType() );
        patient.setSnils( patientDTO.getSnils() );
        patient.setInsurancePolicy( patientDTO.getInsurancePolicy() );
        patient.setPassportSeries( patientDTO.getPassportSeries() );
        patient.setPassportNumber( patientDTO.getPassportNumber() );
        patient.setRegistrationAddress( patientDTO.getRegistrationAddress() );
        patient.setActualAddress( patientDTO.getActualAddress() );

        return patient;
    }

    @Override
    public Patient toEntity(PatientDTO patientDTO) {
        if ( patientDTO == null ) {
            return null;
        }

        Patient patient = new Patient();

        patient.setId( patientDTO.getId() );
        patient.setFirstName( patientDTO.getFirstName() );
        patient.setLastName( patientDTO.getLastName() );
        patient.setMiddleName( patientDTO.getMiddleName() );
        patient.setDateOfBirth( patientDTO.getDateOfBirth() );
        patient.setGender( patientDTO.getGender() );
        patient.setDocumentType( patientDTO.getDocumentType() );
        patient.setSnils( patientDTO.getSnils() );
        patient.setInsurancePolicy( patientDTO.getInsurancePolicy() );
        patient.setPassportSeries( patientDTO.getPassportSeries() );
        patient.setPassportNumber( patientDTO.getPassportNumber() );
        patient.setRegistrationAddress( patientDTO.getRegistrationAddress() );
        patient.setActualAddress( patientDTO.getActualAddress() );

        return patient;
    }

    @Override
    public PatientDTO toDto(Patient patient) {
        if ( patient == null ) {
            return null;
        }

        PatientDTO patientDTO = new PatientDTO();

        patientDTO.setId( patient.getId() );
        patientDTO.setFirstName( patient.getFirstName() );
        patientDTO.setLastName( patient.getLastName() );
        patientDTO.setMiddleName( patient.getMiddleName() );
        patientDTO.setDateOfBirth( patient.getDateOfBirth() );
        patientDTO.setGender( patient.getGender() );
        patientDTO.setDocumentType( patient.getDocumentType() );
        patientDTO.setSnils( patient.getSnils() );
        patientDTO.setInsurancePolicy( patient.getInsurancePolicy() );
        patientDTO.setPassportSeries( patient.getPassportSeries() );
        patientDTO.setPassportNumber( patient.getPassportNumber() );
        patientDTO.setRegistrationAddress( patient.getRegistrationAddress() );
        patientDTO.setActualAddress( patient.getActualAddress() );

        return patientDTO;
    }

    @Override
    public void updateEntity(PatientDTO patientDTO, Patient patient) {
        if ( patientDTO == null ) {
            return;
        }

        patient.setFirstName( patientDTO.getFirstName() );
        patient.setLastName( patientDTO.getLastName() );
        patient.setMiddleName( patientDTO.getMiddleName() );
        patient.setDateOfBirth( patientDTO.getDateOfBirth() );
        patient.setGender( patientDTO.getGender() );
        patient.setDocumentType( patientDTO.getDocumentType() );
        patient.setSnils( patientDTO.getSnils() );
        patient.setInsurancePolicy( patientDTO.getInsurancePolicy() );
        patient.setPassportSeries( patientDTO.getPassportSeries() );
        patient.setPassportNumber( patientDTO.getPassportNumber() );
        patient.setRegistrationAddress( patientDTO.getRegistrationAddress() );
        patient.setActualAddress( patientDTO.getActualAddress() );
    }
}
