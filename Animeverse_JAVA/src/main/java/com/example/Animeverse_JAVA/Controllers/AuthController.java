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

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UtentiService utentiService;

    @PostMapping("/signup")
    public ResponseEntity<Utente> signup(@RequestBody RegisterDTO registerDTO) {
        Utente newUtente = this.utentiService.saveUtenti(
                new UtenteDTO(
                        registerDTO.username(),
                        registerDTO.email(),
                        registerDTO.password()
                )
        );
        return new ResponseEntity<>(newUtente, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDTO loginDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.email(),
                        loginDTO.password()
                )
        );

        String token = tokenProvider.generateToken(authentication);
        return ResponseEntity.ok(new AuthResponseDTO(token, "Bearer"));
    }
}
