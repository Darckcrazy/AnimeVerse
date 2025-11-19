package com.example.Animeverse_JAVA.Payloads_DTO;

import java.time.LocalDateTime;

public record ErrorsDTO(String message, LocalDateTime timestamp) {
}