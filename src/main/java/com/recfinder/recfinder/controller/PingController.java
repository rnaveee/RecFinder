package com.recfinder.recfinder.controller;

import com.recfinder.recfinder.dto.PingResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PingController {

    @GetMapping("/api/ping")
    public PingResponse ping() {
        return new PingResponse("ok", "RecFinder");
    }
}