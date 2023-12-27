package ru.controllers;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.dto.FormDTO;
import ru.models.Entities.Form;
import ru.services.FormService;

import java.util.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/forms")
public class FormController {

    private final FormService formService;

    @GetMapping("/{id}")
    public ResponseEntity<FormDTO> getFormById(@PathVariable Long id) {
        FormDTO formDTO = formService.getFormById(id);
        return ResponseEntity.ok(formDTO);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Void> updateForm(@PathVariable Long id, @RequestBody FormDTO formDTO) {
        formDTO.setId(id); // Установка ID формы в DTO
        formService.processFormData(formDTO);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitForm(@RequestBody FormDTO formData) {
        formService.processFormData(formData);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteFormById(@PathVariable Long id) {
        formService.deleteFormById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/find_all")
    public ResponseEntity<List<FormDTO>> findAllForms(){
        List<FormDTO> forms = formService.getAllForms();
        return ResponseEntity.ok(forms);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<FormDTO>> getFormsByPatientId(@PathVariable Long patientId) {
        List<FormDTO> forms = formService.getFormsByPatientId(patientId);
        return ResponseEntity.ok(forms);
    }

}
