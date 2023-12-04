package ru.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import ru.dto.FormDTO;
import ru.models.Entities.Form;

@Mapper(
        componentModel = "spring"
)
public interface FormMapper {

    FormMapper INSTANCE = Mappers.getMapper(FormMapper.class);

    Form dtoToForm(FormDTO formDTO);

    FormDTO formToDto(Form form);

    Form toEntity(FormDTO formDTO);

    @Mapping(target = "id", ignore = true)
        // Игнорировать поле id при обновлении
    void updateEntity(FormDTO formDTO, @MappingTarget Form form);

}
