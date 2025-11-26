package com.example.Animeverse_JAVA.Configuration;

import com.fasterxml.jackson.annotation.JsonIgnoreType;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hibernate.proxy.HibernateProxy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.web.client.RestTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean
    public Jackson2ObjectMapperBuilder jackson2ObjectMapperBuilder() {
        Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder();
        builder.mixIn(HibernateProxy.class, IgnoreHibernateProxyMixin.class);
        builder.mixIn(org.hibernate.proxy.pojo.bytebuddy.ByteBuddyInterceptor.class, IgnoreHibernateProxyMixin.class);
        return builder;
    }

    @JsonIgnoreType
    abstract class IgnoreHibernateProxyMixin {
    }
}