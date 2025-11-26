package com.example.Animeverse_JAVA.Controllers;

import com.example.Animeverse_JAVA.Entities.Utente;
import com.example.Animeverse_JAVA.Entities.Readlist;
import com.example.Animeverse_JAVA.Service.ReadlistService;
import com.example.Animeverse_JAVA.Service.UtentiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/readlist")
public class ReadlistController {

    @Autowired
    private ReadlistService readlistService;

    @Autowired
    private UtentiService utentiService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Readlist addToReadlist(
            @RequestParam Long mangaId,
            @RequestParam String status) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Utente currentUser = utentiService.findUtentiByEmail(email);
        return this.readlistService.addToReadlist(currentUser, mangaId, status);
    }

    @PutMapping("/{readlistId}")
    public Readlist updateStatus(
            @PathVariable Long readlistId,
            @RequestParam String status) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Utente currentUser = utentiService.findUtentiByEmail(email);
        return this.readlistService.updateStatus(readlistId, status, currentUser.getUtenteId());
    }

    @DeleteMapping("/{readlistId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFromReadlist(@PathVariable Long readlistId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Utente currentUser = utentiService.findUtentiByEmail(email);
        this.readlistService.removeFromReadlist(readlistId, currentUser.getUtenteId());
    }

    @GetMapping("/user/{userId}")
    public List<Readlist> getUserReadlist(@PathVariable Long userId) {
        return this.readlistService.getUserReadlist(userId);
    }

    @GetMapping("/me")
    public List<Readlist> getMyReadlist() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        Utente currentUser = utentiService.findUtentiByEmail(email);
        return this.readlistService.getUserReadlist(currentUser.getUtenteId());
    }
}
