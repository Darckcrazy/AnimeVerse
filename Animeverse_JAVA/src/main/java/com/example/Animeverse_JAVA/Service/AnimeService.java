package com.example.Animeverse_JAVA.Service;

import com.example.Animeverse_JAVA.Entities.Anime;
import com.example.Animeverse_JAVA.Exceptions.IdNotFoundException;
import com.example.Animeverse_JAVA.Repository.AnimeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AnimeService {
    @Autowired
    private AnimeRepository animeRepository;

    public Page<Anime> findAllAnime(int pageNumber, int pageSize, String sortBy) {
        if (pageSize > 50) pageSize = 50;
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortBy).ascending());
        return this.animeRepository.findAll(pageable);
    }

    public Anime findAnimeById(Long animeId) {
        return this.animeRepository.findById(animeId)
                .orElseThrow(() -> new IdNotFoundException("Anime with ID: " + animeId + " not found"));
    }

    public Page<Anime> searchAnime(String keyword, int pageNumber, int pageSize) {
        if (pageSize > 50) pageSize = 50;
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        return this.animeRepository.searchByTitle(keyword, pageable);
    }

    public Anime createAnime(Anime anime) {
        Anime savedAnime = this.animeRepository.save(anime);
        log.info("Anime with ID: " + savedAnime.getAnimeId() + " has been created");
        return savedAnime;
    }

    public Anime updateAnime(Long animeId, Anime animeUpdates) {
        Anime anime = this.findAnimeById(animeId);
        if (animeUpdates.getTitle() != null) anime.setTitle(animeUpdates.getTitle());
        if (animeUpdates.getSynopsis() != null) anime.setSynopsis(animeUpdates.getSynopsis());
        if (animeUpdates.getImageUrl() != null) anime.setImageUrl(animeUpdates.getImageUrl());
        if (animeUpdates.getEpisodes() != null) anime.setEpisodes(animeUpdates.getEpisodes());
        if (animeUpdates.getStatus() != null) anime.setStatus(animeUpdates.getStatus());
        if (animeUpdates.getScore() != null) anime.setScore(animeUpdates.getScore());
        if (animeUpdates.getYear() != null) anime.setYear(animeUpdates.getYear());

        Anime updatedAnime = this.animeRepository.save(anime);
        log.info("Anime with ID: " + updatedAnime.getAnimeId() + " has been updated");
        return updatedAnime;
    }

    public void deleteAnime(Long animeId) {
        Anime anime = this.findAnimeById(animeId);
        this.animeRepository.delete(anime);
        log.info("Anime with ID: " + animeId + " has been deleted");
    }
}
