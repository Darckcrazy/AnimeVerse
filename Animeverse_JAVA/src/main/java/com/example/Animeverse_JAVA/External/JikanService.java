package com.example.Animeverse_JAVA.External;

import com.example.Animeverse_JAVA.Entities.Anime;
import com.example.Animeverse_JAVA.Util.RateLimiter;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import kong.unirest.HttpResponse;
import kong.unirest.Unirest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class JikanService {

    private static final String JIKAN_BASE_URL = "https://api.jikan.moe/v4";
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private final RateLimiter rateLimiter;

    public JikanService() {
        // Jikan API allows 60 requests per minute with 2 concurrent requests
        // We'll be conservative and use 50 requests per minute to be safe
        this.rateLimiter = new RateLimiter(50, Duration.ofMinutes(1));
    }

    public List<Anime> searchAnimeFromJikan(String query) {
        try {
            rateLimiter.acquire();
            String url = JIKAN_BASE_URL + "/anime?query=" + query + "&limit=10";
            HttpResponse<String> response = Unirest.get(url)
                    .asString();

            if (response.getStatus() == 200) {
                JsonNode responseBody = objectMapper.readTree(response.getBody());
                JsonNode animeArray = responseBody.get("data");

                List<Anime> animeList = new ArrayList<>();
                for (JsonNode animeNode : animeArray) {
                    Anime anime = mapJikanToAnime(animeNode);
                    animeList.add(anime);
                }

                log.info("Found {} anime from Jikan API for query: {}", animeList.size(), query);
                return animeList;
            } else {
                log.error("Jikan API error: {} - {}", response.getStatus(), response.getBody());
            }
        } catch (Exception ex) {
            log.error("Error while searching anime from Jikan", ex);
        }

        return new ArrayList<>();
    }

    public Anime getAnimeDetailsFromJikan(Long jikanId) {
        try {
            rateLimiter.acquire();
            String url = JIKAN_BASE_URL + "/anime/" + jikanId;
            HttpResponse<String> response = Unirest.get(url)
                    .asString();

            if (response.getStatus() == 200) {
                JsonNode responseBody = objectMapper.readTree(response.getBody());
                JsonNode animeNode = responseBody.get("data");

                log.info("Retrieved anime details from Jikan API for ID: {}", jikanId);
                return mapJikanToAnime(animeNode);
            } else {
                log.error("Jikan API error: {} - {}", response.getStatus(), response.getBody());
            }
        } catch (Exception ex) {
            log.error("Error while fetching anime details from Jikan", ex);
        }

        return null;
    }

    private Anime mapJikanToAnime(JsonNode animeNode) {
        Anime anime = new Anime();

        if (animeNode.has("mal_id")) {
            anime.setJikanId(animeNode.get("mal_id").asLong());
        }
        if (animeNode.has("title")) {
            anime.setTitle(animeNode.get("title").asText());
        }
        if (animeNode.has("synopsis")) {
            anime.setSynopsis(animeNode.get("synopsis").asText());
        }
        if (animeNode.has("images")) {
            JsonNode images = animeNode.get("images");
            if (images.has("jpg") && images.get("jpg").has("image_url")) {
                anime.setImageUrl(images.get("jpg").get("image_url").asText());
            } else if (images.has("webp") && images.get("webp").has("image_url")) {
                anime.setImageUrl(images.get("webp").get("image_url").asText());
            }
        }
        if (animeNode.has("episodes")) {
            anime.setEpisodes(animeNode.get("episodes").asInt());
        }
        if (animeNode.has("status")) {
            anime.setStatus(animeNode.get("status").asText());
        }
        if (animeNode.has("score")) {
            anime.setScore(animeNode.get("score").asDouble());
        }
        if (animeNode.has("year")) {
            anime.setYear(animeNode.get("year").asInt());
        }

        return anime;
    }
}
