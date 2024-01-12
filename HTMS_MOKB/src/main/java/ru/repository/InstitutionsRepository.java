package ru.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import ru.models.Entities.Form;
import ru.models.Entities.Institutions;

import java.util.*;

public interface InstitutionsRepository extends JpaRepository<Institutions, Integer > {

    @Query("SELECT DISTINCT i.instName FROM Institutions i WHERE i.instName IS NOT NULL AND TRIM(i.instName) <> ''")
    List<String> findDistinctInstNames();

//    @Query("SELECT DISTINCT i.instName FROM Institutions i WHERE i.instName IS NOT NULL AND TRIM(i.instName) <> ''")
//    List<Institutions> findAll();

}


