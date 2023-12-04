package ru.services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import ru.models.Entities.ReferenceList;
import ru.repository.ReferenceListRepository;

import java.util.List;
@Service
@AllArgsConstructor
public class ReferenceListService {

    private final ReferenceListRepository referenceListRepository;

    public List<ReferenceList> getItemByTag(Integer tag) {

        return referenceListRepository.findByTag(tag);

    }
}
