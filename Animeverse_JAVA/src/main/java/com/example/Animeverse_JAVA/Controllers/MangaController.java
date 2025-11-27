package com.example.Animeverse_JAVA.Controllers;

import com.example.Animeverse_JAVA.Entities.Manga;
import com.example.Animeverse_JAVA.Service.MangaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller per la gestione delle operazioni relative ai manga.
 * Espone endpoint REST per operazioni CRUD sui manga, inclusa l'integrazione
 * con Jikan API.
 * Tutti gli endpoint sono accessibili sotto il percorso base "/manga".
 */
@RestController
@RequestMapping("/manga")
public class MangaController {

    @Autowired
    private MangaService mangaService; // Servizio per la logica di business dei manga

    /**
     * Restituisce una pagina di manga con paginazione e ordinamento.
     * 
     * @param page   Numero di pagina (iniziando da 0)
     * @param size   Dimensione della pagina (numero di elementi per pagina)
     * @param sortBy Campo per l'ordinamento (predefinito: "mangaId")
     * @return Una pagina di oggetti Manga
     */
    @GetMapping
    public Page<Manga> getAllManga(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "mangaId") String sortBy) {
        return this.mangaService.findAllManga(page, size, sortBy);
    }

    /**
     * Restituisce un singolo manga in base all'ID specificato.
     * 
     * @param mangaId L'ID del manga da cercare
     * @return L'oggetto Manga corrispondente all'ID
     */
    @GetMapping("/{mangaId}")
    public Manga getMangaById(@PathVariable Long mangaId) {
        return this.mangaService.findMangaById(mangaId);
    }

    /**
     * Cerca manga in base a una parola chiave con supporto alla paginazione.
     * 
     * @param keyword Parola chiave per la ricerca
     * @param page    Numero di pagina (iniziando da 0)
     * @param size    Dimensione della pagina (numero di elementi per pagina)
     * @return Una pagina di oggetti Manga che corrispondono alla ricerca
     */
    @GetMapping("/search")
    public Page<Manga> searchManga(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return this.mangaService.searchManga(keyword, page, size);
    }

    /**
     * Crea un nuovo manga.
     * Richiede il ruolo di ADMIN.
     * 
     * @param manga L'oggetto Manga da creare (nel corpo della richiesta)
     * @return Il manga appena creato
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public Manga createManga(@RequestBody Manga manga) {
        return this.mangaService.createManga(manga);
    }

    /**
     * Aggiorna un manga esistente.
     * Richiede il ruolo di ADMIN.
     * 
     * @param mangaId      L'ID del manga da aggiornare
     * @param mangaUpdates L'oggetto Manga con i campi aggiornati
     * @return Il manga aggiornato
     */
    @PutMapping("/{mangaId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Manga updateManga(@PathVariable Long mangaId, @RequestBody Manga mangaUpdates) {
        return this.mangaService.updateManga(mangaId, mangaUpdates);
    }

    /**
     * Elimina un manga esistente.
     * Richiede il ruolo di ADMIN.
     * 
     * @param mangaId L'ID del manga da eliminare
     */
    @DeleteMapping("/{mangaId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteManga(@PathVariable Long mangaId) {
        this.mangaService.deleteManga(mangaId);
    }

    /**
     * Cerca manga utilizzando l'API di Jikan (MyAnimeList).
     * 
     * @param query Termine di ricerca per trovare manga
     * @return Una lista di manga trovati tramite Jikan API
     */
    @GetMapping("/jikan/search")
    public List<Manga> searchMangaFromJikan(@RequestParam String query) {
        return this.mangaService.searchMangaFromJikan(query);
    }

    /**
     * Importa un manga da Jikan (MyAnimeList) nel database locale.
     * 
     * @param jikanId L'ID del manga su Jikan da importare
     * @return Il manga importato e salvato nel database
     */
    @PostMapping("/jikan/import/{jikanId}")
    @ResponseStatus(HttpStatus.CREATED)
    public Manga importMangaFromJikan(@PathVariable Long jikanId) {
        return this.mangaService.importMangaFromJikan(jikanId);
    }
}
