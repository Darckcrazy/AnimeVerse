package com.example.Animeverse_JAVA.Controllers;

import com.example.Animeverse_JAVA.Entities.Utente;
import com.example.Animeverse_JAVA.Payloads_DTO.AuthResponseDTO;
import com.example.Animeverse_JAVA.Payloads_DTO.LoginDTO;
import com.example.Animeverse_JAVA.Payloads_DTO.RegisterDTO;
import com.example.Animeverse_JAVA.Payloads_DTO.UtenteDTO;
import com.example.Animeverse_JAVA.Security.JwtTokenProvider;
import com.example.Animeverse_JAVA.Service.UtentiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Controller per la gestione dell'autenticazione e registrazione degli utenti.
 * Espone endpoint per il login e la registrazione degli utenti.
 * Tutti gli endpoint sono accessibili sotto il percorso base "/api/auth".
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

        @Autowired
        private AuthenticationManager authenticationManager; // Gestisce l'autenticazione degli utenti

        @Autowired
        private JwtTokenProvider tokenProvider; // Genera e valida i token JWT

        @Autowired
        private UtentiService utentiService; // Servizio per la gestione degli utenti

        /**
         * Registra un nuovo utente nel sistema.
         * 
         * @param registerDTO DTO contenente i dati di registrazione (username, email,
         *                    password)
         * @return ResponseEntity con l'utente appena creato e lo stato HTTP 201
         *         (CREATED)
         */
        @PostMapping("/register")
        public ResponseEntity<Utente> signup(@RequestBody RegisterDTO registerDTO) {
                // Crea un nuovo utente utilizzando i dati forniti
                Utente newUtente = this.utentiService.saveUtenti(
                                new UtenteDTO(
                                                registerDTO.username(),
                                                registerDTO.email(),
                                                registerDTO.password()));
                // Restituisce l'utente appena creato con lo stato HTTP 201 (CREATED)
                return new ResponseEntity<>(newUtente, HttpStatus.CREATED);
        }

        /**
         * Effettua il login di un utente e restituisce un token JWT per
         * l'autenticazione.
         * 
         * @param loginDTO DTO contenente le credenziali di accesso (email e password)
         * @return ResponseEntity con il token JWT e il tipo di autenticazione (Bearer)
         */
        @PostMapping("/login")
        public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDTO loginDTO) {
                // Autentica l'utente utilizzando l'email e la password fornite
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                loginDTO.email(),
                                                loginDTO.password()));

                // Genera un token JWT per l'utente autenticato
                String token = tokenProvider.generateToken(authentication);

                // Restituisce il token JWT con il prefisso "Bearer"
                return ResponseEntity.ok(new AuthResponseDTO(token, "Bearer"));
        }
}
