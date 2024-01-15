package ru.services;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.dto.FormDTO;
import ru.dto.PatientDTO;
import ru.mapper.FormMapper;
import ru.mapper.PatientMapper;
import ru.models.Entities.Form;
import ru.models.Entities.Patient;
import ru.repository.FormRepository;
import ru.repository.PatientRepository;
import ru.util.FormSpecification;
import ru.util.SearchCriteria;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository patientRepository;
    private final PatientMapper patientMapper;
    private final FormRepository formRepository;

    private static final Logger log = LogManager.getLogger(PatientService.class);

    public PatientDTO createPatient(PatientDTO patientDTO) {
        Patient patient = patientMapper.toEntity(patientDTO);
        Patient savedPatient = patientRepository.save(patient);
        return patientMapper.toDto(savedPatient);
    }

    public PatientDTO getPatientById(Integer id) {
        return patientRepository.findById(id)
                .map(patientMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found."));
    }
    @Transactional
    public void updatePatient(Integer patientId, PatientDTO patientDTO) {
        log.info("Updating patient with ID: {} with data: {}", patientId, patientDTO);
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + patientId));
        PatientMapper.INSTANCE.updateEntity(patientDTO, patient);
        patientRepository.save(patient);
    }

    @Transactional
    public void deletePatient(Integer patientId) {
        // Удаление пациента также удалит все его направления благодаря каскадным операциям
        patientRepository.deleteById(patientId);
    }

    @Transactional
    public void savePatientAndDirection(PatientDTO patientDTO, FormDTO directionDTO) {
        // Преобразование DTO в сущности
        Patient patient = PatientMapper.INSTANCE.toEntity(patientDTO);
        Form form = FormMapper.INSTANCE.dtoToForm(directionDTO);

        // Сохранение пациента
        patient = patientRepository.save(patient);

        // Установка связи и сохранение направления
        form.setPatient(patient);
        formRepository.save(form);
    }

    private <T> List<T> limitListSize(List<T> list, int maxSize) {
        return list.stream().limit(maxSize).collect(Collectors.toList());
    }

    public List<PatientDTO> getAllForms() {
        List<Patient> patients = patientRepository.findAll();
        log.info("Patients: {}", limitListSize(patients, 10));  // Логирование списка пациентов из базы данных

        List<PatientDTO> patientDTOs = patients.stream()
                .map(patientMapper::toDto)
                .collect(Collectors.toList());
        log.info("Patients DTOs: {}", limitListSize(patientDTOs, 10));  // Логирование списка DTO после маппинга

        return patientDTOs;
    }
//    public List<PatientDTO> getAllForms(){
//
//        return patientRepository.findAll().stream()
//                .map(patientMapper::toDto)
//                .collect(Collectors.toList());
//
//    }

//    public List<Patient> searchPatients(String key,String operation, Object value) {
//        FormSpecification specification = new FormSpecification(new SearchCriteria( key, operation, value));
//        return patientRepository.findAll(specification);
//    }

}