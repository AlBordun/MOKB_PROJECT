package ru.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.models.Entities.Patient;
import ru.util.FormSpecification;

import java.util.List;

// Репозиторий для доступа к данным сущностей
@Repository
public interface PatientRepository extends JpaRepository<Patient, Long>{
//    List<Patient> findAll(FormSpecification specification);

//    @Query ("SELECT p FROM patient p LEFT JOIN referral r ON p.id = r.patient_id WHERE" +
//    "p.id LIKE %?1% OR" +
//    "p.snils LIKE %?1% OR" +
//    "p.first_name LIKE %?1% OR" +
//    "p.last_name LIKE %?1% OR" +
//    "p.middle_name LIKE %?1% OR" +
//    "p.passport_series LIKE %?1% OR" +
//    "p.passport_number LIKE %?1% OR" +
//    "p.referral_name LIKE %?1% OR" +
//    "p.registration_address LIKE %?1% OR" +
//    "p.real_address LIKE %?1%" +
//    "r.referral_name LIKE %?1%" +
//    "r.")
//    List<Patient> findByQuery(String query);

//    Set<ReferralName> findAllReferralNamesByPatientId
        // Здесь можно добавлять собственные методы запросов, если необходимо

}
