package ru.controllers;

import lombok.AllArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.dto.FormDTO;
import ru.models.Entities.Form;
import ru.services.FormService;
import ru.services.PatientService;

import java.util.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/forms")
public class FormController {

    private final FormService formService;
    private static final Logger log = LogManager.getLogger(PatientService.class);
    @GetMapping("/{id}")
    public ResponseEntity<FormDTO> getFormById(@PathVariable Integer id) {
        FormDTO formDTO = formService.getFormById(id);
        return ResponseEntity.ok(formDTO);
    }

    @GetMapping("/last_id")
    public ResponseEntity<Integer> getLastFormId() {
        Integer lastId = formService.getLastFormId(); // Предполагается, что такой метод существует в formService
        return ResponseEntity.ok(lastId);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Void> updateForm(@PathVariable Integer id, @RequestBody FormDTO formDTO) {
        formDTO.setId(id); // Установка ID формы в DTO
        formService.processFormData(formDTO);
        return ResponseEntity.ok().build();
    }

//    @PostMapping("/submit")
//    public ResponseEntity<?> submitForm(@RequestBody FormDTO formData) {
//        formService.processFormData(formData);
//        return ResponseEntity.ok().build();
//    }

    @PostMapping("/submit")
    public ResponseEntity<FormDTO> submitForm(@RequestBody FormDTO formData) {
        FormDTO savedForm = formService.processFormData(formData);
        return ResponseEntity.ok(savedForm);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteFormById(@PathVariable Integer id) {
        formService.deleteFormById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/find_all")
    public ResponseEntity<List<FormDTO>> findAllForms(){
        List<FormDTO> forms = formService.getAllForms();
        return ResponseEntity.ok(forms);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<FormDTO>> getFormsByPatientId(@PathVariable Integer patientId) {
        List<FormDTO> forms = formService.getFormsByPatientId(patientId);
        return ResponseEntity.ok(forms);
    }
//
//    @GetMapping("/patient/{patientId}/form_names")
//    public ResponseEntity<List<String>> getFormNamesByPatientId(@PathVariable Integer patientId) {
//        List<String> formNames = formService.getFormNamesByPatientId(patientId);
//        return ResponseEntity.ok(formNames);
//    }

}
