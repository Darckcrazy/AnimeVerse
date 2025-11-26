package com.example.Animeverse_JAVA.Repository;

import com.example.Animeverse_JAVA.Entities.Readlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReadlistRepository extends JpaRepository<Readlist, Long> {
    List<Readlist> findByUtente_UtenteId(Long utenteId);

    Optional<Readlist> findByUtente_UtenteIdAndManga_MangaId(Long utenteId, Long mangaId);

    boolean existsByUtente_UtenteIdAndManga_MangaId(Long utenteId, Long mangaId);
}
