package com.example.Animeverse_JAVA.Controllers;

import com.example.Animeverse_JAVA.Service.TrendingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class TrendingController {

    @Autowired
    private TrendingService trendingService;

    @GetMapping("/api/trending")
    public ResponseEntity<List<Map<String, Object>>> getTrending() {
        return ResponseEntity.ok(trendingService.getTop());
    }
}