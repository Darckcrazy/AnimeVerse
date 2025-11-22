package com.example.Animeverse_JAVA.Service;

import com.example.Animeverse_JAVA.Entities.Anime;
import com.example.Animeverse_JAVA.Entities.Review;
import com.example.Animeverse_JAVA.Entities.Utente;
import com.example.Animeverse_JAVA.Exceptions.BadRequestException;
import com.example.Animeverse_JAVA.Exceptions.IdNotFoundException;
import com.example.Animeverse_JAVA.Repository.AnimeRepository;
import com.example.Animeverse_JAVA.Repository.ReviewRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private AnimeRepository animeRepository;

    public Review addReview(Utente utente, Long animeId, String text) {
        Anime anime = this.animeRepository.findById(animeId)
                .orElseThrow(() -> new IdNotFoundException("Anime with ID: " + animeId + " not found"));

        this.reviewRepository.findByUtente_UtenteIdAndAnime_AnimeId(utente.getUtenteId(), animeId)
                .ifPresent(r -> {
                    throw new BadRequestException("Review already exists for this anime");
                });

        Review review = new Review(utente, anime, text);
        Review saved = this.reviewRepository.save(review);
        log.info("Review added for anime ID: " + animeId + " by user: " + utente.getUtenteId());
        return saved;
    }

    public Review updateReview(Long reviewId, String newText) {
        Review review = this.reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IdNotFoundException("Review with ID: " + reviewId + " not found"));

        review.setText(newText);
        Review updated = this.reviewRepository.save(review);
        log.info("Review with ID: " + reviewId + " has been updated");
        return updated;
    }

    public void deleteReview(Long reviewId) {
        Review review = this.reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IdNotFoundException("Review with ID: " + reviewId + " not found"));

        this.reviewRepository.delete(review);
        log.info("Review with ID: " + reviewId + " has been deleted");
    }

    public List<Review> getReviewsByAnime(Long animeId) {
        return this.reviewRepository.findByAnime_AnimeId(animeId);
    }

    public List<Review> getReviewsByUser(Long utenteId) {
        return this.reviewRepository.findByUtente_UtenteId(utenteId);
    }

    public Review getReview(Long reviewId) {
        return this.reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IdNotFoundException("Review with ID: " + reviewId + " not found"));
    }
}
