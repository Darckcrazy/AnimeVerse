package com.example.Animeverse_JAVA.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.util.*;

@Service
public class TrendingService {

    private final RestTemplate rest = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();
    private volatile List<Map<String, Object>> cachedTop = new ArrayList<>();

    @PostConstruct
    public void init() {
        fetchTop();
    }

    @Scheduled(fixedDelayString = "${trending.fetch.interval:3600000}")
    public void fetchTop() {
        try {
            String url = "https://api.jikan.moe/v4/top/anime?limit=10";
            String resp = rest.getForObject(url, String.class);
            List<Map<String, Object>> list = new ArrayList<>();
            if (resp != null) {
                JsonNode root = mapper.readTree(resp);
                if (root.has("data")) {
                    for (JsonNode item : root.get("data")) {
                        list.add(mapper.convertValue(item, Map.class));
                    }
                }
            }
            cachedTop = list;
        } catch (Exception ignored) {
        }
    }

    public List<Map<String, Object>> getTop() {
        return cachedTop;
    }
}