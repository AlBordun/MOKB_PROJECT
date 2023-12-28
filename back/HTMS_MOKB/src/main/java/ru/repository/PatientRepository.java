package ru.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.models.Entities.Patient;
import ru.util.FormSpecification;

import java.util.List;

// Репозиторий для доступа к данным сущностей
@Repository
public interface PatientRepository extends JpaRepository<Patient, Long>{

        // Здесь можно добавлять собственные методы запросов, если необходимо

}
