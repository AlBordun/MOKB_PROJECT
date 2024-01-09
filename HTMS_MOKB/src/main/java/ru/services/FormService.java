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

    public FormDTO getFormById(Integer id) {
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
    public void deleteFormById(Integer id) {
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

    public List<FormDTO> getFormsByPatientId(Integer patientId) {
        List<Form> forms = formRepository.findByPatientId(patientId);
        return forms.stream()
                .map(formMapper::formToDto)
                .collect(Collectors.toList());
    }

    public List<String> getFormNamesByPatientId(Integer patientId) {
        return formRepository.findFormNamesByPatientId(patientId);
    }

    public Integer getLastFormId() {
        return formRepository.findTopByOrderByIdDesc()
                .map(Form::getId)
                .orElse(0); // Возвращает 0, если формы отсутствуют
    }

}
