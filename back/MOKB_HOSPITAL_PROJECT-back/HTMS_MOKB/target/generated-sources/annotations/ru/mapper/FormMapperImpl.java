package ru.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import ru.dto.FormDTO;
import ru.models.Entities.Form;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2023-12-07T19:17:40+0300",
    comments = "version: 1.4.2.Final, compiler: javac, environment: Java 17.0.7 (Oracle Corporation)"
)
@Component
public class FormMapperImpl implements FormMapper {

    @Override
    public Form dtoToForm(FormDTO formDTO) {
        if ( formDTO == null ) {
            return null;
        }

        Form form = new Form();

        form.setId( formDTO.getId() );
        form.setDate( formDTO.getDate() );
        form.setFormName( formDTO.getFormName() );
        form.setInstitution( formDTO.getInstitution() );
        form.setVmpGroup( formDTO.getVmpGroup() );
        form.setRoute( formDTO.getRoute() );
        form.setProfile( formDTO.getProfile() );
        form.setPatient( formDTO.getPatient() );

        return form;
    }

    @Override
    public FormDTO formToDto(Form form) {
        if ( form == null ) {
            return null;
        }

        FormDTO formDTO = new FormDTO();

        formDTO.setId( form.getId() );
        formDTO.setDate( form.getDate() );
        formDTO.setFormName( form.getFormName() );
        formDTO.setInstitution( form.getInstitution() );
        formDTO.setVmpGroup( form.getVmpGroup() );
        formDTO.setRoute( form.getRoute() );
        formDTO.setPatient( form.getPatient() );
        formDTO.setProfile( form.getProfile() );

        return formDTO;
    }

    @Override
    public Form toEntity(FormDTO formDTO) {
        if ( formDTO == null ) {
            return null;
        }

        Form form = new Form();

        form.setId( formDTO.getId() );
        form.setDate( formDTO.getDate() );
        form.setFormName( formDTO.getFormName() );
        form.setInstitution( formDTO.getInstitution() );
        form.setVmpGroup( formDTO.getVmpGroup() );
        form.setRoute( formDTO.getRoute() );
        form.setProfile( formDTO.getProfile() );
        form.setPatient( formDTO.getPatient() );

        return form;
    }

    @Override
    public void updateEntity(FormDTO formDTO, Form form) {
        if ( formDTO == null ) {
            return;
        }

        form.setDate( formDTO.getDate() );
        form.setFormName( formDTO.getFormName() );
        form.setInstitution( formDTO.getInstitution() );
        form.setVmpGroup( formDTO.getVmpGroup() );
        form.setRoute( formDTO.getRoute() );
        form.setProfile( formDTO.getProfile() );
        form.setPatient( formDTO.getPatient() );
    }
}
