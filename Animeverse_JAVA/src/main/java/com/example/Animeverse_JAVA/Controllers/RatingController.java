package com.example.Animeverse_JAVA.Controllers;

import com.example.Animeverse_JAVA.Entities.Utente;
import com.example.Animeverse_JAVA.Entities.Rating;
import com.example.Animeverse_JAVA.Service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rating")
public class RatingController {

    @Autowired
    private RatingService ratingService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Rating addRating(
            @AuthenticationPrincipal Utente currentUtente,
            @RequestParam Long animeId,
            @RequestParam Integer vote) {
        return this.ratingService.addRating(currentUtente, animeId, vote);
    }

    @PutMapping("/{ratingId}")
    public Rating updateRating(
            @PathVariable Long ratingId,
            @RequestParam Integer vote) {
        return this.ratingService.updateRating(ratingId, vote);
    }

    @DeleteMapping("/{ratingId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRating(@PathVariable Long ratingId) {
        this.ratingService.deleteRating(ratingId);
    }

    @GetMapping("/anime/{animeId}")
    public List<Rating> getRatingsByAnime(@PathVariable Long animeId) {
        return this.ratingService.getRatingsByAnime(animeId);
    }

    @GetMapping("/user/{userId}")
    public List<Rating> getRatingsByUser(@PathVariable Long userId) {
        return this.ratingService.getRatingsByUser(userId);
    }

    @GetMapping("/{ratingId}")
    public Rating getRating(@PathVariable Long ratingId) {
        return this.ratingService.getRating(ratingId);
    }

    @GetMapping("/anime/{animeId}/average")
    public Double getAverageRatingForAnime(@PathVariable Long animeId) {
        return this.ratingService.getAverageRatingForAnime(animeId);
    }
}
