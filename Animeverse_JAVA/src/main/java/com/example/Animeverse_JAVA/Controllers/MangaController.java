package com.example.Animeverse_JAVA.Controllers;

import com.example.Animeverse_JAVA.Entities.Manga;
import com.example.Animeverse_JAVA.Service.MangaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/manga")
public class MangaController {

    @Autowired
    private MangaService mangaService;

    @GetMapping
    public Page<Manga> getAllManga(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "mangaId") String sortBy) {
        return this.mangaService.findAllManga(page, size, sortBy);
    }

    @GetMapping("/{mangaId}")
    public Manga getMangaById(@PathVariable Long mangaId) {
        return this.mangaService.findMangaById(mangaId);
    }

    @GetMapping("/search")
    public Page<Manga> searchManga(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return this.mangaService.searchManga(keyword, page, size);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public Manga createManga(@RequestBody Manga manga) {
        return this.mangaService.createManga(manga);
    }

    @PutMapping("/{mangaId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Manga updateManga(@PathVariable Long mangaId, @RequestBody Manga mangaUpdates) {
        return this.mangaService.updateManga(mangaId, mangaUpdates);
    }

    @DeleteMapping("/{mangaId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteManga(@PathVariable Long mangaId) {
        this.mangaService.deleteManga(mangaId);
    }
}
