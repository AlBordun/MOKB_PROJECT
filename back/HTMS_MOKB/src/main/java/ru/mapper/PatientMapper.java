package ru.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import ru.dto.FormDTO;
import ru.dto.PatientDTO;
import ru.models.Entities.Form;
import ru.models.Entities.Patient;


@Mapper(
        componentModel = "spring"
)
public interface PatientMapper {

    PatientMapper INSTANCE = Mappers.getMapper(PatientMapper.class);

    Patient dtoToPatient(PatientDTO patientDTO);

    Patient toEntity(PatientDTO patientDTO);

    @Mapping(source = "populationCategory", target = "populationCategory")
    PatientDTO toDto(Patient patient);

    @Mapping(target = "id", ignore = true)
        // Игнорировать поле id при обновлении
    void updateEntity(PatientDTO patientDTO, @MappingTarget Patient patient);


    //    @Mapping(target = "populationCategory", expression = "java(patient.getPopulationCategory().name())")
//    @Mapping(target = "gender", expression = "java(patient.getGender().name())")
//    @Mapping(target = "documentType", expression = "java(patient.getDocumentType().name())")
//    @Mapping(target = "cityIndex", expression = "java(patient.getCityIndex().name())")
//    @Mapping(target = "benefitCategoryCode", expression = "java(patient.getBenefitCategoryCode().name())")
//    @Mapping(target = "disability", expression = "java(patient.getDisability().name())")
//    @Mapping(target = "medicalProfile", expression = "java(patient.getMedicalProfile().name())")
//    PatientDTO toDTO(Patient patient);


//    @Mapping(target = "populationCategory", expression = "java(patient.getPopulationCategory().name())")
//    @Mapping(target = "gender", expression = "java(patient.getGender().name())")
//    @Mapping(target = "documentType", expression = "java(patient.getDocumentType().name())")
//    @Mapping(target = "cityIndex", expression = "java(patient.getCityIndex().name())")
//    @Mapping(target = "benefitCategoryCode", expression = "java(patient.getBenefitCategoryCode().name())")
//    @Mapping(target = "disabilityCategory", expression = "java(patient.getDisability().name())")
//    @Mapping(target = "medicalProfile", expression = "java(patient.getMedicalProfile().name())")

//    default Patient toEntity(PatientDTO patientDTO);
//    {
//        if (patientDTO == null) {
//            return null;
//        }
//
//        Patient patient = new Patient();
//
//        if (patientDTO.getPopulationCategory() != null) {
//            patient.setPopulationCategory(NoBackEndListsEnum.PopulationCategory.valueOf(patientDTO.getPopulationCategory()));
//        }
//        if (patientDTO.getGender() != null) {
//            patient.setGender(NoBackEndListsEnum.Gender.valueOf(patientDTO.getGender()));
//        }
//        if (patientDTO.getDocumentType() != null) {
//            patient.setDocumentType(NoBackEndListsEnum.DocumentType.valueOf(patientDTO.getDocumentType()));
//        }
//        if (patientDTO.getCityIndex() != null) {
//            patient.setCityIndex(BackEndListsEnum.valueOf(patientDTO.getCityIndex()));
//        }
//        if (patientDTO.getBenefitCategoryCode() != null) {
//            patient.setBenefitCategoryCode(BackEndListsEnum.valueOf(patientDTO.getBenefitCategoryCode()));
//        }
//        if (patientDTO.getDisability() != null) {
//            patient.setDisabilityCategory(BackEndListsEnum.valueOf(patientDTO.getDisability()));
//        }
//        if (patientDTO.getMedicalProfile() != null) {
//            patient.setMedicalProfile(BackEndListsEnum.valueOf(patientDTO.getMedicalProfile()));
//        }

    // Обработка других полей PatientDTO

//        return patient;
//    }

//    default void updateEntity(@MappingTarget Patient patient, PatientDTO patientDTO) {
//
//        if (patientDTO.getPopulationCategory() != null) {
//            patient.setPopulationCategory(NoBackEndListsEnum.PopulationCategory.valueOf(patientDTO.getPopulationCategory()));
//        }
//        if (patientDTO.getGender() != null) {
//            patient.setGender(NoBackEndListsEnum.Gender.valueOf(patientDTO.getGender()));
//        }
//        if (patientDTO.getDocumentType() != null) {
//            patient.setDocumentType(NoBackEndListsEnum.DocumentType.valueOf(patientDTO.getDocumentType()));
//        }
//        if (patientDTO.getCityIndex() != null) {
//            patient.setCityIndex(BackEndListsEnum.valueOf(patientDTO.getCityIndex()));
//        }
//        if (patientDTO.getBenefitCategoryCode() != null) {
//            patient.setBenefitCategoryCode(BackEndListsEnum.valueOf(patientDTO.getBenefitCategoryCode()));
//        }
//        if (patientDTO.getDisability() != null) {
//            patient.setDisabilityCategory(BackEndListsEnum.valueOf(patientDTO.getDisability()));
//        }
//        if (patientDTO.getMedicalProfile() != null) {
//            patient.setMedicalProfile(BackEndListsEnum.valueOf(patientDTO.getMedicalProfile()));
//        }
//    }
}

