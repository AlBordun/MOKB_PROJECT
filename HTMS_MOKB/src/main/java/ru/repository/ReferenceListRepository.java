package ru.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ru.models.Entities.ReferenceList;

import java.util.*;

public interface ReferenceListRepository extends JpaRepository <ReferenceList, Integer> {

//    List<ReferenceList> findByTag(Integer tag);
    @Query("SELECT r.text FROM ReferenceList r WHERE r.tag = :tag AND r.text = :text")
    List<ReferenceList> findByTagAndText(@Param("tag") Integer tag, @Param("text") String text);

    @Query("SELECT r.text FROM ReferenceList r WHERE r.tag = :tag")
    List<String> findAll(@Param("tag") Integer tag);

    @Query("SELECT r FROM ReferenceList r WHERE r.tag = :tag")
    List<ReferenceList> findByTag(@Param("tag") Integer tag);
}
