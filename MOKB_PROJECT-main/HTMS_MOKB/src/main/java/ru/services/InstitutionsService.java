package ru.services;

import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.dto.InstitutionsDTO;
import ru.dto.MKB10DTO;
import ru.mapper.InstitutionsMapper;
import ru.models.Entities.Institutions;
import ru.models.Entities.MKB10;
import ru.repository.InstitutionsRepository;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class InstitutionsService {

    private final InstitutionsRepository institutionsRepository;
    private final InstitutionsMapper institutionsMapper;
    private static Logger logger = LoggerFactory.getLogger(InstitutionsService.class);

    private <T> List<T> limitListSize(List<T> list, int maxSize) {
        return list.stream().limit(maxSize).collect(Collectors.toList());
    }

//    public List<InstitutionsDTO> getAllInstitutions() {
//        List<Institutions> institutions = institutionsRepository.findAll();
//        logger.info("Institutions: {}", limitListSize(institutions, 10));  // Логирование списка пациентов из базы данных
//        List<InstitutionsDTO> institutionsDTOS = institutions.stream()
//                .map(institutionsMapper::toDto)
//                .collect(Collectors.toList());
//        logger.info("Patients DTOs: {}", limitListSize(institutionsDTOS, 10));  // Логирование списка DTO после маппинга
//
//        return institutionsDTOS;
//    }

//    public List<String> getDistinctInstNames() {
//        return institutionsRepository.findDistinctInstNames();
//    }

//    public List<Institutions> getAllInstitutions() {
//        return institutionsRepository.findAll();
//    }

    public List<InstitutionsDTO> getAllInstitutions() {
        return institutionsRepository.findAll().stream()
                .map(institutionsMapper::toDto)
                .collect(Collectors.toList());
    }

}
