package com.example.Animeverse_JAVA.Repository;

import com.example.Animeverse_JAVA.Entities.Watchlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchlistRepository extends JpaRepository<Watchlist, Long> {
    List<Watchlist> findByUtente_UtenteId(Long utenteId);

    Optional<Watchlist> findByUtente_UtenteIdAndAnime_AnimeId(Long utenteId, Long animeId);
}
