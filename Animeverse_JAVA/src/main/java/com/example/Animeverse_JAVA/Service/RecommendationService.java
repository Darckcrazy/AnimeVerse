package com.example.Animeverse_JAVA.Service;

import com.example.Animeverse_JAVA.Entities.Anime;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class RecommendationService {

        @Value("${server.port:3001}")
        private String serverPort;

        @Value("${jwt.secret:defaultSecretKey}")
        private String jwtSecret;

        @Autowired
        private RestTemplate restTemplate;

        private final ObjectMapper objectMapper = new ObjectMapper();

        public List<Anime> getRecommendationsByUser(Long userId, String authHeader) {
                if (userId == null) {
                        log.error("ID utente non valido: null");
                        throw new IllegalArgumentException("ID utente non valido");
                }

                try {
                        String url = String.format("http://localhost:%s/api/utenti/%d/recommendations", serverPort,
                                        userId);
                        log.debug("Fetching recommendations from: {}", url);

                        HttpHeaders headers = new HttpHeaders();
                        headers.setContentType(MediaType.APPLICATION_JSON);
                        if (authHeader != null && authHeader.startsWith("Bearer ")) {
                                headers.set("Authorization", authHeader);
                                log.debug("Added Authorization header to recommendation request");
                        } else {
                                log.warn("No valid Authorization header provided for recommendations");
                        }

                        HttpEntity<?> entity = new HttpEntity<>(headers);

                        try {
                                ResponseEntity<String> response = restTemplate.exchange(
                                                url,
                                                HttpMethod.GET,
                                                entity,
                                                String.class);

                                if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                                        JsonNode rootNode = objectMapper.readTree(response.getBody());
                                        if (rootNode.isArray()) {
                                                return objectMapper.convertValue(rootNode,
                                                                TypeFactory.defaultInstance().constructCollectionType(
                                                                                List.class, Anime.class));
                                        }
                                }
                        } catch (Exception e) {
                                log.warn("Error fetching recommendations from API, using default recommendations: {}",
                                                e.getMessage());
                        }

                        log.warn("Using default recommendations due to empty or invalid response");
                        return getDefaultRecommendations(10);

                } catch (Exception e) {
                        log.error("Error in getRecommendationsByUser for user {}: {}", userId, e.getMessage(), e);
                        return getDefaultRecommendations(10);
                }
        }

        private List<Anime> getDefaultRecommendations(int limit) {
                try {
                        String apiUrl = "https://api.jikan.moe/v4/top/anime?limit=" + limit;
                        log.debug("Fetching default recommendations from: {}", apiUrl);

                        String apiResponse = restTemplate.getForObject(apiUrl, String.class);

                        if (apiResponse != null) {
                                JsonNode rootNode = objectMapper.readTree(apiResponse);
                                JsonNode dataNode = rootNode.path("data");

                                List<Anime> recommendations = new ArrayList<>();
                                for (JsonNode item : dataNode) {
                                        try {
                                                Anime anime = new Anime();
                                                anime.setJikanId(item.path("mal_id").asLong());
                                                anime.setTitle(item.path("title").asText());
                                                anime.setSynopsis(item.path("synopsis").asText());
                                                anime.setImageUrl(item.path("images").path("jpg").path("image_url")
                                                                .asText());
                                                anime.setEpisodes(item.path("episodes").asInt());
                                                anime.setStatus(item.path("status").asText());
                                                anime.setScore(item.path("score").asDouble());
                                                anime.setYear(item.path("year").asInt());

                                                Set<String> genres = new HashSet<>();
                                                item.path("genres").forEach(
                                                                genre -> genres.add(genre.path("name").asText()));
                                                anime.setGenres(genres);

                                                recommendations.add(anime);
                                        } catch (Exception e) {
                                                log.warn("Error parsing anime item: {}", e.getMessage());
                                        }
                                }
                                return recommendations;
                        }
                } catch (Exception e) {
                        log.error("Error fetching default recommendations: {}", e.getMessage(), e);
                }
                return Collections.emptyList();
        }

        public List<Map<String, Object>> recommendForUser(Long userId, int limit, String authHeader) {
                try {
                        List<Anime> animeList = getRecommendationsByUser(userId, authHeader);
                        return animeList.stream()
                                        .limit(limit)
                                        .map(anime -> {
                                                Map<String, Object> animeMap = new HashMap<>();
                                                animeMap.put("animeId", anime.getJikanId());
                                                animeMap.put("title", anime.getTitle());
                                                animeMap.put("imageUrl", anime.getImageUrl());
                                                animeMap.put("score", anime.getScore());
                                                animeMap.put("year", anime.getYear());
                                                return animeMap;
                                        })
                                        .collect(Collectors.toList());
                } catch (Exception e) {
                        log.error("Error in recommendForUser: {}", e.getMessage(), e);
                        return Collections.emptyList();
                }
        }
}
