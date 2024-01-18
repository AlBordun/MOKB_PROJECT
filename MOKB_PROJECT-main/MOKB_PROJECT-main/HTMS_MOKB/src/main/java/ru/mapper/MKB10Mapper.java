package ru.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import ru.dto.MKB10DTO;
import ru.dto.PatientDTO;
import ru.models.Entities.MKB10;
import ru.models.Entities.Patient;

@Mapper(
        componentModel = "spring"
)
public interface MKB10Mapper {

    MKB10Mapper INSTANCE = Mappers.getMapper(MKB10Mapper.class);

    MKB10 dtoToMKB10(MKB10DTO MKB10DTO);

    MKB10 toEntity(MKB10DTO MKB10DTO);

//    @Mapping(source = "populationCategory", target = "populationCategory")
    MKB10DTO toDto(MKB10 MKB10);

    @Mapping(target = "id", ignore = true)
        // Игнорировать поле id при обновлении
    void updateEntity(MKB10DTO MKB10DTO, @MappingTarget MKB10 MKB10);


}
