package ru.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import ru.dto.InstitutionsDTO;
import ru.dto.MKB10DTO;
import ru.models.Entities.Institutions;
import ru.models.Entities.MKB10;
@Mapper(
        componentModel = "spring"
)
public interface InstitutionsMapper {

    Institutions dtoToMKB10(InstitutionsDTO InstitutionsDTO);

    Institutions toEntity(InstitutionsDTO InstitutionsDTO);

    //    @Mapping(source = "populationCategory", target = "populationCategory")
    InstitutionsDTO toDto(Institutions Institutions);

    @Mapping(target = "id", ignore = true)
        // Игнорировать поле id при обновлении
    void updateEntity(InstitutionsDTO InstitutionsDTO, @MappingTarget Institutions Institutions);

}
