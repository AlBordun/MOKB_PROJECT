package ru.services;

import org.docx4j.Docx4J;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;
import java.io.File;
import java.io.FileOutputStream;

public class DocxToPdfConverter {
    public static void main(String[] args) {
        try {
            // Загружаем документ Word
            WordprocessingMLPackage wordMLPackage = WordprocessingMLPackage.load(new File("C:\\Users\\BordunAG\\Desktop\\Бланк_протокол.docx"));

            // Конвертируем в PDF
            File outputFile = new File("C:\\Users\\BordunAG\\Desktop\\document.pdf");
            Docx4J.toPDF(wordMLPackage, new FileOutputStream(outputFile));

            System.out.println("Документ успешно сконвертирован в PDF.");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
