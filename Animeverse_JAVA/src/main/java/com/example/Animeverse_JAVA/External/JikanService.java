package com.example.Animeverse_JAVA.External;

import com.example.Animeverse_JAVA.Entities.Anime;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import kong.unirest.HttpResponse;
import kong.unirest.Unirest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class JikanService {

    private static final String JIKAN_BASE_URL = "https://api.jikan.moe/v4";
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public List<Anime> searchAnimeFromJikan(String query) {
        try {
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
        if (animeNode.has("images") && animeNode.get("images").has("jpg")) {
            anime.setImageUrl(animeNode.get("images").get("jpg").get("image_url").asText());
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
