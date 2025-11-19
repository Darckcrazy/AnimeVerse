package com.example.Animeverse_JAVA.Payloads_DTO;

import com.example.Animeverse_JAVA.Entities.Ruolo;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record UtenteDTO(

        @NotBlank(message = "Lo username è obbligatorio")
        @Size(min = 2, max = 20, message = "Il nome deve avere un minimo di due caratteri e un massimo di 20")
        String username,
        @NotBlank(message = "L'e-mail è obbligatoria")
        @Email(message = "L'indirizzo e-mail non è nel formato giusto")
        String email,
        @NotBlank(message = "La password è obbligatoria")
        String password
) {
}