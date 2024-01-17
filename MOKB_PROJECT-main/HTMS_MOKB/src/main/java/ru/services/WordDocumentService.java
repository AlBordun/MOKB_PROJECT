package ru.services;

import lombok.AllArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.poi.xwpf.usermodel.*;
import org.docx4j.Docx4J;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.core.io.ClassPathResource;
import ru.controllers.WordExportController;
import ru.models.Entities.Form;
import ru.models.Entities.Patient;
import ru.repository.FormRepository;
import ru.repository.PatientRepository;
import org.apache.poi.xwpf.usermodel.XWPFDocument;

import java.util.*;
import java.io.*;
import java.util.Optional;

@AllArgsConstructor
@Service
public class WordDocumentService {

    private final PatientRepository patientRepository;
    private final FormRepository formRepository;

    private static final Logger logger = LoggerFactory.getLogger(WordExportController.class);

    public byte[] createDocumentFromTemplate(Integer patientId, Integer formId) throws IOException {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Form form = null;
        if (formId != null) {
            form = formRepository.findById(formId)
                    .orElseThrow(() -> new RuntimeException("Form not found"));
        }

        logger.info("Patient data: {}", patient);
        if (form != null) {
            logger.info("Form data: {}", form);
        } else {
            logger.info("Form ID is null, proceeding without form data.");
        }

        File file = new File("C:\\Users\\BordunAG\\Desktop\\Бланк_протокол.docx");
        if (!file.exists()) {
            throw new FileNotFoundException("File not found: " + file.getPath());
        }

        try (FileInputStream templateInputStream = new FileInputStream(file);
             XWPFDocument doc = new XWPFDocument(templateInputStream);
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            replacePlaceholders(doc, patient, form);
            doc.write(out);
            return out.toByteArray();
        }
    }

    public byte[] convertDocxToPdf(byte[] docxContent) throws Exception {
        try (ByteArrayInputStream docxInputStream = new ByteArrayInputStream(docxContent);
             ByteArrayOutputStream pdfOutputStream = new ByteArrayOutputStream()) {

            WordprocessingMLPackage wordMLPackage = WordprocessingMLPackage.load(docxInputStream);
            Docx4J.toPDF(wordMLPackage, pdfOutputStream);
            return pdfOutputStream.toByteArray();
        }
    }

    //    public byte[] convertDocxToPdf(byte[] docxContent) throws Exception {
//        try (ByteArrayInputStream docxInputStream = new ByteArrayInputStream(docxContent);
//             ByteArrayOutputStream pdfOutputStream = new ByteArrayOutputStream()) {
//
//            WordprocessingMLPackage wordMLPackage = WordprocessingMLPackage.load(docxInputStream);
//            Docx4J.toPDF(wordMLPackage, pdfOutputStream);
//            return pdfOutputStream.toByteArray();
//        }
//    }



    private void replacePlaceholders(XWPFDocument doc, Patient patient, Form form) {
        for (XWPFParagraph paragraph : doc.getParagraphs()) {
            replaceInParagraph(paragraph, patient, form);
        }
        logger.info("Placeholders replacement completed");
    }

//    private void replaceInParagraph(XWPFParagraph paragraph, Patient patient, Form form) {
//        // Сохранение исходного выравнивания абзаца
//        ParagraphAlignment alignment = paragraph.getAlignment();
//
//        StringBuilder sb = new StringBuilder();
//        for (XWPFRun run : paragraph.getRuns()) {
//            String text = run.getText(0);
//            if (text != null) {
//                sb.append(text);
//            }
//        }
//
//        // Замена плейсхолдеров в собранном тексте
//        String updatedText = replacePatientData(sb.toString(), patient, form);
//
//        // Удаление всех старых XWPFRun
//        int runsCount = paragraph.getRuns().size();
//        for (int i = runsCount - 1; i >= 0; i--) {
//            paragraph.removeRun(i);
//        }
//
//        // Добавление нового текста
//        XWPFRun newRun = paragraph.createRun();
//        newRun.setText(updatedText);
//        newRun.setFontFamily("Times New Roman");
////        newRun.setFontSize(11);
//
//        // Восстановление исходного выравнивания
//        paragraph.setAlignment(alignment);
//
//        for (XWPFRun run : paragraph.getRuns()) {
//            if (shouldBeBold(paragraph.getText())) { // Эта функция должна определить, должен ли текст быть жирным
//                run.setBold(true);
//            }
//        }
//
////        logger.info("Paragraph updated: '{}'", updatedText);
//    }

