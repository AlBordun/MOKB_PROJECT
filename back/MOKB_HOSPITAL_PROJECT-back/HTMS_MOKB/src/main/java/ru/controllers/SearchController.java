package ru.controllers;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.services.FormService;
import ru.services.PatientService;

@AllArgsConstructor
@RestController
@RequestMapping ("/api/search")
public class SearchController {

    private final PatientService patientService;
    private final FormService referralService;

//    public List<Patient> searchPatients (@RequestParam String query) {
//        return patientService.searchByQuery(query);
//    }

}
