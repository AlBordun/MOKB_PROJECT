package ru.services;
import lombok.AllArgsConstructor;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ClassPathResource;
import ru.models.Entities.Form;
import ru.models.Entities.Patient;
import ru.repository.FormRepository;
import ru.repository.PatientRepository;

import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Optional;

@AllArgsConstructor
@Service
public class WordDocumentService {

    private final PatientRepository patientRepository;
    private final FormRepository formRepository;

    public byte[] createDocumentFromTemplate(Long patientId, Long formId) throws IOException {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found"));

        ClassPathResource resource = new ClassPathResource("C://Users//BordunAG//Desktop/Бланк_протокол.rtf");
        try (InputStream templateInputStream = resource.getInputStream();
             XWPFDocument doc = new XWPFDocument(templateInputStream);
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            replacePlaceholders(doc, patient, form);
            doc.write(out);
            return out.toByteArray();
        }
    }

    private void replacePlaceholders(XWPFDocument doc, Patient patient, Form form) {
        for (XWPFParagraph paragraph : doc.getParagraphs()) {
            replaceInParagraph(paragraph, patient, form);
        }
    }

    private void replaceInParagraph(XWPFParagraph paragraph, Patient patient, Form form) {
        for (XWPFRun run : paragraph.getRuns()) {
            Optional.ofNullable(run.getText(0))
                    .ifPresent(originalText -> {
                        String updatedText = replacePatientData(originalText, patient, form);
                        run.setText(updatedText, 0);
                        run.setFontFamily("Times New Roman");
                        run.setFontSize(11);
                    });
        }
    }

    public Resource exportPatientToWord(Long patientId, Long formId) throws IOException {
        byte[] docContent = createDocumentFromTemplate(patientId, formId);
        return new ByteArrayResource(docContent);
    }

    private String replacePatientData(String text, Patient patient, Form form) {
        return text.replace("{{firstName}}", patient.getFirstName())
                .replace("{{lastName}}", patient.getLastName())
                .replace("{{middleName}}", patient.getMiddleName())
                .replace("{{dateOfBirth}}", patient.getDateOfBirth().toString())
                .replace("{{registrationAddress}}", patient.getRegistrationAddress())
                .replace("{{actualAddress}}", patient.getActualAddress())
//                .replace("{{primaryDiagnosis}}", patient.getPrimaryDiagnosis())
//                .replace("{{diseaseCode}}", patient.getDiseaseCode())
//                .replace("{{commissionPurpose}}", patient.getCommissionPurpose())
//                .replace("{{referralMedicalOrg}}", patient.getReferralMedicalOrg())
//                .replace("{{protocolNumber}}", patient.getProtocolNumber())
//                .replace("{{commissionConclusion}}", patient.getCommissionConclusion())
                .replace("{{vmpProfile}}", form.getVmpGroup())
//                .replace("{{patientModel}}", patient.getPatientModel())
//                .replace("{{commissionChairman}}", patient.getCommissionChairman())
//                .replace("{{commissionCoChairmen}}", patient.getCommissionCoChairmen())
//                .replace("{{secretaries}}", patient.getSecretaries())
//                .replace("{{commissionMembers}}", patient.getCommissionMembers())
                .replace("{{snils}}", patient.getSnils());
//                .replace("{{insurancePolicy}}", patient.getInsurancePolicy())
//                .replace("{{passportSeries}}", patient.getPassportSeries())
//                .replace("{{passportNumber}}", patient.getPassportNumber());
    }
}
