package com.example.Animeverse_JAVA.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "watchlist", uniqueConstraints = {
    @UniqueConstraint(name = "uk_watchlist_utente_anime", columnNames = {"utente_id", "anime_id"})
})
@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class Watchlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    @Column(name = "watchlist_id")
    private Long watchlistId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utente_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Utente utente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "anime_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Anime anime;

    @Column(name = "status")
    private String status;

    @Column(name = "episodes_watched")
    private Integer episodesWatched;

    @Column(name = "date_added")
    private LocalDate dateAdded;

    @Column(name = "rating")
    private Double rating;

    public Watchlist(Utente utente, Anime anime, String status, Integer episodesWatched, LocalDate dateAdded, Double rating) {
        this.utente = utente;
        this.anime = anime;
        this.status = status;
        this.episodesWatched = episodesWatched;
        this.dateAdded = dateAdded;
        this.rating = rating;
    }
}
