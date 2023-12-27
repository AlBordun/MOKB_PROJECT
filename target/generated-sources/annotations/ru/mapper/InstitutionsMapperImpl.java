package ru.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import ru.dto.InstitutionsDTO;
import ru.models.Entities.Institutions;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2023-12-27T16:18:40+0300",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 17.0.9 (Oracle Corporation)"
)
@Component
public class InstitutionsMapperImpl implements InstitutionsMapper {

    @Override
    public Institutions dtoToMKB10(InstitutionsDTO InstitutionsDTO) {
        if ( InstitutionsDTO == null ) {
            return null;
        }

        Institutions institutions = new Institutions();

        institutions.setId( InstitutionsDTO.getId() );
        institutions.setInstName( InstitutionsDTO.getInstName() );
        institutions.setCity( InstitutionsDTO.getCity() );
        institutions.setInstAddress( InstitutionsDTO.getInstAddress() );
        institutions.setFullInstName( InstitutionsDTO.getFullInstName() );

        return institutions;
    }

    @Override
    public Institutions toEntity(InstitutionsDTO InstitutionsDTO) {
        if ( InstitutionsDTO == null ) {
            return null;
        }

        Institutions institutions = new Institutions();

        institutions.setId( InstitutionsDTO.getId() );
        institutions.setInstName( InstitutionsDTO.getInstName() );
        institutions.setCity( InstitutionsDTO.getCity() );
        institutions.setInstAddress( InstitutionsDTO.getInstAddress() );
        institutions.setFullInstName( InstitutionsDTO.getFullInstName() );

        return institutions;
    }

    @Override
    public InstitutionsDTO toDto(Institutions Institutions) {
        if ( Institutions == null ) {
            return null;
        }

        InstitutionsDTO institutionsDTO = new InstitutionsDTO();

        institutionsDTO.setId( Institutions.getId() );
        institutionsDTO.setInstName( Institutions.getInstName() );
        institutionsDTO.setCity( Institutions.getCity() );
        institutionsDTO.setInstAddress( Institutions.getInstAddress() );
        institutionsDTO.setFullInstName( Institutions.getFullInstName() );

        return institutionsDTO;
    }

    @Override
    public void updateEntity(InstitutionsDTO InstitutionsDTO, Institutions Institutions) {
        if ( InstitutionsDTO == null ) {
            return;
        }

        Institutions.setInstName( InstitutionsDTO.getInstName() );
        Institutions.setCity( InstitutionsDTO.getCity() );
        Institutions.setInstAddress( InstitutionsDTO.getInstAddress() );
        Institutions.setFullInstName( InstitutionsDTO.getFullInstName() );
    }
}