    private void replaceInParagraph(XWPFParagraph paragraph, Patient patient, Form form) {
        ParagraphAlignment alignment = paragraph.getAlignment();
        boolean isFirstBold = false;  // Флаг для отслеживания первого совпадения

        // Собираем текст из всех runs
        StringBuilder sb = new StringBuilder();
        for (XWPFRun run : paragraph.getRuns()) {
            String text = run.getText(0);
            if (text != null) {
                sb.append(text);
            }
        }

        // Замена плейсхолдеров в собранном тексте
        String updatedText = replacePatientData(sb.toString(), patient, form);

        // Очищаем все runs в абзаце
        removeAllRuns(paragraph);

        // Создаем новый run с обновленным текстом
        XWPFRun newRun = paragraph.createRun();
        newRun.setText(updatedText);
        newRun.setFontFamily("Times New Roman");

        // Применяем жирный шрифт к первому совпадению
        if (!isFirstBold && shouldBeBold(updatedText)) {
            newRun.setBold(true);
            isFirstBold = true; // Устанавливаем флаг после применения жирного шрифта
        }

        paragraph.setAlignment(alignment);
    }


//    private void replaceInParagraph(XWPFParagraph paragraph, Patient patient, Form form) {
//        // Сохраняем исходное выравнивание абзаца
//        ParagraphAlignment alignment = paragraph.getAlignment();
//
//        // Обрабатываем каждый run в абзаце
//        for (XWPFRun run : paragraph.getRuns()) {
//            String text = run.getText(0);
//            if (text != null) {
//                // Жирный шрифт для определенных строк
//                if (shouldBeBold(text)) {
//                    run.setBold(true);
//                }
//                // Замена текста в плейсхолдерах
//                String updatedText = replacePatientData(text, patient, form);
//                run.setText(updatedText, 0); // 0 означает замену всего текста в run
//            }
//        }
//
//        // Восстанавливаем выравнивание абзаца
//        paragraph.setAlignment(alignment);
//    }

    private boolean shouldBeBold(String text) {
        // Ваша логика для определения, должен ли текст быть жирным
        // Например, вы можете проверить, содержит ли текст определенные ключевые слова или фразы
        return text.contains("Министерство здравоохранения Мурманской области") ||
                text.contains("Мурманск ,  ГОБУЗ \"МОКБ им. П.А. Баяндина\"") ||
                text.contains("комиссии по отбору пациентов для оказания высокотехнологичной медицинской помощи по") ||
                text.contains("перечню видов, не включенных в базовую программу обязательного медицинского страхования,") ||
                text.contains("Министерства здравоохранения Мурманской области");
    }

    private void removeAllRuns(XWPFParagraph paragraph) {
        int runsCount = paragraph.getRuns().size();
        for (int i = runsCount - 1; i >= 0; i--) {
            paragraph.removeRun(i);
        }
    }

    private void addRunsToParagraph(XWPFParagraph paragraph, String text, List<XWPFRun> originalRuns) {
        XWPFRun newRun = paragraph.createRun();

        // Примерное сохранение стилей (нужно доработать под ваши требования)
        if (!originalRuns.isEmpty()) {
            XWPFRun templateRun = originalRuns.get(0);
            newRun.setBold(templateRun.isBold());
            newRun.setFontFamily(templateRun.getFontFamily());
            // Здесь можно добавить другие стили, как необходимо
        }

        newRun.setText(text);
    }

    private void addFormattedParagraph(XWPFDocument doc, String text, boolean isBold) {
        XWPFParagraph paragraph = doc.createParagraph();
        XWPFRun run = paragraph.createRun();
        run.setText(text);
        run.setBold(isBold);
        // Здесь вы можете добавить дополнительное форматирование, если это необходимо
    }


    // Метод для создания отформатированного документа
    public byte[] createFormattedDocument() throws IOException {
        try (XWPFDocument doc = new XWPFDocument();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            addFormattedParagraph(doc, "Министерство здравоохранения Мурманской области", true);
//            addFormattedParagraph(doc, "ПРОТОКОЛ", true);
            addFormattedParagraph(doc, "комиссии по отбору пациентов для оказания высокотехнологичной медицинской помощи по\n" +
                    "перечню видов, не включенных в базовую программу обязательного медицинского страхования,\n" +
                    "Министерства здравоохранения Мурманской области\n", true);
            // Добавьте дополнительные абзацы по мере необходимости

            doc.write(out);
            return out.toByteArray();
        }
    }

//    public Resource exportPatientToWord(Integer patientId, Integer formId) throws IOException {
//        byte[] docContent = createDocumentFromTemplate(patientId, formId);
//        return new ByteArrayResource(docContent);
//    }

private String replacePatientData(String text, Patient patient, Form form) {
    String result = text.replace("{{first_name}}", patient.getFirstName())
            .replace("{{last_name}}", patient.getLastName())
            .replace("{{middle_name}}", patient.getMiddleName())
            .replace("{{actual_address}}", patient.getActualAddress())
            .replace("{{registration_address}}", patient.getRegistrationAddress())
            .replace("{{date_of_birth}}", patient.getDateOfBirth().toString());

    if (form != null) {
        result = result.replace("{{form_name}}", form.getFormName().toString())
                .replace("{{mkb_10}}", form.getFormName().toString())
                .replace("{{profile}}", form.getProfile().toString())
                .replace("{{vmp_group}}", form.getVmpGroup().toString())
                .replace("{{vmpoms_group}}", form.getVmpOmsGroup().toString())
                .replace("{{patient_model}}", form.getPatientModel());
        return result;
    }
    return result;
}

}