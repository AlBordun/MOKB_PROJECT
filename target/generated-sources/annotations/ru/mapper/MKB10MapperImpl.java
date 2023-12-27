package ru.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import ru.dto.MKB10DTO;
import ru.models.Entities.MKB10;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2023-12-27T16:18:40+0300",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 17.0.9 (Oracle Corporation)"
)
@Component
public class MKB10MapperImpl implements MKB10Mapper {

    @Override
    public MKB10 dtoToMKB10(MKB10DTO MKB10DTO) {
        if ( MKB10DTO == null ) {
            return null;
        }

        MKB10 mKB10 = new MKB10();

        mKB10.setId( MKB10DTO.getId() );

        return mKB10;
    }

    @Override
    public MKB10 toEntity(MKB10DTO MKB10DTO) {
        if ( MKB10DTO == null ) {
            return null;
        }

        MKB10 mKB10 = new MKB10();

        mKB10.setId( MKB10DTO.getId() );

        return mKB10;
    }

    @Override
    public MKB10DTO toDto(MKB10 MKB10) {
        if ( MKB10 == null ) {
            return null;
        }

        MKB10DTO mKB10DTO = new MKB10DTO();

        mKB10DTO.setId( MKB10.getId() );

        return mKB10DTO;
    }

    @Override
    public void updateEntity(MKB10DTO MKB10DTO, MKB10 MKB10) {
        if ( MKB10DTO == null ) {
            return;
        }
    }
}
