package com.recfinder.recfinder.controller;

import com.recfinder.recfinder.dto.ScrimmageResponse;
import com.recfinder.recfinder.service.ScrimmageService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Controller
public class SpaController {

    private static final String BASE_URL = "https://recfinder.ca";
    private static final String OG_IMAGE = BASE_URL + "/og-image.png";

    private final ScrimmageService scrimmageService;

    public SpaController(ScrimmageService scrimmageService) {
        this.scrimmageService = scrimmageService;
    }

    @RequestMapping(value = {
        "/",
        "/login",
        "/register",
        "/scrimmages",
        "/scrimmages/new",
        "/scrimmages/{id:[0-9]+}/edit",
        "/profile",
        "/friends",
        "/about",
        "/support",
        "/terms",
        "/privacy",
    })
    @ResponseBody
    public ResponseEntity<byte[]> forward() throws IOException {
        return serveIndex();
    }

    @RequestMapping("/scrimmages/{id:[0-9]+}")
    @ResponseBody
    public ResponseEntity<byte[]> forwardScrimmage(
            @PathVariable String id,
            @RequestHeader(value = "User-Agent", defaultValue = "") String userAgent
    ) throws IOException {
        if (isCrawler(userAgent)) {
            String html = buildScrimmageMetaHtml(id);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.TEXT_HTML);
            return ResponseEntity.ok().headers(headers).body(html.getBytes(StandardCharsets.UTF_8));
        }

        return serveIndex();
    }

    private ResponseEntity<byte[]> serveIndex() throws IOException {
        InputStream stream = getClass().getResourceAsStream("/static/index.html");
        if (stream == null) return ResponseEntity.notFound().build();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_HTML);
        return ResponseEntity.ok().headers(headers).body(stream.readAllBytes());
    }

    private boolean isCrawler(String ua) {
        String lower = ua.toLowerCase();
        return lower.contains("facebookexternalhit")
                || lower.contains("instagram")
                || lower.contains("twitterbot")
                || lower.contains("whatsapp")
                || lower.contains("telegrambot")
                || lower.contains("slackbot")
                || lower.contains("linkedinbot")
                || lower.contains("discordbot")
                || lower.contains("imessage")
                || lower.contains("applebot");
    }

    private String buildScrimmageMetaHtml(String id) {
        String pageUrl = BASE_URL + "/scrimmages/" + id;
        String title;
        String description;
        try {
            ScrimmageResponse s = scrimmageService.findById(Long.parseLong(id));
            title = s.sport() + " at " + s.location() + ", " + s.city() + " — RecFinder";
            description = s.createdByName() + " is hosting a " + s.sport().toLowerCase()
                    + " game at " + s.location() + ". "
                    + s.attendeeCount() + "/" + s.maxPlayers() + " players joined. Come play!";
        } catch (Exception e) {
            title = "You're invited to a game — RecFinder";
            description = "Someone wants you to join their pickup game. Sign up on RecFinder!";
        }
        return """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                  <meta charset="UTF-8" />
                  <title>%s</title>
                  <meta name="description" content="%s" />
                  <meta property="og:type" content="website" />
                  <meta property="og:site_name" content="RecFinder" />
                  <meta property="og:title" content="%s" />
                  <meta property="og:description" content="%s" />
                  <meta property="og:image" content="%s" />
                  <meta property="og:image:secure_url" content="%s" />
                  <meta property="og:image:type" content="image/png" />
                  <meta property="og:image:width" content="1200" />
                  <meta property="og:image:height" content="630" />
                  <meta property="og:url" content="%s" />
                  <meta name="twitter:card" content="summary_large_image" />
                  <meta name="twitter:title" content="%s" />
                  <meta name="twitter:description" content="%s" />
                  <meta name="twitter:image" content="%s" />
                  <meta http-equiv="refresh" content="0; url=%s" />
                </head>
                <body></body>
                </html>
                """.formatted(title, description, title, description, OG_IMAGE, OG_IMAGE, pageUrl, title, description, OG_IMAGE, pageUrl);
    }
}
