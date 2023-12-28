package ru.controllers;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.dto.PatientAndFormDTO;
import ru.services.PrintingService;
import ru.services.WordDocumentService;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
public class WordExportController {

    private final WordDocumentService wordDocumentService;
    private final PrintingService printingService;
    private static final Logger logger = LoggerFactory.getLogger(WordExportController.class);
    @GetMapping("/word/{patient_id}/{form_id}")
    public ResponseEntity<Resource> exportPatientToWord(@PathVariable Long patientId,
                                                        @PathVariable Long formId) {
        try {
            Resource wordFile = wordDocumentService.exportPatientToWord(patientId,formId);
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=patient-document.docx")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM) // Указываем тип содержимого
                    .body(wordFile);
        } catch (Exception e) {
            // Изменяем возвращаемый тип на ResponseEntity<?>, чтобы покрыть оба случая
            return ResponseEntity.internalServerError()
                    .body(new ByteArrayResource(e.getMessage().getBytes())); // Возвращаем ошибку в виде Resource
        }
    }

    @PostMapping("/print/{patientId}/{formId}")
    public ResponseEntity<String> printPatientDocument(@PathVariable Long patientId,
                                                       @PathVariable Long formId) {
        try {
            printingService.printDocument(patientId,formId);
            return ResponseEntity.ok("Document sent to the printer successfully.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Failed to send the document to the printer: " + e.getMessage());
        }
    }

//    @PostMapping("/preview")
//    public ResponseEntity<Resource> previewDocument(@RequestBody PatientAndFormDTO patientAndFormDTO) {
//        try {
//            byte[] docContent = wordDocumentService.createDocumentFromTemplate(patientAndFormDTO.getPatient().getId(), patientAndFormDTO.getForm().getId());
//            Resource resource = new ByteArrayResource(docContent);
//
//            return ResponseEntity.ok()
//                    .header("Content-Disposition", "inline; filename=preview-document.pdf")
//                    .contentType(MediaType.APPLICATION_PDF)
//                    .body(resource);
//        } catch (Exception e) {
//            return ResponseEntity.internalServerError().build();
//        }
//    }

    @PostMapping("/preview")
    public ResponseEntity<Resource> previewDocument(@RequestBody PatientAndFormDTO patientAndFormDTO) {
        logger.info("Запрос на предпросмотр получен: {}", patientAndFormDTO);

        try {
            byte[] docContent = wordDocumentService.createDocumentFromTemplate(
                    patientAndFormDTO.getPatient().getId(), patientAndFormDTO.getForm().getId()
            );
            Resource resource = new ByteArrayResource(docContent);

            logger.info("Документ для предпросмотра успешно создан");

            return ResponseEntity.ok()
                    .header("Content-Disposition", "inline; filename=preview-document.pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);
        } catch (Exception e) {
            logger.error("Ошибка при создании документа для предпросмотра", e);
            return ResponseEntity.internalServerError().build();
        }
    }

}
