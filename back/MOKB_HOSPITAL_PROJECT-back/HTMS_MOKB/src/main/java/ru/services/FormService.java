package ru.services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.dto.FormDTO;
import ru.exceptions.EntityNotFoundException;
import ru.mapper.FormMapper;
import ru.mapper.PatientMapper;
import ru.models.Entities.Form;
import ru.models.Entities.Patient;
import ru.repository.FormRepository;

import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class FormService {

    private final FormRepository formRepository;
    private final FormMapper formMapper;

    public FormDTO getFormById(Long id) {
        Form form = formRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Form not found with ID: " + id));
        return formMapper.formToDto(form);
    }

//    @Transactional
//    public void updateForm(Long id, FormDTO formDTO) {
//        Form form = formRepository.findById(id)
//                .orElseThrow(() -> new EntityNotFoundException("Form not found with ID: " + id));
//        formMapper.updateEntity(formDTO, form);
//        formRepository.save(form);
//    }

    @Transactional
    public void deleteFormById(Long id) {
        formRepository.deleteById(id);
    }

    @Transactional
    public void processFormData(FormDTO formDTO) {
        Form form;

        if (formDTO.getId() != null) {
            // Обновление существующей формы
            form = formRepository.findById(formDTO.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Form not found with ID: " + formDTO.getId()));
            formMapper.updateEntity(formDTO, form);
        } else {
            // Создание новой формы
            form = formMapper.toEntity(formDTO);
        }

        formRepository.save(form);
    }

    public List<FormDTO> getAllForms(){
        return formRepository.findAll().stream()
                .map(formMapper::formToDto)
                .collect(Collectors.toList());
    }

}
