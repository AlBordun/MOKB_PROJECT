package ru.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.dto.InstitutionsDTO;
import ru.dto.MKB10DTO;
import ru.services.InstitutionsService;

import java.util.List;

@RestController
@RequestMapping("/api/institution_name")
@RequiredArgsConstructor
public class InstitutionsController {

private final InstitutionsService institutionsService;

//    @GetMapping("/find_all_institutions")
//    public ResponseEntity<List<InstitutionsDTO>> findAllForms() {
//        List<InstitutionsDTO> institutionsDTOS = institutionsService.getAllInstitutions();
//        return ResponseEntity.ok(institutionsDTOS);
//    }

    @GetMapping("/names")
    public List<String> getInstitutionNames() {
        return institutionsService.getDistinctInstNames();
    }

}
