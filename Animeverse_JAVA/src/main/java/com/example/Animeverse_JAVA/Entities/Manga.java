package com.example.Animeverse_JAVA.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

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

    @Column(name = "synopsis", columnDefinition = "TEXT")
    private String synopsis;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "chapters")
    private Integer chapters;

    @Column(name = "status")
    private String status;

    @Column(name = "score")
    private Double score;

    @Column(name = "year")
    private Integer year;

    @Column(name = "jikan_id")
    private Long jikanId;

    public Manga(String title, String synopsis, String imageUrl, Integer chapters, String status, Double score, Integer year, Long jikanId) {
        this.title = title;
        this.synopsis = synopsis;
        this.imageUrl = imageUrl;
        this.chapters = chapters;
        this.status = status;
        this.score = score;
        this.year = year;
        this.jikanId = jikanId;
    }
}
