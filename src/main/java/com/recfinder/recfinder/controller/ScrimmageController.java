package com.recfinder.recfinder.controller;

import com.recfinder.recfinder.dto.CreateScrimmageRequest;
import com.recfinder.recfinder.dto.ScrimmageResponse;
import com.recfinder.recfinder.service.ScrimmageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scrimmages")
public class ScrimmageController {
    private final ScrimmageService scrimmageService;

    public ScrimmageController(ScrimmageService scrimmageService) {
        this.scrimmageService = scrimmageService;
    }

    @PostMapping
    public ResponseEntity<ScrimmageResponse> createScrimmage(
            @Valid @RequestBody CreateScrimmageRequest createScrimmageRequest
    ) {
        ScrimmageResponse created = scrimmageService.create(createScrimmageRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public List<ScrimmageResponse> findAll(
            @RequestParam(required = false) String sport,
            @RequestParam(required = false) String city
    ){
        return scrimmageService.search(sport, city);
    }

    @GetMapping("/{id}")
    public ScrimmageResponse findById(@PathVariable Long id){
        return scrimmageService.findById(id);
    }
}
