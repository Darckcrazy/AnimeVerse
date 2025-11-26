package com.example.Animeverse_JAVA.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "readlist", uniqueConstraints = {
    @UniqueConstraint(name = "uk_readlist_utente_manga", columnNames = {"utente_id", "manga_id"})
})
@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class Readlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    @Column(name = "readlist_id")
    private Long readlistId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utente_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Utente utente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manga_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Manga manga;

    @Column(name = "status")
    private String status;

    @Column(name = "chapters_read")
    private Integer chaptersRead;

    @Column(name = "date_added")
    private LocalDate dateAdded;

    @Column(name = "rating")
    private Double rating;

    public Readlist(Utente utente, Manga manga, String status, Integer chaptersRead, LocalDate dateAdded, Double rating) {
        this.utente = utente;
        this.manga = manga;
        this.status = status;
        this.chaptersRead = chaptersRead;
        this.dateAdded = dateAdded;
        this.rating = rating;
    }
}
