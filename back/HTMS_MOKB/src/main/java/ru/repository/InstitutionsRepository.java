package ru.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.models.Entities.Form;
import ru.models.Entities.Institutions;

public interface InstitutionsRepository extends JpaRepository<Institutions, Long > {



}
