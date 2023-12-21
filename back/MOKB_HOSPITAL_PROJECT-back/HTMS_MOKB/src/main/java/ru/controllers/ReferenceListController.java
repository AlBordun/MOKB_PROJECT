package ru.controllers;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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
//    @GetMapping("/ref_lists")
//    public ResponseEntity<List<ReferenceList>> getItemByTagAndText(@RequestParam Integer tag,
//                                                            @RequestParam(required = false) String text ) {
//        logger.info("Запрос getItemByTag с tag: {} и text: {}", tag, text);
//        List<ReferenceList> list;
//        if (text != null) {
//            list = referenceListService.getItemByTagAndText(tag,text);
//        }
//        else {
//            list = referenceListService.getItemByTag(tag);
//        }
//        return ResponseEntity.ok(list);
//        List<String> list = referenceListService.getItemByTagAndText(tag, text);
//        return ResponseEntity.ok(list);
//    }

    @GetMapping("/ref_listss")
    public ResponseEntity<List<String>> getItemByTag(@RequestParam Integer tag) {
        logger.info("Запрос getItemByTag с tag: {} ", tag);

        List<String> list = referenceListService.getItemByTag(tag);
        return ResponseEntity.ok(list);
    }

}
