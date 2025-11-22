package com.example.Animeverse_JAVA.Repository;

import com.example.Animeverse_JAVA.Entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByAnime_AnimeId(Long animeId);

    List<Review> findByUtente_UtenteId(Long utenteId);

    Optional<Review> findByUtente_UtenteIdAndAnime_AnimeId(Long utenteId, Long animeId);
}
