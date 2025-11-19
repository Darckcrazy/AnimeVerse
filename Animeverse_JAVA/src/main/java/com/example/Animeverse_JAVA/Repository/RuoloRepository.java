package com.example.Animeverse_JAVA.Repository;

import com.example.Animeverse_JAVA.Entities.Ruolo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RuoloRepository extends JpaRepository<Ruolo, Long> {

    Optional<Ruolo> findBytipoRuolo(String tipoRuolo);
}