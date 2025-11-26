package com.example.Animeverse_JAVA.External;

import com.example.Animeverse_JAVA.Entities.Manga;
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
public class JikanMangaService {

    private static final String JIKAN_BASE_URL = "https://api.jikan.moe/v4";
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private final RateLimiter rateLimiter;

    public JikanMangaService() {
        // Jikan API allows 60 requests per minute with 2 concurrent requests
        // We'll be conservative and use 50 requests per minute to be safe
        this.rateLimiter = new RateLimiter(50, Duration.ofMinutes(1));
    }

    public List<Manga> searchMangaFromJikan(String query) {
        try {
            rateLimiter.acquire();
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
            rateLimiter.acquire();
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
        // Fix for image URL - handle both formats from Jikan API
        if (mangaNode.has("images")) {
            JsonNode images = mangaNode.get("images");
            if (images.has("jpg")) {
                JsonNode jpg = images.get("jpg");
                if (jpg.has("image_url")) {
                    manga.setImageUrl(jpg.get("image_url").asText().replace("\\/", "/"));
                } else if (jpg.has("large_image_url")) {
                    manga.setImageUrl(jpg.get("large_image_url").asText().replace("\\/", "/"));
                }
            }
        }
        if (mangaNode.has("chapters") && !mangaNode.get("chapters").isNull()) {
            manga.setChapters(mangaNode.get("chapters").asInt());
        }
        if (mangaNode.has("status")) {
            manga.setStatus(mangaNode.get("status").asText());
        }
        if (mangaNode.has("score") && !mangaNode.get("score").isNull()) {
            manga.setScore(mangaNode.get("score").asDouble());
        }
        if (mangaNode.has("published") && mangaNode.get("published").has("prop")
                && mangaNode.get("published").get("prop").has("from")
                && mangaNode.get("published").get("prop").get("from").has("year")) {
            JsonNode yearNode = mangaNode.get("published").get("prop").get("from").get("year");
            if (!yearNode.isNull()) {
                manga.setYear(yearNode.asInt());
            }
        } else if (mangaNode.has("year") && !mangaNode.get("year").isNull()) {
            manga.setYear(mangaNode.get("year").asInt());
        }

        return manga;
    }
}
