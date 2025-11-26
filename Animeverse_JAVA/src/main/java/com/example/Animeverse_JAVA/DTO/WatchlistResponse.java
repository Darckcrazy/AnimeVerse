package com.example.Animeverse_JAVA.DTO;

import com.example.Animeverse_JAVA.Entities.Watchlist;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WatchlistResponse {
    private Long watchlistId;
    private Long animeId;
    private String animeTitle;
    private String animeImageUrl;
    private String status;
    private Integer episodesWatched;
    private LocalDate dateAdded;
    private Double rating;

    public static WatchlistResponse fromEntity(Watchlist watchlist) {
        WatchlistResponse response = new WatchlistResponse();
        response.setWatchlistId(watchlist.getWatchlistId());
        response.setAnimeId(watchlist.getAnime().getAnimeId());
        response.setAnimeTitle(watchlist.getAnime().getTitle());
        response.setAnimeImageUrl(watchlist.getAnime().getImageUrl());
        response.setStatus(watchlist.getStatus());
        response.setEpisodesWatched(watchlist.getEpisodesWatched());
        response.setDateAdded(watchlist.getDateAdded());
        response.setRating(watchlist.getRating());
        return response;
    }
}
