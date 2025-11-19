package com.example.Animeverse_JAVA.Entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ruolo")
@Getter
@Setter
@NoArgsConstructor
@ToString
@JsonIgnoreProperties({"listaUtenteRuoli"})
public class Ruolo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Setter(AccessLevel.NONE)
    @Column(name = "ruolo_id")
    private Long ruoloId;
    @Column(name = "tipo_ruolo", unique = true)
    private String tipoRuolo;

    @ManyToMany(mappedBy = "ruolo")
    private List<Utente> ListaUtenteRuoli = new ArrayList<>();

    public Ruolo(String tipoRuolo) {
        this.tipoRuolo = tipoRuolo;
    }
}
