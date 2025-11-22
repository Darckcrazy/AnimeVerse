package com.example.Animeverse_JAVA.Controllers;

import com.example.Animeverse_JAVA.Entities.Utente;
import com.example.Animeverse_JAVA.Entities.Readlist;
import com.example.Animeverse_JAVA.Service.ReadlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/readlist")
public class ReadlistController {

    @Autowired
    private ReadlistService readlistService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Readlist addToReadlist(
            @AuthenticationPrincipal Utente currentUtente,
            @RequestParam Long mangaId,
            @RequestParam String status) {
        return this.readlistService.addToReadlist(currentUtente, mangaId, status);
    }

    @PutMapping("/{readlistId}")
    public Readlist updateStatus(
            @PathVariable Long readlistId,
            @RequestParam String status) {
        return this.readlistService.updateStatus(readlistId, status);
    }

    @DeleteMapping("/{readlistId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFromReadlist(@PathVariable Long readlistId) {
        this.readlistService.removeFromReadlist(readlistId);
    }

    @GetMapping("/user/{userId}")
    public List<Readlist> getUserReadlist(@PathVariable Long userId) {
        return this.readlistService.getUserReadlist(userId);
    }

    @GetMapping("/me")
    public List<Readlist> getMyReadlist(@AuthenticationPrincipal Utente currentUtente) {
        return this.readlistService.getUserReadlist(currentUtente.getUtenteId());
    }
}
