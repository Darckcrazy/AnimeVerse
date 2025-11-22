package com.example.Animeverse_JAVA.Controllers;

import com.example.Animeverse_JAVA.Entities.Anime;
import com.example.Animeverse_JAVA.Service.AnimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/anime")
public class AnimeController {

    @Autowired
    private AnimeService animeService;

    @GetMapping
    public Page<Anime> getAllAnime(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "animeId") String sortBy) {
        return this.animeService.findAllAnime(page, size, sortBy);
    }

    @GetMapping("/{animeId}")
    public Anime getAnimeById(@PathVariable Long animeId) {
        return this.animeService.findAnimeById(animeId);
    }

    @GetMapping("/search")
    public Page<Anime> searchAnime(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return this.animeService.searchAnime(keyword, page, size);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public Anime createAnime(@RequestBody Anime anime) {
        return this.animeService.createAnime(anime);
    }

    @PutMapping("/{animeId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Anime updateAnime(@PathVariable Long animeId, @RequestBody Anime animeUpdates) {
        return this.animeService.updateAnime(animeId, animeUpdates);
    }

    @DeleteMapping("/{animeId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAnime(@PathVariable Long animeId) {
        this.animeService.deleteAnime(animeId);
    }

    @GetMapping("/jikan/search")
    public List<Anime> searchAnimeFromJikan(@RequestParam String query) {
        return this.animeService.searchAnimeFromJikan(query);
    }

    @PostMapping("/jikan/import/{jikanId}")
    @ResponseStatus(HttpStatus.CREATED)
    public Anime importAnimeFromJikan(@PathVariable Long jikanId) {
        return this.animeService.importAnimeFromJikan(jikanId);
    }
}
