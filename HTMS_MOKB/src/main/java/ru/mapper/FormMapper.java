package ru.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import ru.dto.FormDTO;
import ru.models.Entities.Form;
import ru.models.Entities.Institutions;
import ru.models.Entities.Patient;

@Mapper(
        componentModel = "spring"
)
public interface FormMapper {

    FormMapper INSTANCE = Mappers.getMapper(FormMapper.class);
//    @Mapping(target = "formName", expression = "java(convertEmptyToNull(formDTO.getFormName()))")
//    @Mapping(target = "vmpGroup", expression = "java(convertEmptyToNull(formDTO.getVmpGroup()))")
//    @Mapping(target = "route", expression = "java(convertEmptyToNull(formDTO.getRoute()))")
//    @Mapping(target = "profile", expression = "java(convertEmptyToNull(formDTO.getProfile()))")
    @Mapping(target = "institutions", source = "institution")
    @Mapping(target = "patient", source = "patient")
    Form dtoToForm(FormDTO formDTO);

    @Mapping(target = "formName", source = "form.formName")
    @Mapping(target = "vmpGroup", source = "form.vmpGroup")
    @Mapping(target = "route", source = "form.route")
    @Mapping(target = "profile", source = "form.profile")
    @Mapping(target = "institution", source = "institutions")
    @Mapping(target = "patient", source = "patient")
    FormDTO formToDto(Form form);

    Form toEntity(FormDTO formDTO);

    @Mapping(target = "id", ignore = true)
        // Игнорировать поле id при обновлении
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

}
