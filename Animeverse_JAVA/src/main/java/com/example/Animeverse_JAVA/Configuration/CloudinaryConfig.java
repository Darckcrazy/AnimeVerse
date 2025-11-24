package com.example.Animeverse_JAVA.Configuration;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud_name:}")
    private String cloudName;

    @Value("${cloudinary.api_key:}")
    private String apiKey;

    @Value("${cloudinary.api_secret:}")
    private String apiSecret;

    @Bean("getAvatarImage")
    public Cloudinary getAvatarImage() {
        Map<String, String> config = new HashMap<>();
        // usa le chiavi standard attese dalla libreria Cloudinary
        if (cloudName != null && !cloudName.isEmpty())
            config.put("cloud_name", cloudName);
        if (apiKey != null && !apiKey.isEmpty())
            config.put("api_key", apiKey);
        if (apiSecret != null && !apiSecret.isEmpty())
            config.put("api_secret", apiSecret);
        return new Cloudinary(config);
    }
}