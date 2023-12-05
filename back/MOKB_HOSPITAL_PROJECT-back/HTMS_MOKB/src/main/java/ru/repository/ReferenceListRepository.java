package ru.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.models.Entities.ReferenceList;

import java.util.*;

public interface ReferenceListRepository extends JpaRepository <ReferenceList, Long> {

    List<ReferenceList> findByTag(Integer tag);

}
