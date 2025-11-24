package com.example.Animeverse_JAVA.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonIgnoreProperties({ "password", "authorities", "enabled", "accountNonLocked", "accountNonExpired",
        "credentialsNonExpired" })
public class Utente implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    private Long utenteId;
    // @Column(nullable = false, unique = true)
    private String username;
    // @Column(nullable = false, unique = true)
    private String email;
    // @Column(nullable = false, unique = true)
    private String password;

    @Column(name = "avatar_url", nullable = false, unique = true)
    private String avatarURL;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "utente_ruoli", joinColumns = @JoinColumn(name = "utenteId"), inverseJoinColumns = @JoinColumn(name = "ruoloId"))
    private List<Ruolo> ruolo = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "utente_favorite_genres", joinColumns = @JoinColumn(name = "utente_id"))
    @Column(name = "genre")
    private Set<String> favoriteGenres;

    public Utente(
            String username,
            String email,
            String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // Metodi

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return ruolo.stream().map(ruolo -> new SimpleGrantedAuthority(ruolo.getTipoRuolo()))
                .collect(Collectors.toList());
    }
}
