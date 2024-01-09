package ru.services;

import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.models.Entities.ReferenceList;
import ru.repository.ReferenceListRepository;

import java.util.List;
@Service
@AllArgsConstructor
public class ReferenceListService {

    private final ReferenceListRepository referenceListRepository;
    private static Logger logger = LoggerFactory.getLogger(ReferenceListService.class);
    public List<ReferenceList> getItemByTagAndText(Integer tag, String text) {

        logger.info("Запрос getItemByTag с tag: {} и text: {}", tag, text);

        return referenceListRepository.findByTagAndText(tag,text);

    }

    public List<String> getItemByTag(Integer tag) {

        return referenceListRepository.findAll(tag);

    }
}
