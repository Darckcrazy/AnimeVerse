package com.example.Animeverse_JAVA.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "manga")
@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonIgnoreProperties({})
public class Manga {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    @Column(name = "manga_id")
    private Long mangaId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "chapters")
    private Integer chapters;

    @Column(name = "status")
    private String status;

    @Column(name = "genre")
    private String genre;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "rating")
    private Double rating;

    @Column(name = "author")
    private String author;

    @Column(name = "illustrator")
    private String illustrator;

    public Manga(String title, String description, LocalDate releaseDate, Integer chapters, String status, String genre, String imageUrl, Double rating, String author, String illustrator) {
        this.title = title;
        this.description = description;
        this.releaseDate = releaseDate;
        this.chapters = chapters;
        this.status = status;
        this.genre = genre;
        this.imageUrl = imageUrl;
        this.rating = rating;
        this.author = author;
        this.illustrator = illustrator;
    }
}
