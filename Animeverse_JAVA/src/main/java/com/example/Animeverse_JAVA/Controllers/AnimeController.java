package com.example.Animeverse_JAVA.Controllers;

import com.example.Animeverse_JAVA.Entities.Anime;
import com.example.Animeverse_JAVA.Service.AnimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller per la gestione delle operazioni relative agli anime.
 * Espone endpoint REST per operazioni CRUD sugli anime.
 * Tutti gli endpoint sono accessibili sotto il percorso base "/anime".
 */
@RestController
@RequestMapping("/anime")
public class AnimeController {

    @Autowired
    private AnimeService animeService; // Servizio per la logica di business degli anime

    /**
     * Restituisce una pagina di anime con paginazione e ordinamento.
     * 
     * @param page   Numero di pagina (iniziando da 0)
     * @param size   Dimensione della pagina (numero di elementi per pagina)
     * @param sortBy Campo per l'ordinamento (predefinito: "animeId")
     * @return Una pagina di oggetti Anime
     */
    @GetMapping
    public Page<Anime> getAllAnime(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "animeId") String sortBy) {
        return this.animeService.findAllAnime(page, size, sortBy);
    }

    /**
     * Restituisce un singolo anime in base all'ID specificato.
     * 
     * @param animeId L'ID dell'anime da cercare
     * @return L'oggetto Anime corrispondente all'ID
     */
    @GetMapping("/{animeId}")
    public Anime getAnimeById(@PathVariable Long animeId) {
        return this.animeService.findAnimeById(animeId);
    }

    /**
     * Cerca anime in base a una parola chiave con supporto alla paginazione.
     * 
     * @param keyword Parola chiave per la ricerca
     * @param page    Numero di pagina (iniziando da 0)
     * @param size    Dimensione della pagina (numero di elementi per pagina)
     * @return Una pagina di oggetti Anime che corrispondono alla ricerca
     */
    @GetMapping("/search")
    public Page<Anime> searchAnime(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return this.animeService.searchAnime(keyword, page, size);
    }

    /**
     * Crea un nuovo anime.
     * Richiede il ruolo di ADMIN.
     * 
     * @param anime L'oggetto Anime da creare (nel corpo della richiesta)
     * @return L'anime appena creato
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public Anime createAnime(@RequestBody Anime anime) {
        return this.animeService.createAnime(anime);
    }

    /**
     * Aggiorna un anime esistente.
     * Richiede il ruolo di ADMIN.
     * 
     * @param animeId      L'ID dell'anime da aggiornare
     * @param animeUpdates L'oggetto Anime con i campi aggiornati
     * @return L'anime aggiornato
     */
    @PutMapping("/{animeId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public Anime updateAnime(@PathVariable Long animeId, @RequestBody Anime animeUpdates) {
        return this.animeService.updateAnime(animeId, animeUpdates);
    }

    /**
     * Elimina un anime esistente.
     * Richiede il ruolo di ADMIN.
     * 
     * @param animeId L'ID dell'anime da eliminare
     */
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
