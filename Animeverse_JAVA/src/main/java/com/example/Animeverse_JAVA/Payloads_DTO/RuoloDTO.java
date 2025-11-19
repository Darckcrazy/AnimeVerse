package com.example.Animeverse_JAVA.Payloads_DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RuoloDTO(
        @NotBlank(message = "Il ruolo è obbligatorio")
        @Size(min = 2, max = 10, message = "Il ruolo deve contenere un minimo di 2 caratteri e un massimo di 10")
        String tipoRuolo
) {
}
