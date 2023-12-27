package ru.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.models.Entities.Form;
import ru.models.Entities.MKB10;

@Repository
public interface MKB10Repository extends JpaRepository<MKB10, Long > {



}
