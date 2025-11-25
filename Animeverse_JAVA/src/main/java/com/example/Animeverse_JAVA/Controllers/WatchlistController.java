package com.example.Animeverse_JAVA.Controllers;

import com.example.Animeverse_JAVA.Entities.Utente;
import com.example.Animeverse_JAVA.Entities.Watchlist;
import com.example.Animeverse_JAVA.Service.WatchlistService;
import com.example.Animeverse_JAVA.Service.UtentiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    @Autowired
    private WatchlistService watchlistService;

    @Autowired
    private UtentiService utentiService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Watchlist addToWatchlist(
            @RequestParam Long animeId,
            @RequestParam String status) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Utente currentUser = utentiService.findUtentiByEmail(email);
        return this.watchlistService.addToWatchlist(currentUser, animeId, status);
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
    public List<Watchlist> getMyWatchlist() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Utente currentUser = utentiService.findUtentiByEmail(email);
        return this.watchlistService.getUserWatchlist(currentUser.getUtenteId());
    }
}
