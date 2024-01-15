package ru.controllers;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.dto.ReferenceListDTO;
import ru.models.Entities.ReferenceList;
import ru.services.ReferenceListService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/reference")
public class ReferenceListController {

    private final ReferenceListService referenceListService;
    private static Logger logger = LoggerFactory.getLogger(ReferenceListController.class);

    @GetMapping("/ref_listss")
    public ResponseEntity<List<String>> getItemByTag(@RequestParam Integer tag) {
        logger.info("Запрос getItemByTag с tag: {} ", tag);

        List<String> list = referenceListService.getItemByTag(tag);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/byTag")
    public ResponseEntity<List<ReferenceListDTO>> getReferenceDataByTag(@RequestParam Integer tag) {
        List<ReferenceListDTO> data = referenceListService.getReferenceDataByTag(tag);
        return ResponseEntity.ok(data);
    }

}
