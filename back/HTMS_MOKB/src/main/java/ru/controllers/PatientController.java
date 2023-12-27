package ru.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.dto.FormDTO;
import ru.dto.PatientAndFormDTO;
import ru.dto.PatientDTO;
import ru.models.Entities.Patient;
import ru.repository.PatientRepository;
import ru.services.PatientService;

import java.util.*;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private final PatientRepository patientRepository;

    @PostMapping
    public ResponseEntity<PatientDTO> createPatient(@RequestBody PatientDTO patientDTO) {
        PatientDTO createdPatient = patientService.createPatient(patientDTO);
        return ResponseEntity.ok(createdPatient);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PatientDTO> getPatient(@PathVariable Long id) {
        PatientDTO patient = patientService.getPatientById(id);
        return ResponseEntity.ok(patient);
    }

    @PostMapping("/save")
    public ResponseEntity<Patient> savePatientData(@RequestBody Patient patientData) {
        Patient savedPatient = patientRepository.save(patientData);
        return ResponseEntity.ok(savedPatient);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updatePatient(@PathVariable Long id, @RequestBody PatientDTO patientDTO) {
        patientService.updatePatient(id, patientDTO);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/save")
    public ResponseEntity<Void> savePatientAndDirection(@RequestBody PatientAndFormDTO dto) {
        patientService.savePatientAndDirection(dto.getPatient(), dto.getForm());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/find_all")
    public ResponseEntity<List<PatientDTO>> findAllForms() {
        List<PatientDTO> patients = patientService.getAllForms();
        return ResponseEntity.ok(patients);
    }
//    @GetMapping("/search")
//    public ResponseEntity<List<Patient>> searchPatient(@RequestParam String key,
//                                                       @RequestParam String operation,
//                                                       @RequestParam String value)
//    {
//        List<Patient> patients = patientService.searchPatients(key, operation, value);
//        return ResponseEntity.ok(patients);
//    }

}
