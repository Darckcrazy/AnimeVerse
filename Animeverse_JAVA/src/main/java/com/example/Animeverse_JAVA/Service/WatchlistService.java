package com.example.Animeverse_JAVA.Service;

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

@Service
@Slf4j
public class WatchlistService {
    @Autowired
    private WatchlistRepository watchlistRepository;
    @Autowired
    private AnimeRepository animeRepository;

    public Watchlist addToWatchlist(Utente utente, Long animeId, String status) {
        Anime anime = this.animeRepository.findById(animeId)
                .orElseThrow(() -> new IdNotFoundException("Anime with ID: " + animeId + " not found"));

        this.watchlistRepository.findByUtente_UtenteIdAndAnime_AnimeId(utente.getUtenteId(), animeId)
                .ifPresent(w -> {
                    throw new BadRequestException("Anime already in watchlist");
                });

        Watchlist watchlist = new Watchlist();
        watchlist.setUtente(utente);
        watchlist.setAnime(anime);
        watchlist.setStatus(status);
        watchlist.setDateAdded(LocalDate.now());

        Watchlist saved = this.watchlistRepository.save(watchlist);
        log.info("Anime with ID: " + animeId + " added to watchlist of user: " + utente.getUtenteId());
        return saved;
    }

    public Watchlist updateStatus(Long watchlistId, String newStatus) {
        Watchlist watchlist = this.watchlistRepository.findById(watchlistId)
                .orElseThrow(() -> new IdNotFoundException("Watchlist entry with ID: " + watchlistId + " not found"));

        watchlist.setStatus(newStatus);
        Watchlist updated = this.watchlistRepository.save(watchlist);
        log.info("Watchlist entry with ID: " + watchlistId + " status updated to: " + newStatus);
        return updated;
    }

    public void removeFromWatchlist(Long watchlistId) {
        Watchlist watchlist = this.watchlistRepository.findById(watchlistId)
                .orElseThrow(() -> new IdNotFoundException("Watchlist entry with ID: " + watchlistId + " not found"));

        this.watchlistRepository.delete(watchlist);
        log.info("Watchlist entry with ID: " + watchlistId + " has been deleted");
    }

    public List<Watchlist> getUserWatchlist(Long utenteId) {
        return this.watchlistRepository.findByUtente_UtenteId(utenteId);
    }
}
