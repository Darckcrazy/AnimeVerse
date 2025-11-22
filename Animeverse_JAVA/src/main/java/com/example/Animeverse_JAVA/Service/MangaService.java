package com.example.Animeverse_JAVA.Service;

import com.example.Animeverse_JAVA.Entities.Manga;
import com.example.Animeverse_JAVA.Exceptions.IdNotFoundException;
import com.example.Animeverse_JAVA.External.JikanMangaService;
import com.example.Animeverse_JAVA.Repository.MangaRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class MangaService {
    @Autowired
    private MangaRepository mangaRepository;
    @Autowired
    private JikanMangaService jikanMangaService;

    public Page<Manga> findAllManga(int pageNumber, int pageSize, String sortBy) {
        if (pageSize > 50) pageSize = 50;
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortBy).ascending());
        return this.mangaRepository.findAll(pageable);
    }

    public Manga findMangaById(Long mangaId) {
        return this.mangaRepository.findById(mangaId)
                .orElseThrow(() -> new IdNotFoundException("Manga with ID: " + mangaId + " not found"));
    }

    public Page<Manga> searchManga(String keyword, int pageNumber, int pageSize) {
        if (pageSize > 50) pageSize = 50;
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        return this.mangaRepository.searchByTitle(keyword, pageable);
    }

    public Manga createManga(Manga manga) {
        Manga savedManga = this.mangaRepository.save(manga);
        log.info("Manga with ID: " + savedManga.getMangaId() + " has been created");
        return savedManga;
    }

    public Manga updateManga(Long mangaId, Manga mangaUpdates) {
        Manga manga = this.findMangaById(mangaId);
        if (mangaUpdates.getTitle() != null) manga.setTitle(mangaUpdates.getTitle());
        if (mangaUpdates.getSynopsis() != null) manga.setSynopsis(mangaUpdates.getSynopsis());
        if (mangaUpdates.getImageUrl() != null) manga.setImageUrl(mangaUpdates.getImageUrl());
        if (mangaUpdates.getChapters() != null) manga.setChapters(mangaUpdates.getChapters());
        if (mangaUpdates.getStatus() != null) manga.setStatus(mangaUpdates.getStatus());
        if (mangaUpdates.getScore() != null) manga.setScore(mangaUpdates.getScore());
        if (mangaUpdates.getYear() != null) manga.setYear(mangaUpdates.getYear());

        Manga updatedManga = this.mangaRepository.save(manga);
        log.info("Manga with ID: " + updatedManga.getMangaId() + " has been updated");
        return updatedManga;
    }

    public void deleteManga(Long mangaId) {
        Manga manga = this.findMangaById(mangaId);
        this.mangaRepository.delete(manga);
        log.info("Manga with ID: " + mangaId + " has been deleted");
    }

    public List<Manga> searchMangaFromJikan(String query) {
        List<Manga> jikanResults = jikanMangaService.searchMangaFromJikan(query);

        List<Manga> savedResults = new java.util.ArrayList<>();
        for (Manga manga : jikanResults) {
            Manga existing = this.mangaRepository.findByJikanId(manga.getJikanId()).orElse(null);
            if (existing == null) {
                Manga saved = this.mangaRepository.save(manga);
                savedResults.add(saved);
                log.info("Manga with Jikan ID: {} saved to database", manga.getJikanId());
            } else {
                savedResults.add(existing);
                log.info("Manga with Jikan ID: {} already exists in database", manga.getJikanId());
            }
        }

        return savedResults;
    }

    public Manga importMangaFromJikan(Long jikanId) {
        Manga existing = this.mangaRepository.findByJikanId(jikanId).orElse(null);
        if (existing != null) {
            log.info("Manga with Jikan ID: {} already exists in database", jikanId);
            return existing;
        }

        Manga jikanManga = jikanMangaService.getMangaDetailsFromJikan(jikanId);
        if (jikanManga != null) {
            Manga saved = this.mangaRepository.save(jikanManga);
            log.info("Manga with Jikan ID: {} imported and saved to database", jikanId);
            return saved;
        }

        throw new IdNotFoundException("Manga with Jikan ID: " + jikanId + " not found");
    }
}
