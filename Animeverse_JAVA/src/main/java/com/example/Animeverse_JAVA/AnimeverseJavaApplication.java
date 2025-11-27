package com.example.Animeverse_JAVA;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Classe principale dell'applicazione AnimeVerse.
 * Questa classe avvia l'applicazione Spring Boot e configura automaticamente
 * i componenti necessari grazie all'annotazione @SpringBootApplication.
 */
@SpringBootApplication
public class AnimeverseJavaApplication {

	/**
	 * Metodo main - Punto di ingresso dell'applicazione.
	 * Avvia il contesto di Spring Boot e inizializza l'applicazione.
	 *
	 * @param args Argomenti da riga di comando (non utilizzati in questo caso)
	 */
	public static void main(String[] args) {
		// Avvia l'applicazione Spring Boot
		SpringApplication.run(AnimeverseJavaApplication.class, args);
	}
}
