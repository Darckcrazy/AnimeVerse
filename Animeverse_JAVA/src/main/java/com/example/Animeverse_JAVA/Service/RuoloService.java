package com.example.Animeverse_JAVA.Service;

import com.example.Animeverse_JAVA.Entities.Ruolo;
import com.example.Animeverse_JAVA.Exceptions.BadRequestException;
import com.example.Animeverse_JAVA.Exceptions.NotFoundException;
import com.example.Animeverse_JAVA.Payloads_DTO.RuoloDTO;
import com.example.Animeverse_JAVA.Repository.RuoloRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RuoloService {

    @Autowired
    private RuoloRepository ruoloRepository;

    public Ruolo saveRuolo(RuoloDTO payload) {
        this.ruoloRepository.findBytipoRuolo(payload.tipoRuolo()).ifPresent(ruolo -> {
            throw new BadRequestException("il ruolo " + ruolo.getTipoRuolo() + " è gia in uso.");
        });
        Ruolo newRuolo = new Ruolo();

        newRuolo.setTipoRuolo(payload.tipoRuolo());

        return this.ruoloRepository.save(newRuolo);
    }

    public Ruolo findByIdRuolo(Long id) {
        return ruoloRepository.findById(id).orElseThrow(() ->
                new NotFoundException("Ruolo con id " + id + " non trovato!"));
    }

    public Ruolo updateRuolo(Long id, RuoloDTO payload) {
        Ruolo found = this.findByIdRuolo(id);


        found.setTipoRuolo(payload.tipoRuolo());

        return this.ruoloRepository.save(found);
    }

    public void deleteRuolo(Long id) {
        Ruolo ruolo = this.findByIdRuolo(id);
        this.ruoloRepository.delete(ruolo);
    }
}
