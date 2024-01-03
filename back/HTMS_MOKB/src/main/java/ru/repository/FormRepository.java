package ru.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.models.Entities.Form;
import ru.util.FormSpecification;

import java.util.List;
import java.util.Optional;

@Repository
public interface FormRepository extends JpaRepository<Form, Long > {
//    List<Form> findAll(FormSpecification formSpecification);

    // Здесь можно добавлять собственные методы запросов, если необходимо
    List<Form> findByPatientId(Long patientId);

    @Query("SELECT f.formName FROM Form f WHERE f.patient.id = :patientId")
    List<String> findFormNamesByPatientId(@Param("patientId") Long patientId);
}
