package ru.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import ru.dto.FormDTO;
import ru.models.Entities.Form;
import ru.models.Entities.Institutions;
import ru.models.Entities.MKB10;
import ru.models.Entities.Patient;

@Mapper(
        componentModel = "spring"
)
public interface FormMapper {

    FormMapper INSTANCE = Mappers.getMapper(FormMapper.class);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "date", source = "date")
    @Mapping(target = "formName", source = "formName")
    @Mapping(target = "profile", source = "profile")
    @Mapping(target = "route",  expression = "java(convertEmptyToNull(formDTO.getRoute()))")
    @Mapping(target = "vmpGroup", source = "vmpGroup")
    @Mapping(target = "disabilityCategory", source = "disabilityCategory")
    @Mapping(target = "needCategory", source = "needCategory")
    @Mapping(target = "paymentCategory", source = "paymentCategory")
    @Mapping(target = "signature", source = "signature")
    @Mapping(target = "dateOfHospitality", expression = "java(convertEmptyToNull(formDTO.getDateOfHospitality()))")
    @Mapping(target = "vmpOmsGroup", source = "vmpOmsGroup")
    @Mapping(target = "characterOfDisease", source = "characterOfDisease")
    @Mapping(target = "disability", source = "disability")
    @Mapping(target = "patientModel", expression = "java(convertEmptyToNull(formDTO.getPatientModel()))")
    @Mapping(target = "patient", source = "patientId")
    @Mapping(target = "institutions", source = "instName")
    @Mapping(target = "mkb10.id", source = "mkb10")
//@Mapping(target = "mkb10", ignore = true)
    Form dtoToForm(FormDTO formDTO);

    @Mapping(target = "id", source = "form.id")
    @Mapping(target = "date", source = "form.date")
    @Mapping(target = "formName", source = "form.formName")
    @Mapping(target = "instName", source = "institutions.id")
    @Mapping(target = "profile", source = "form.profile")
    @Mapping(target = "route", expression = "java(convertEmptyToNull(form.getRoute()))")
    @Mapping(target = "vmpGroup", source = "form.vmpGroup")
    @Mapping(target = "disabilityCategory", source = "form.disabilityCategory")
    @Mapping(target = "needCategory", source = "form.needCategory")
    @Mapping(target = "paymentCategory", source = "form.paymentCategory")
    @Mapping(target = "signature", source = "form.signature")
    @Mapping(target = "dateOfHospitality", expression = "java(convertEmptyToNull(form.getDateOfHospitality()))")
    @Mapping(target = "vmpOmsGroup", source = "form.vmpOmsGroup")
    @Mapping(target = "characterOfDisease", source = "form.characterOfDisease")
    @Mapping(target = "disability", source = "form.disability")
    @Mapping(target = "patientModel", expression = "java(convertEmptyToNull(form.getPatientModel()))")
    @Mapping(target = "patientId", source = "patient.id")
    @Mapping(target = "mkb10", source = "mkb10.id")
//@Mapping(target = "mkb10", ignore = true)
    FormDTO formToDto(Form form);

    @Mapping(target = "mkb10.id", source = "mkb10")
    Form toEntity(FormDTO formDTO);

//    @Mapping(target = "mkb10", source = "mkb10.id", qualifiedByName = "integerToMKB10")
//    @Mapping(target = "id", ignore = true)
    void updateEntity(FormDTO formDTO, @MappingTarget Form form);

    default String convertEmptyToNull(String input) {
        return (input == null || input.trim().isEmpty()) ? null : input;
    }

    // Пример методов для преобразования сущностей в ID и обратно
    default Patient patientFromId(Integer id) {
        if (id == null) {
            return null;
        }
        Patient patient = new Patient();
        patient.setId(id);
        return patient;
    }

    default Integer idFromPatient(Patient patient) {
        return patient == null ? null : patient.getId();
    }

    // Преобразование ID в сущность Institutions
    default Institutions institutionFromId(Integer id) {
        if (id == null) {
            return null;
        }
        Institutions institution = new Institutions();
        institution.setId(id);
        return institution;
    }

    // Преобразование сущности Institutions в ID
    default Integer idFromInstitution(Institutions institutions) {
        return institutions == null ? null : institutions.getId();
    }

    default MKB10 integerToMKB10(Integer id) {
        if (id == null) {
            return null;
        }
        MKB10 mkb10 = new MKB10();
        mkb10.setId(id);
        return mkb10;
    }

}
