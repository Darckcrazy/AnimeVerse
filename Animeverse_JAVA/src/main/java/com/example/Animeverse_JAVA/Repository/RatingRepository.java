package com.example.Animeverse_JAVA.Repository;

import com.example.Animeverse_JAVA.Entities.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByAnime_AnimeId(Long animeId);

    List<Rating> findByUtente_UtenteId(Long utenteId);

    Optional<Rating> findByUtente_UtenteIdAndAnime_AnimeId(Long utenteId, Long animeId);

    @Query("SELECT AVG(r.vote) FROM Rating r WHERE r.anime.animeId = :animeId")
    Double getAverageRatingByAnimeId(@Param("animeId") Long animeId);
}
