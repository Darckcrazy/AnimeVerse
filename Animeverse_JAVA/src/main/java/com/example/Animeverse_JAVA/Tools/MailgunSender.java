package com.example.Animeverse_JAVA.Tools;

import com.example.Animeverse_JAVA.Entities.Utente;
import kong.unirest.HttpResponse;
import kong.unirest.JsonNode;
import kong.unirest.Unirest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(prefix = "mailgun", name = "domain")
public class MailgunSender {

    private final String domain;
    private final String apiKey;
    private final String from;

    public MailgunSender(@Value("${mailgun.domain}") String domain,
            @Value("${mailgun.apiKey:}") String apiKey,
            @Value("${mailgun.from:}") String from) {
        this.domain = domain;
        this.apiKey = apiKey;
        this.from = from;
    }

    public void sendRegistrationEmail(Utente recipient) {
        HttpResponse<JsonNode> response = Unirest.post("https://ap.mailgun.net/v3/" + this.domain + "/messages")
                .basicAuth("api", this.apiKey)
                .queryString("from", this.from)
                .queryString("to", recipient.getEmail())
                .queryString("subject", "Registrazione completata")
                .queryString("text", "Ciao, " + recipient.getUsername() + " grazie per esserti registrato")
                .asJson();
        System.out.println(response.getBody());

    }
}
