package com.example.Animeverse_JAVA.Controllers;

import com.example.Animeverse_JAVA.Entities.Utente;
import com.example.Animeverse_JAVA.Entities.Watchlist;
import com.example.Animeverse_JAVA.Service.WatchlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/watchlist")
public class WatchlistController {

    @Autowired
    private WatchlistService watchlistService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Watchlist addToWatchlist(
            @AuthenticationPrincipal Utente currentUtente,
            @RequestParam Long animeId,
            @RequestParam String status) {
        return this.watchlistService.addToWatchlist(currentUtente, animeId, status);
    }

    @PutMapping("/{watchlistId}")
    public Watchlist updateStatus(
            @PathVariable Long watchlistId,
            @RequestParam String status) {
        return this.watchlistService.updateStatus(watchlistId, status);
    }

    @DeleteMapping("/{watchlistId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFromWatchlist(@PathVariable Long watchlistId) {
        this.watchlistService.removeFromWatchlist(watchlistId);
    }

    @GetMapping("/user/{userId}")
    public List<Watchlist> getUserWatchlist(@PathVariable Long userId) {
        return this.watchlistService.getUserWatchlist(userId);
    }

    @GetMapping("/me")
    public List<Watchlist> getMyWatchlist(@AuthenticationPrincipal Utente currentUtente) {
        return this.watchlistService.getUserWatchlist(currentUtente.getUtenteId());
    }
}
