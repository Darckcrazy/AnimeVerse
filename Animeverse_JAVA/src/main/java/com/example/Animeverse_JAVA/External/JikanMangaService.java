package com.example.Animeverse_JAVA.External;

import com.example.Animeverse_JAVA.Entities.Manga;
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
public class JikanMangaService {

    private static final String JIKAN_BASE_URL = "https://api.jikan.moe/v4";
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public List<Manga> searchMangaFromJikan(String query) {
        try {
            String url = JIKAN_BASE_URL + "/manga?query=" + query + "&limit=10";
            HttpResponse<String> response = Unirest.get(url)
                    .asString();

            if (response.getStatus() == 200) {
                JsonNode responseBody = objectMapper.readTree(response.getBody());
                JsonNode mangaArray = responseBody.get("data");

                List<Manga> mangaList = new ArrayList<>();
                for (JsonNode mangaNode : mangaArray) {
                    Manga manga = mapJikanToManga(mangaNode);
                    mangaList.add(manga);
                }

                log.info("Found {} manga from Jikan API for query: {}", mangaList.size(), query);
                return mangaList;
            } else {
                log.error("Jikan API error: {} - {}", response.getStatus(), response.getBody());
            }
        } catch (Exception ex) {
            log.error("Error while searching manga from Jikan", ex);
        }

        return new ArrayList<>();
    }

    public Manga getMangaDetailsFromJikan(Long jikanId) {
        try {
            String url = JIKAN_BASE_URL + "/manga/" + jikanId;
            HttpResponse<String> response = Unirest.get(url)
                    .asString();

            if (response.getStatus() == 200) {
                JsonNode responseBody = objectMapper.readTree(response.getBody());
                JsonNode mangaNode = responseBody.get("data");

                log.info("Retrieved manga details from Jikan API for ID: {}", jikanId);
                return mapJikanToManga(mangaNode);
            } else {
                log.error("Jikan API error: {} - {}", response.getStatus(), response.getBody());
            }
        } catch (Exception ex) {
            log.error("Error while fetching manga details from Jikan", ex);
        }

        return null;
    }

    private Manga mapJikanToManga(JsonNode mangaNode) {
        Manga manga = new Manga();

        if (mangaNode.has("mal_id")) {
            manga.setJikanId(mangaNode.get("mal_id").asLong());
        }
        if (mangaNode.has("title")) {
            manga.setTitle(mangaNode.get("title").asText());
        }
        if (mangaNode.has("synopsis")) {
            manga.setSynopsis(mangaNode.get("synopsis").asText());
        }
        if (mangaNode.has("images") && mangaNode.get("images").has("jpg")) {
            manga.setImageUrl(mangaNode.get("images").get("jpg").get("image_url").asText());
        }
        if (mangaNode.has("chapters")) {
            manga.setChapters(mangaNode.get("chapters").asInt());
        }
        if (mangaNode.has("status")) {
            manga.setStatus(mangaNode.get("status").asText());
        }
        if (mangaNode.has("score")) {
            manga.setScore(mangaNode.get("score").asDouble());
        }
        if (mangaNode.has("year")) {
            manga.setYear(mangaNode.get("year").asInt());
        }

        return manga;
    }
}
