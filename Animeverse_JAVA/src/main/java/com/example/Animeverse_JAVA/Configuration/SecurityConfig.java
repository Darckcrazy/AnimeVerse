package com.example.Animeverse_JAVA.Configuration;

import com.example.Animeverse_JAVA.Security.CustomUserDetailsService;
import com.example.Animeverse_JAVA.Security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors()
                .and()
                .csrf().disable() // disabilita CSRF per API REST (dev)
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/anime/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/manga/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/review/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/rating/**").permitAll()
                        .requestMatchers("/api/trending", "/api/recommendations/**").permitAll()
                        // Allow authenticated access to user-specific endpoints
                        .requestMatchers("/api/utenti/me").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/utenti/me/avatar").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/watchlist/me").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/watchlist").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/watchlist/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/watchlist/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/readlist/me").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/readlist").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/readlist/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/readlist/**").authenticated()
                        .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
