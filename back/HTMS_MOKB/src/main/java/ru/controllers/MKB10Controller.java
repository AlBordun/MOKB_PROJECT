package ru.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.dto.MKB10DTO;
import ru.dto.PatientDTO;
import ru.models.Entities.MKB10;
import ru.services.MKB10Service;

import java.util.List;

@RestController
@RequestMapping("/api/mkb10s")
@RequiredArgsConstructor
public class MKB10Controller {

    private final MKB10Service mkb10Service;

    @GetMapping("/find_all_mkb10s")
    public ResponseEntity<List<MKB10DTO>> findAllForms() {
        List<MKB10DTO> mkb10s = mkb10Service.getAllMKBs();
        return ResponseEntity.ok(mkb10s);
    }


}
