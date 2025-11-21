package com.example.Animeverse_JAVA.Controllers;

import com.example.Animeverse_JAVA.Payloads_DTO.UtenteDTO;
import com.example.Animeverse_JAVA.Service.UtentiService;
import com.example.Animeverse_JAVA.Entities.Utente;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@RequestMapping("/utenti")
public class UtenteController {

    @Autowired
    private UtentiService utentiService;

    // endpoint "/me"
    // GET mio profilo
    @GetMapping("/me")
    public Utente getMyProfile(@AuthenticationPrincipal Utente currentUtente){
        return currentUtente;
    }
    // PUT mio profilo
    @PutMapping("/me")
    public Utente getMyProfileAndUpdate(@AuthenticationPrincipal Utente currentUtente, @RequestBody UtenteDTO bodyUtente){
        return this.utentiService.findUtentiByIdAndUpdate(currentUtente.getUtenteId(), bodyUtente);
    }
    // PATCH dell'immagine profilo
    @PatchMapping("/me/avatarUrl")
    public Utente updateMyAvatar(@AuthenticationPrincipal Utente currentUtente, @RequestParam("avatarUrl")MultipartFile file){
        System.out.println("| Nome del file: " + file.getName());
        System.out.println("| Dimensione del file: " + file.getSize());
        return this.utentiService.uploadAvatarProfile(file, currentUtente.getUtenteId());
    }
    // DELETE mio profilo
    @DeleteMapping("/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMyProfile(@AuthenticationPrincipal Utente currentUtente){
        this.utentiService.findUtentiByIdAndDelete(currentUtente.getUtenteId());
    }


    // GET utenti (paginato)
    @GetMapping
    @PreAuthorize(("hasAuthority('ADMIN')"))
    public Page<Utente> getAllUtenti(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size, @RequestParam(defaultValue = "utenteId") String sortBy){
        return this.utentiService.findAllUtenti(page,size,sortBy);
    }
    // GET tutti gli utenti (senza paginazione)
    @GetMapping("/all")
    @PreAuthorize(("hasAuthority('ADMIN')"))
    public List<Utente> getAllUtentiWithoutPagination(){
        return this.utentiService.findAllUtentiWithoutPagination();
    }
    // GET singolo utente
    @GetMapping("/{idUtente}")
    @PreAuthorize(("hasAuthority('ADMIN')"))
    public Utente getUtenteById(@PathVariable Long idUtente){
        return this.utentiService.findUtentiById(idUtente);
    }

    // DELETE utente
    @DeleteMapping("/{idUtente}")
    @PreAuthorize(("hasAuthority('ADMIN')"))
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void getUtenteByIdAndDelete(@PathVariable Long idUtente){
        this.utentiService.findUtentiByIdAndDelete(idUtente);
    }



}