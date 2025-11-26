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

@RestController
@RequestMapping("/api/utenti")
public class UtenteController {

    @Autowired
    private UtentiService utentiService;

    @Autowired
    private RecommendationService recommendationService;

    // endpoint "/me"
    // GET mio profilo
    @GetMapping("/me")
    public Utente getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        return utentiService.findUtentiByEmail(email);
    }

    // PUT mio profilo
    @PutMapping("/me")
    public Utente getMyProfileAndUpdate(@RequestBody UtenteDTO bodyUtente) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Utente currentUser = utentiService.findUtentiByEmail(email);
        // Note: favoriteGenres handling is done by service using DTO
        return this.utentiService.findUtentiByIdAndUpdate(currentUser.getUtenteId(), bodyUtente);
    }

    // GET personalized recommendations for current user
    @GetMapping("/me/recommendations")
    public List<Anime> getMyRecommendations(@RequestHeader(value = "Authorization") String authHeader) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Utente currentUser = utentiService.findUtentiByEmail(email);
        return this.recommendationService.getRecommendationsByUser(currentUser.getUtenteId(), authHeader);
    }

    // PATCH dell'immagine profilo
    @PatchMapping("/me/avatarUrl")
    public Utente updateMyAvatar(@RequestParam("avatarUrl") MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Utente currentUser = utentiService.findUtentiByEmail(email);
        return this.utentiService.uploadAvatarProfile(file, currentUser.getUtenteId());
    }

    // DELETE mio profilo
    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Utente currentUser = utentiService.findUtentiByEmail(email);
        this.utentiService.findUtentiByIdAndDelete(currentUser.getUtenteId());
    }

    // GET utenti (paginato)
    @GetMapping
    @PreAuthorize(("hasAuthority('ADMIN')"))
    public Page<Utente> getAllUtenti(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "utenteId") String sortBy) {
        return this.utentiService.findAllUtenti(page, size, sortBy);
    }

    // GET tutti gli utenti (senza paginazione)
    @GetMapping("/all")
    @PreAuthorize(("hasAuthority('ADMIN')"))
    public List<Utente> getAllUtentiWithoutPagination() {
        return this.utentiService.findAllUtentiWithoutPagination();
    }

    // GET singolo utente
    @GetMapping("/{idUtente}")
    @PreAuthorize(("hasAuthority('ADMIN')"))
    public Utente getUtenteById(@PathVariable Long idUtente) {
        return this.utentiService.findUtentiById(idUtente);
    }

    // DELETE utente
    @DeleteMapping("/{idUtente}")
    @PreAuthorize(("hasAuthority('ADMIN')"))
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void getUtenteByIdAndDelete(@PathVariable Long idUtente) {
        this.utentiService.findUtentiByIdAndDelete(idUtente);
    }
}
