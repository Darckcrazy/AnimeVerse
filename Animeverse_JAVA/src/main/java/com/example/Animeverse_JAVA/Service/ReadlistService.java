package com.example.Animeverse_JAVA.Service;

import com.example.Animeverse_JAVA.Entities.Manga;
import com.example.Animeverse_JAVA.Entities.Utente;
import com.example.Animeverse_JAVA.Entities.Readlist;
import com.example.Animeverse_JAVA.Exceptions.BadRequestException;
import com.example.Animeverse_JAVA.Exceptions.IdNotFoundException;
import com.example.Animeverse_JAVA.Repository.MangaRepository;
import com.example.Animeverse_JAVA.Repository.ReadlistRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
public class ReadlistService {
    @Autowired
    private ReadlistRepository readlistRepository;
    @Autowired
    private MangaRepository mangaRepository;
    @Autowired
    private MangaService mangaService;

    public Readlist addToReadlist(Utente utente, Long mangaId, String status) {
        Manga manga = this.mangaRepository.findById(mangaId)
                .orElseGet(() -> {
                    try {
                        return this.mangaService.importMangaFromJikan(mangaId);
                    } catch (Exception e) {
                        throw new IdNotFoundException("Manga with ID: " + mangaId + " not found");
                    }
                });

        if (this.readlistRepository.existsByUtente_UtenteIdAndManga_MangaId(utente.getUtenteId(), mangaId)) {
            throw new BadRequestException("Manga already in readlist");
        }

        Readlist readlist = new Readlist();
        readlist.setUtente(utente);
        readlist.setManga(manga);
        readlist.setStatus(status);
        readlist.setDateAdded(LocalDate.now());

        Readlist saved = this.readlistRepository.save(readlist);
        log.info("Manga with ID: " + mangaId + " added to readlist of user: " + utente.getUtenteId());
        return saved;
    }

    public Readlist updateStatus(Long readlistId, String newStatus, Long userId) {
        Readlist readlist = this.readlistRepository.findById(readlistId)
                .orElseThrow(() -> new IdNotFoundException("Readlist entry with ID: " + readlistId + " not found"));

        if (!readlist.getUtente().getUtenteId().equals(userId)) {
            throw new BadRequestException("You can only update your own readlist entries");
        }

        readlist.setStatus(newStatus);
        Readlist updated = this.readlistRepository.save(readlist);
        log.info("Readlist entry with ID: " + readlistId + " status updated to: " + newStatus);
        return updated;
    }

    public void removeFromReadlist(Long readlistId, Long userId) {
        Readlist readlist = this.readlistRepository.findById(readlistId)
                .orElseThrow(() -> new IdNotFoundException("Readlist entry with ID: " + readlistId + " not found"));

        if (!readlist.getUtente().getUtenteId().equals(userId)) {
            throw new BadRequestException("You can only delete your own readlist entries");
        }

        this.readlistRepository.delete(readlist);
        log.info("Readlist entry with ID: " + readlistId + " has been deleted");
    }

    public List<Readlist> getUserReadlist(Long utenteId) {
        return this.readlistRepository.findByUtente_UtenteId(utenteId);
    }
}
