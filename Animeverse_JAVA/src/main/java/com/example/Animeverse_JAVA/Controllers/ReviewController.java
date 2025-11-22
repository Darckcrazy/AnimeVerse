package com.example.Animeverse_JAVA.Controllers;

import com.example.Animeverse_JAVA.Entities.Utente;
import com.example.Animeverse_JAVA.Entities.Review;
import com.example.Animeverse_JAVA.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Review addReview(
            @AuthenticationPrincipal Utente currentUtente,
            @RequestParam Long animeId,
            @RequestParam String text) {
        return this.reviewService.addReview(currentUtente, animeId, text);
    }

    @PutMapping("/{reviewId}")
    public Review updateReview(
            @PathVariable Long reviewId,
            @RequestParam String text) {
        return this.reviewService.updateReview(reviewId, text);
    }

    @DeleteMapping("/{reviewId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(@PathVariable Long reviewId) {
        this.reviewService.deleteReview(reviewId);
    }

    @GetMapping("/anime/{animeId}")
    public List<Review> getReviewsByAnime(@PathVariable Long animeId) {
        return this.reviewService.getReviewsByAnime(animeId);
    }

    @GetMapping("/user/{userId}")
    public List<Review> getReviewsByUser(@PathVariable Long userId) {
        return this.reviewService.getReviewsByUser(userId);
    }

    @GetMapping("/{reviewId}")
    public Review getReview(@PathVariable Long reviewId) {
        return this.reviewService.getReview(reviewId);
    }
}
