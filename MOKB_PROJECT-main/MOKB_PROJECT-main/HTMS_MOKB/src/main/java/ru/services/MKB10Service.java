package ru.services;

import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.dto.MKB10DTO;
import ru.dto.PatientDTO;
import ru.mapper.MKB10Mapper;
import ru.models.Entities.MKB10;
import ru.models.Entities.Patient;
import ru.repository.MKB10Repository;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class MKB10Service {

    private final MKB10Repository mkb10Repository;
    private final MKB10Mapper mkb10Mapper;
    private static Logger logger = LoggerFactory.getLogger(MKB10Service.class);

    private <T> List<T> limitListSize(List<T> list, int maxSize) {
        return list.stream().limit(maxSize).collect(Collectors.toList());
    }

//    public List<String> getDistinctMkbCodes() {
//        return mkb10Repository.findDistinctMkbCodes();
//    }

    public List<MKB10DTO> getAllMkb10() {
        return mkb10Repository.findAll().stream()
                .map(mkb10Mapper::toDto)
                .collect(Collectors.toList());
    }

}
