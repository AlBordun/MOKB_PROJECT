package ru.services;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class PrintingService {

    private final WordDocumentService wordExportService;

//    public void printDocument(Integer patientId, Integer formId) throws IOException {
//        Resource document = wordExportService.exportPatientToWord(patientId, formId);
//    }
}