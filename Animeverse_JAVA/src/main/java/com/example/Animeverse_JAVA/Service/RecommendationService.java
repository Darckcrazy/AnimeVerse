package com.example.Animeverse_JAVA.Service;

import com.example.Animeverse_JAVA.Entities.Anime;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

        @Autowired
        private RestTemplate restTemplate;

        public List<Map<String, Object>> recommendForUser(Long userId, int limit) {
                try {
                        String userUrl = "http://localhost:8080/api/utente/" + userId;
                        ObjectMapper mapper = new ObjectMapper();
                        String userResp = restTemplate.getForObject(userUrl, String.class);
                        JsonNode userNode = mapper.readTree(userResp == null ? "{}" : userResp);
                        List<String> genres = new ArrayList<>();
                        if (userNode.has("preferenze")) {
                                userNode.get("preferenze").forEach(n -> genres.add(n.asText()));
                        }
                        LinkedHashSet<Map<String, Object>> results = new LinkedHashSet<>();
                        for (String g : genres) {
                                String q = "https://api.jikan.moe/v4/anime?q=" + java.net.URLEncoder.encode(g, "UTF-8")
                                                + "&limit=5";
                                String resp = restTemplate.getForObject(q, String.class);
                                if (resp == null)
                                        continue;
                                JsonNode root = mapper.readTree(resp);
                                if (root.has("data")) {
                                        for (JsonNode item : root.get("data")) {
                                                Map<String, Object> map = mapper.convertValue(item, Map.class);
                                                results.add(map);
                                                if (results.size() >= limit)
                                                        break;
                                        }
                                }
                                if (results.size() >= limit)
                                        break;
                        }
                        if (results.isEmpty()) {
                                String topUrl = "https://api.jikan.moe/v4/top/anime?limit=" + limit;
                                String resp = restTemplate.getForObject(topUrl, String.class);
                                if (resp != null) {
                                        JsonNode topRoot = mapper.readTree(resp);
                                        if (topRoot.has("data")) {
                                                for (JsonNode item : topRoot.get("data")) {
                                                        results.add(mapper.convertValue(item, Map.class));
                                                }
                                        }
                                }
                        }
                        return results.stream().limit(limit).collect(Collectors.toList());
                } catch (Exception e) {
                        return Collections.emptyList();
                }
        }

    public List<Anime> getRecommendationsByUser(Long utenteId) {
        return List.of();
    }
}
