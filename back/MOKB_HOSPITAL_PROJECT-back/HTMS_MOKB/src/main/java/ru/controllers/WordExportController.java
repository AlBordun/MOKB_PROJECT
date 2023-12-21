package ru.controllers;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.services.PrintingService;
import ru.services.WordDocumentService;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
public class WordExportController {

    private final WordDocumentService wordDocumentService;
    private final PrintingService printingService;

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

    @PostMapping("/print/{id}")
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
}
