package com.example.Animeverse_JAVA.Service;

import com.example.Animeverse_JAVA.Entities.Ruolo;
import com.example.Animeverse_JAVA.Entities.Utente;
import com.example.Animeverse_JAVA.Exceptions.BadRequestException;
import com.example.Animeverse_JAVA.Exceptions.IdNotFoundException;
import com.example.Animeverse_JAVA.Exceptions.NotFoundException;
import com.example.Animeverse_JAVA.Payloads_DTO.UtenteDTO;
import com.example.Animeverse_JAVA.Repository.UtenteRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class UtentiService {
    @Autowired
    private UtenteRepository utenteRepository;
    @Autowired
    private PasswordEncoder bcrypt;
    @Autowired
    private Cloudinary getAvatarImage;
    @Autowired
    private RuoloService ruoloService;

    // Creo delle variabili per dei controlli sull'inserimento dell'avatar del
    // profilo
    private static final long MAX_SIZE = 5 * 1024 * 1024;
    private static final List<String> ALLOWED_FORMAT = List.of("image/jpeg", "image/png");

    // FIND ALL (paginato)

    public Page<Utente> findAllUtenti(int pageNumber, int pageSize, String sortBy) {
        if (pageSize > 50)
            pageSize = 50;
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(sortBy).ascending());
        return this.utenteRepository.findAll(pageable);
    }

    // FIND ALL (senza paginazione)

    public List<Utente> findAllUtentiWithoutPagination() {
        return this.utenteRepository.findAll();
    }

    // SAVE

    public Utente saveUtenti(UtenteDTO payload) {
        this.utenteRepository.findByEmail(payload.email()).ifPresent(utente -> {
            throw new BadRequestException("The e-mail " + utente.getEmail() + " is already in use.");
        });

        Utente newUtente = new Utente(payload.username(),
                payload.email(),
                bcrypt.encode(payload.password()));

        Ruolo ruoloFound = this.ruoloService.findByIdRuolo(2L);

        newUtente.setAvatarURL("https://ui-avatars.com/api/?name=");
        newUtente.getRuolo().add(ruoloFound);

        if (payload.favoriteGenres() != null) {
            newUtente.setFavoriteGenres(payload.favoriteGenres());
        }

        Utente savedUtente = this.utenteRepository.save(newUtente);

        log.info("The user with ID: " + savedUtente.getUtenteId() + " has been duly saved.");

        return savedUtente;
    }

    // FIND BY ID & UPDATE

    public Utente findUtentiByIdAndUpdate(Long utenteId, UtenteDTO payload) {
        Utente found = this.findUtentiById(utenteId);

        if (!found.getEmail().equals(payload.email())) {
            this.utenteRepository.findByEmail(payload.email()).ifPresent(utente -> {
                throw new BadRequestException("The email " + utente.getEmail() + " has not been found. Try again.");
            });
        }

        found.setUsername(payload.username());
        found.setEmail(payload.email());
        found.setPassword(bcrypt.encode(payload.password()));

        if (payload.favoriteGenres() != null) {
            found.setFavoriteGenres(payload.favoriteGenres());
        }

        Utente modifyUtente = this.utenteRepository.save(found);

        log.info("User with ID: " + modifyUtente.getUtenteId() + " has been duly updated.");

        return modifyUtente;
    }

    // UPDATE dell'avatar del profilo
    public Utente uploadAvatarProfile(MultipartFile file, Long idUtente) {

        if (file == null || file.isEmpty())
            throw new BadRequestException("File vuoto o non presente!");
        if (file.getSize() > MAX_SIZE)
            throw new BadRequestException("Attenzione, il file è superiore ai 5MB di dimensione");
        if (file.getContentType() == null || !(ALLOWED_FORMAT.contains(file.getContentType())))
            throw new BadRequestException(
                    "Attenzione, il formato non è corretto, deve essere del seguente tipo: (.jpeg) / (.png)");

        Utente utenteFound = this.findUtentiById(idUtente);

        try {
            // Upload e cattura dell'URL dell'immagine
            Map resultMap = getAvatarImage.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            String imageUrl = (String) resultMap.get("url");

            if (imageUrl == null || imageUrl.trim().isEmpty()) {
                throw new BadRequestException("Impossibile ottenere l'URL dell'immagine dall'upload");
            }

            // Salvataggio dell'immagine catturata
            utenteFound.setAvatarURL(imageUrl);
            this.utenteRepository.save(utenteFound);
            return utenteFound;
        } catch (Exception ex) {
            log.error("Errore nell'upload dell'immagine", ex);
            throw new BadRequestException("Errore nell'upload dell'immagine: " + ex.getMessage());
        }
    }

    // FIND BY ID & DELETE

    public void findUtentiByIdAndDelete(Long utenteId) {
        Utente found = this.findUtentiById(utenteId);
        this.utenteRepository.delete(found);
    }

    // FIND BY EMAIL

    public Utente findUtentiByEmail(String email) {
        return this.utenteRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User with email " + email + " has not been found."));
    }

    // FIND BY ID

    public Utente findUtentiById(Long utenteId) {
        return this.utenteRepository.findById(utenteId)
                .orElseThrow(() -> new IdNotFoundException("L'utente con ID: " + utenteId + " non è stato trovato"));
    }
}