package com.example.Animeverse_JAVA.Controllers;

import com.example.Animeverse_JAVA.Payloads_DTO.UtenteDTO;
import com.example.Animeverse_JAVA.Service.UtentiService;
import com.example.Animeverse_JAVA.Entities.Utente;
import com.example.Animeverse_JAVA.Entities.Anime;
import com.example.Animeverse_JAVA.Service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Controller per la gestione degli utenti.
 * Espone endpoint per la gestione dei profili utente, inclusa la modifica,
 * eliminazione e visualizzazione dei profili, nonché la gestione degli avatar.
 * Tutti gli endpoint sono accessibili sotto il percorso base "/api/utenti".
 */
@RestController
@RequestMapping("/api/utenti")
public class UtenteController {

    @Autowired
    private UtentiService utentiService; // Servizio per la gestione degli utenti

    @Autowired
    private RecommendationService recommendationService; // Servizio per le raccomandazioni personalizzate

    /**
     * Recupera il profilo dell'utente corrente.
     * 
     * @return L'oggetto Utente corrispondente all'utente autenticato
     */
    @GetMapping("/me")
    public Utente getMyProfile() {
        // Ottiene l'autenticazione corrente dal contesto di sicurezza
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Estrae l'email dall'utente autenticato
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        // Restituisce l'utente corrispondente all'email
        return utentiService.findUtentiByEmail(email);
    }

    /**
     * Aggiorna il profilo dell'utente corrente.
     * 
     * @param bodyUtente DTO contenente i dati aggiornati del profilo
     * @return L'oggetto Utente aggiornato
     */
    @PutMapping("/me")
    public Utente getMyProfileAndUpdate(@RequestBody UtenteDTO bodyUtente) {
        // Ottiene l'utente corrente dal contesto di sicurezza
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Utente currentUser = utentiService.findUtentiByEmail(email);
        // Aggiorna l'utente con i nuovi dati (la gestione dei generi preferiti è
        // gestita dal servizio)
        return this.utentiService.findUtentiByIdAndUpdate(currentUser.getUtenteId(), bodyUtente);
    }

    /**
     * Ottiene raccomandazioni personalizzate per l'utente corrente.
     * 
     * @param authHeader Header di autorizzazione contenente il token JWT
     * @return Una lista di anime raccomandati per l'utente corrente
     */
    @GetMapping("/me/recommendations")
    public List<Anime> getMyRecommendations(@RequestHeader(value = "Authorization") String authHeader) {
        // Ottiene l'utente corrente dal contesto di sicurezza
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Utente currentUser = utentiService.findUtentiByEmail(email);
        // Restituisce le raccomandazioni personalizzate per l'utente
        return this.recommendationService.getRecommendationsByUser(currentUser.getUtenteId(), authHeader);
    }

    /**
     * Aggiorna l'immagine del profilo dell'utente corrente.
     * 
     * @param file File immagine da utilizzare come avatar
     * @return L'oggetto Utente con l'avatar aggiornato
     */
    @PostMapping("/me/avatar")
    public Utente updateMyAvatar(@RequestParam("file") MultipartFile file) {
        // Ottiene l'utente corrente dal contesto di sicurezza
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Utente currentUser = utentiService.findUtentiByEmail(email);
        // Carica il nuovo avatar per l'utente
        return this.utentiService.uploadAvatarProfile(file, currentUser.getUtenteId());
    }

    /**
     * Elimina il profilo dell'utente corrente.
     * Imposta lo stato HTTP a 204 (NO_CONTENT) in caso di successo.
     */
    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMyProfile() {
        // Ottiene l'utente corrente dal contesto di sicurezza
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Utente currentUser = utentiService.findUtentiByEmail(email);
        // Elimina l'utente corrente
        this.utentiService.findUtentiByIdAndDelete(currentUser.getUtenteId());
    }

    /**
     * Recupera tutti gli utenti con paginazione.
     * Richiede il ruolo di ADMIN.
     * 
     * @param page   Numero di pagina (iniziando da 0)
     * @param size   Dimensione della pagina (numero di elementi per pagina)
     * @param sortBy Campo per l'ordinamento (predefinito: "utenteId")
     * @return Una pagina di oggetti Utente
     */
    @GetMapping
    @PreAuthorize(("hasAuthority('ADMIN')"))
    public Page<Utente> getAllUtenti(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "utenteId") String sortBy) {
        return this.utentiService.findAllUtenti(page, size, sortBy);
    }

    /**
     * Recupera tutti gli utenti senza paginazione.
     * Richiede il ruolo di ADMIN.
     * 
     * @return Una lista di tutti gli utenti
     */
    @GetMapping("/all")
    @PreAuthorize(("hasAuthority('ADMIN')"))
    public List<Utente> getAllUtentiWithoutPagination() {
        return this.utentiService.findAllUtentiWithoutPagination();
    }

    /**
     * Recupera un singolo utente tramite ID.
     * Richiede il ruolo di ADMIN.
     * 
     * @param idUtente L'ID dell'utente da cercare
     * @return L'oggetto Utente corrispondente all'ID specificato
     */
    @GetMapping("/{idUtente}")
    @PreAuthorize(("hasAuthority('ADMIN')"))
    public Utente getUtenteById(@PathVariable Long idUtente) {
        return this.utentiService.findUtentiById(idUtente);
    }

    /**
     * Elimina un utente tramite ID.
     * Richiede il ruolo di ADMIN.
     * Imposta lo stato HTTP a 204 (NO_CONTENT) in caso di successo.
     * 
     * @param idUtente L'ID dell'utente da eliminare
     */
    @DeleteMapping("/{idUtente}")
    @PreAuthorize(("hasAuthority('ADMIN')"))
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void getUtenteByIdAndDelete(@PathVariable Long idUtente) {
        this.utentiService.findUtentiByIdAndDelete(idUtente);
    }
}
