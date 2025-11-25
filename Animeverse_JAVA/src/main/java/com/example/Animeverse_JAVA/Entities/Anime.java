package com.example.Animeverse_JAVA.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "anime")
@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class Anime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    @Column(name = "anime_id")
    private Long animeId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "synopsis", columnDefinition = "TEXT")
    private String synopsis;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "episodes")
    private Integer episodes;

    @Column(name = "status")
    private String status;

    @Column(name = "score")
    private Double score;

    @Column(name = "year")
    private Integer year;

    @Column(name = "jikan_id")
    @JsonProperty("mal_id")
    private Long jikanId;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "anime_genres", joinColumns = @JoinColumn(name = "anime_id"))
    @Column(name = "genre")
    private Set<String> genres;

    public Anime(String title, String synopsis, String imageUrl, Integer episodes, String status, Double score,
            Integer year, Long jikanId) {
        this.title = title;
        this.synopsis = synopsis;
        this.imageUrl = imageUrl;
        this.episodes = episodes;
        this.status = status;
        this.score = score;
        this.year = year;
        this.jikanId = jikanId;
    }

    public Set<String> getGenres() {
        return genres;
    }

    public void setGenres(Set<String> genres) {
        this.genres = genres;
    }
}
