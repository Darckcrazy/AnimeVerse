package com.example.Animeverse_JAVA.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "anime")
@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonIgnoreProperties({})
public class Anime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    @Column(name = "anime_id")
    private Long animeId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "episodes")
    private Integer episodes;

    @Column(name = "status")
    private String status;

    @Column(name = "genre")
    private String genre;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "studio")
    private String studio;

    public Anime(String title, String description, LocalDate releaseDate, Integer episodes, String status, String genre, String imageUrl, Double rating, String studio) {
        this.title = title;
        this.description = description;
        this.releaseDate = releaseDate;
        this.episodes = episodes;
        this.status = status;
        this.genre = genre;
        this.imageUrl = imageUrl;
        this.rating = rating;
        this.studio = studio;
    }
}
