package com.example.Animeverse_JAVA.Service;

import com.example.Animeverse_JAVA.Entities.Anime;
import com.example.Animeverse_JAVA.Entities.Rating;
import com.example.Animeverse_JAVA.Entities.Utente;
import com.example.Animeverse_JAVA.Exceptions.BadRequestException;
import com.example.Animeverse_JAVA.Exceptions.IdNotFoundException;
import com.example.Animeverse_JAVA.Repository.AnimeRepository;
import com.example.Animeverse_JAVA.Repository.RatingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class RatingService {
    @Autowired
    private RatingRepository ratingRepository;
    @Autowired
    private AnimeRepository animeRepository;

    public Rating addRating(Utente utente, Long animeId, Integer vote) {
        if (vote < 1 || vote > 10) {
            throw new BadRequestException("Vote must be between 1 and 10");
        }

        Anime anime = this.animeRepository.findById(animeId)
                .orElseThrow(() -> new IdNotFoundException("Anime with ID: " + animeId + " not found"));

        this.ratingRepository.findByUtente_UtenteIdAndAnime_AnimeId(utente.getUtenteId(), animeId)
                .ifPresent(r -> {
                    throw new BadRequestException("Rating already exists for this anime");
                });

        Rating rating = new Rating(utente, anime, vote);
        Rating saved = this.ratingRepository.save(rating);
        log.info("Rating added for anime ID: " + animeId + " by user: " + utente.getUtenteId());
        return saved;
    }

    public Rating updateRating(Long ratingId, Integer newVote) {
        if (newVote < 1 || newVote > 10) {
            throw new BadRequestException("Vote must be between 1 and 10");
        }

        Rating rating = this.ratingRepository.findById(ratingId)
                .orElseThrow(() -> new IdNotFoundException("Rating with ID: " + ratingId + " not found"));

        rating.setVote(newVote);
        Rating updated = this.ratingRepository.save(rating);
        log.info("Rating with ID: " + ratingId + " has been updated");
        return updated;
    }

    public void deleteRating(Long ratingId) {
        Rating rating = this.ratingRepository.findById(ratingId)
                .orElseThrow(() -> new IdNotFoundException("Rating with ID: " + ratingId + " not found"));

        this.ratingRepository.delete(rating);
        log.info("Rating with ID: " + ratingId + " has been deleted");
    }

    public List<Rating> getRatingsByAnime(Long animeId) {
        return this.ratingRepository.findByAnime_AnimeId(animeId);
    }

    public List<Rating> getRatingsByUser(Long utenteId) {
        return this.ratingRepository.findByUtente_UtenteId(utenteId);
    }

    public Rating getRating(Long ratingId) {
        return this.ratingRepository.findById(ratingId)
                .orElseThrow(() -> new IdNotFoundException("Rating with ID: " + ratingId + " not found"));
    }

    public Double getAverageRatingForAnime(Long animeId) {
        Double average = this.ratingRepository.getAverageRatingByAnimeId(animeId);
        return average != null ? average : 0.0;
    }
}
