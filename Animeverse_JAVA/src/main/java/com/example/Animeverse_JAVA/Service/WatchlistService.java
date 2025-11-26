package com.example.Animeverse_JAVA.Service;

import com.example.Animeverse_JAVA.DTO.WatchlistResponse;
import com.example.Animeverse_JAVA.Entities.Anime;
import com.example.Animeverse_JAVA.Entities.Utente;
import com.example.Animeverse_JAVA.Entities.Watchlist;
import com.example.Animeverse_JAVA.Exceptions.BadRequestException;
import com.example.Animeverse_JAVA.Exceptions.IdNotFoundException;
import com.example.Animeverse_JAVA.Repository.AnimeRepository;
import com.example.Animeverse_JAVA.Repository.WatchlistRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class WatchlistService {
    @Autowired
    private WatchlistRepository watchlistRepository;
    @Autowired
    private AnimeRepository animeRepository;
    @Autowired
    private AnimeService animeService;

    public WatchlistResponse addToWatchlist(Utente utente, Long animeId, String status) {
        Anime anime = this.animeRepository.findById(animeId)
                .orElseGet(() -> {
                    try {
                        return this.animeService.importAnimeFromJikan(animeId);
                    } catch (Exception e) {
                        throw new IdNotFoundException("Anime with ID: " + animeId + " not found");
                    }
                });

        if (this.watchlistRepository.existsByUtente_UtenteIdAndAnime_AnimeId(utente.getUtenteId(), animeId)) {
            throw new BadRequestException("Anime already in watchlist");
        }

        Watchlist watchlist = new Watchlist();
        watchlist.setUtente(utente);
        watchlist.setAnime(anime);
        watchlist.setStatus(status);
        watchlist.setDateAdded(LocalDate.now());

        Watchlist saved = this.watchlistRepository.save(watchlist);
        log.info("Anime with ID: " + animeId + " added to watchlist of user: " + utente.getUtenteId());
        return WatchlistResponse.fromEntity(saved);
    }

    public WatchlistResponse updateStatus(Long watchlistId, String newStatus, Long userId) {
        Watchlist watchlist = this.watchlistRepository.findById(watchlistId)
                .orElseThrow(() -> new IdNotFoundException("Watchlist entry with ID: " + watchlistId + " not found"));

        if (!watchlist.getUtente().getUtenteId().equals(userId)) {
            throw new BadRequestException("You can only update your own watchlist entries");
        }

        watchlist.setStatus(newStatus);
        Watchlist updated = this.watchlistRepository.save(watchlist);
        log.info("Watchlist entry with ID: " + watchlistId + " status updated to: " + newStatus);
        return WatchlistResponse.fromEntity(updated);
    }

    public void removeFromWatchlist(Long watchlistId, Long userId) {
        Watchlist watchlist = this.watchlistRepository.findById(watchlistId)
                .orElseThrow(() -> new IdNotFoundException("Watchlist entry with ID: " + watchlistId + " not found"));

        if (!watchlist.getUtente().getUtenteId().equals(userId)) {
            throw new BadRequestException("You can only delete your own watchlist entries");
        }

        this.watchlistRepository.delete(watchlist);
        log.info("Watchlist entry with ID: " + watchlistId + " has been deleted");
    }

    public List<WatchlistResponse> getUserWatchlist(Long utenteId) {
        return this.watchlistRepository.findByUtente_UtenteId(utenteId).stream()
                .map(WatchlistResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
