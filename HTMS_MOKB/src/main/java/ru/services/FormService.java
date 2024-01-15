package ru.services;

import lombok.AllArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.dto.FormDTO;
import ru.dto.PatientDTO;
import ru.exceptions.EntityNotFoundException;
import ru.mapper.FormMapper;
import ru.mapper.PatientMapper;
import ru.models.Entities.Form;
import ru.models.Entities.Institutions;
import ru.models.Entities.MKB10;
import ru.models.Entities.Patient;
import ru.repository.FormRepository;
import ru.repository.InstitutionsRepository;
import ru.repository.MKB10Repository;

import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class FormService {

    private final FormRepository formRepository;
    private final FormMapper formMapper;
    private final MKB10Repository mkb10Repository;
    private final InstitutionsRepository institutionsRepository;

    private static final Logger log = LogManager.getLogger(PatientService.class);

    private <T> List<T> limitListSize(List<T> list, int maxSize) {
        return list.stream().limit(maxSize).collect(Collectors.toList());
    }

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
        Form form = formDTO.getId() != null
                ? formRepository.findById(formDTO.getId())
                .orElseThrow(() -> new EntityNotFoundException("Form not found with ID: " + formDTO.getId()))
                : new Form();

        // Обновление остальных полей формы из formDTO
        formMapper.updateEntity(formDTO, form);

        // Установка MKB10 и Institution, если предоставлены идентификаторы
        if (formDTO.getMkb10() != null) {
            MKB10 mkb10 = mkb10Repository.findById(formDTO.getMkb10())
                    .orElseThrow(() -> new EntityNotFoundException("MKB10 not found with ID: " + formDTO.getMkb10()));
            form.setMkb10(mkb10);
        }

        if (formDTO.getInstName() != null) {
            Institutions institutions = institutionsRepository.findById(formDTO.getInstName())
                    .orElseThrow(() -> new EntityNotFoundException("Institution not found with ID: " + formDTO.getInstName()));
            form.setInstitutions(institutions);
        }

        // Сохранение формы
        formRepository.save(form);
    }



    public List<FormDTO> getAllForms() {
        List<Form> patients = formRepository.findAll();
        log.info("Form: {}", limitListSize(patients, 10));  // Логирование списка пациентов из базы данных

        List<FormDTO> formDTOS = patients.stream()
                .map(formMapper::formToDto)
                .collect(Collectors.toList());
        log.info("Form DTOs: {}", limitListSize(formDTOS, 10));  // Логирование списка DTO после маппинга

        return formDTOS;
    }


//    public List<FormDTO> getAllForms(){
//        return formRepository.findAll().stream()
//                .map(formMapper::formToDto)
//                .collect(Collectors.toList());
//    }


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
