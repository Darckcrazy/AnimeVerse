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

    public Readlist addToReadlist(Utente utente, Long mangaId, String status) {
        Manga manga = this.mangaRepository.findById(mangaId)
                .orElseThrow(() -> new IdNotFoundException("Manga with ID: " + mangaId + " not found"));

        this.readlistRepository.findByUtente_UtenteIdAndManga_MangaId(utente.getUtenteId(), mangaId)
                .ifPresent(r -> {
                    throw new BadRequestException("Manga already in readlist");
                });

        Readlist readlist = new Readlist();
        readlist.setUtente(utente);
        readlist.setManga(manga);
        readlist.setStatus(status);
        readlist.setDateAdded(LocalDate.now());

        Readlist saved = this.readlistRepository.save(readlist);
        log.info("Manga with ID: " + mangaId + " added to readlist of user: " + utente.getUtenteId());
        return saved;
    }

    public Readlist updateStatus(Long readlistId, String newStatus) {
        Readlist readlist = this.readlistRepository.findById(readlistId)
                .orElseThrow(() -> new IdNotFoundException("Readlist entry with ID: " + readlistId + " not found"));

        readlist.setStatus(newStatus);
        Readlist updated = this.readlistRepository.save(readlist);
        log.info("Readlist entry with ID: " + readlistId + " status updated to: " + newStatus);
        return updated;
    }

    public void removeFromReadlist(Long readlistId) {
        Readlist readlist = this.readlistRepository.findById(readlistId)
                .orElseThrow(() -> new IdNotFoundException("Readlist entry with ID: " + readlistId + " not found"));

        this.readlistRepository.delete(readlist);
        log.info("Readlist entry with ID: " + readlistId + " has been deleted");
    }

    public List<Readlist> getUserReadlist(Long utenteId) {
        return this.readlistRepository.findByUtente_UtenteId(utenteId);
    }
}
