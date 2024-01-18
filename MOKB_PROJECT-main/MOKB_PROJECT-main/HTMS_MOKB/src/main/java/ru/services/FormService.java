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
import ru.repository.PatientRepository;

import java.util.*;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class FormService {

    private final FormRepository formRepository;
    private final FormMapper formMapper;
    private final MKB10Repository mkb10Repository;
    private final InstitutionsRepository institutionsRepository;
    private final PatientRepository patientRepository;

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

//    @Transactional
//    public FormDTO processFormData(FormDTO formDTO) {
//        log.info("Processing form data: {}", formDTO);
//        log.info("Начало обработки формы с patientId: {}", formDTO.getPatientId());
//        Form form = formDTO.getId() != null
//                ? formRepository.findById(formDTO.getId())
//                .orElseThrow(() -> new EntityNotFoundException("Form not found with ID: " + formDTO.getId()))
//                : new Form();
//
//        log.info("Form перед сохранением с patientId: {}", form.getPatient() != null ? form.getPatient().getId() : "null");
//        Form savedForm = formRepository.save(form);
//        log.info("Сохраненная форма с ID: {} и patientId: {}", savedForm.getId(), savedForm.getPatient() != null ? savedForm.getPatient().getId() : "null");
//
//        if (formDTO.getPatientId() != null) {
//            log.info("Setting patient ID: {}", formDTO.getPatientId());
//            // Поиск пациента по ID
//            Patient patient = patientRepository.findById(formDTO.getPatientId())
//                    .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + formDTO.getPatientId()));
//
//            // Установка найденного пациента в форму
//            form.setPatient(patient);
//        }
//        // Обновление остальных полей формы из formDTO
//        formMapper.updateEntity(formDTO, form);
//
//        // Установка MKB10 и Institution, если предоставлены идентификаторы
//        if (formDTO.getMkb10() != null) {
//            MKB10 mkb10 = mkb10Repository.findById(formDTO.getMkb10())
//                    .orElseThrow(() -> new EntityNotFoundException("MKB10 not found with ID: " + formDTO.getMkb10()));
//            form.setMkb10(mkb10);
//        }
//
//        if (formDTO.getInstName() != null) {
//            Institutions institutions = institutionsRepository.findById(formDTO.getInstName())
//                    .orElseThrow(() -> new EntityNotFoundException("Institution not found with ID: " + formDTO.getInstName()));
//            form.setInstitutions(institutions);
//        }
//
//        // Сохранение формы
//        Form savedForm1 = formRepository.save(form);
//        log.info("Saved form with ID: {}", savedForm1.getId());
//
//        // Преобразование сохраненной формы обратно в DTO
//        log.info("Форма сохранена с patientId: {}", formDTO.getPatientId());
//        return formMapper.formToDto(savedForm);
//    }

    @Transactional
    public FormDTO processFormData(FormDTO formDTO) {
        log.info("Processing form data: {}", formDTO);

        // Создание или получение сущности Form из FormDTO
        Form form = formDTO.getId() != null
                ? formRepository.findById(formDTO.getId())
                .orElseThrow(() -> new EntityNotFoundException("Form not found with ID: " + formDTO.getId()))
                : new Form();

        // Установка patientId, если он есть
        if (formDTO.getPatientId() != null) {
            log.info("Setting patient ID: {}", formDTO.getPatientId());
            Patient patient = patientRepository.findById(formDTO.getPatientId())
                    .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + formDTO.getPatientId()));
            form.setPatient(patient);
        }

        // Обновление остальных полей формы из formDTO
        formMapper.updateEntity(formDTO, form);

        // Сохранение формы
        log.info("Saving Form with patientId: {}", formDTO.getPatientId());
        Form savedForm = formRepository.save(form);
        log.info("Saved form with ID: {} and patientId: {}", savedForm.getId(), savedForm.getPatient() != null ? savedForm.getPatient().getId() : "null");

        return formMapper.formToDto(savedForm);
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
