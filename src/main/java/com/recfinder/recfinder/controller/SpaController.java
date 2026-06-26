package com.recfinder.recfinder.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Controller
public class SpaController implements ErrorController {

    @RequestMapping(value = "/error", produces = MediaType.TEXT_HTML_VALUE)
    @ResponseBody
    public String handleError(HttpServletRequest request) throws IOException {
        InputStream stream = getClass().getResourceAsStream("/static/index.html");
        if (stream == null) return "Not found";
        return new String(stream.readAllBytes(), StandardCharsets.UTF_8);
    }
}
