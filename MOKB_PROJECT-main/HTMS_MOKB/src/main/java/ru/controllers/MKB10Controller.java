package ru.controllers;

import lombok.RequiredArgsConstructor;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.dto.MKB10DTO;
import ru.dto.PatientDTO;
import ru.models.Entities.MKB10;
import ru.services.MKB10Service;
import ru.services.PatientService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/mkb_10")
@RequiredArgsConstructor
public class MKB10Controller {

    private final MKB10Service mkb10Service;
    private static final Logger log = LogManager.getLogger(PatientService.class);

    private <T> List<T> limitListSize(List<T> list, int maxSize) {
        return list.stream().limit(maxSize).collect(Collectors.toList());
    }

//    @GetMapping("/find_all_mkb10s")
//    public ResponseEntity<List<MKB10DTO>> findAllMKBs() {
//        List<MKB10DTO> mkb10s = mkb10Service.getAllMKBs();
//        log.info("MKB10: {}", limitListSize(mkb10s, 10));
//        return ResponseEntity.ok(mkb10s);
//    }


//    @GetMapping("/codes")
//    public List<String> getMkbCodes() {
//        return mkb10Service.getDistinctMkbCodes();
//    }

    @GetMapping("/codes")
    public ResponseEntity<List<MKB10DTO>> findAllMKBs() {
        List<MKB10DTO> mkb10s = mkb10Service.getAllMkb10();
        return ResponseEntity.ok(mkb10s);
    }

}
