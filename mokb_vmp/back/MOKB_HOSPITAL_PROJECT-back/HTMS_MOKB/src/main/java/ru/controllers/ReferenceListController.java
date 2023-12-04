package ru.controllers;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.models.Entities.ReferenceList;
import ru.services.ReferenceListService;

import java.util.*;

@AllArgsConstructor
@RestController
@RequestMapping("/api/reference")
public class ReferenceListController {

    private final ReferenceListService referenceListService;

    @GetMapping("/ref_lists")
    public ResponseEntity<List<ReferenceList>> getItemByTag(@RequestParam Integer tag) {

        List<ReferenceList> list = referenceListService.getItemByTag(tag);
        return ResponseEntity.ok(list);

    }
}
