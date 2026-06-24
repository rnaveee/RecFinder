package com.recfinder.recfinder.controller;

import com.recfinder.recfinder.dto.CreateScrimmageRequest;
import com.recfinder.recfinder.dto.ScrimmageResponse;
import com.recfinder.recfinder.security.AppUserDetails;
import com.recfinder.recfinder.service.ScrimmageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
            @AuthenticationPrincipal AppUserDetails principal,
            @Valid @RequestBody CreateScrimmageRequest createScrimmageRequest
    ) {
        ScrimmageResponse created = scrimmageService.create(createScrimmageRequest, principal.getUserId());
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

    @PutMapping("/{id}")
    public ResponseEntity<ScrimmageResponse> updateById(
            @AuthenticationPrincipal AppUserDetails principal,
            @Valid @RequestBody CreateScrimmageRequest editScrimmageRequest,
            @PathVariable Long id
    ){
        ScrimmageResponse update = scrimmageService.update(editScrimmageRequest, id, principal.getUserId());
        return ResponseEntity.status(HttpStatus.OK).body(update);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(
            @AuthenticationPrincipal AppUserDetails principal,
            @PathVariable Long id
    ) {
        scrimmageService.delete(id, principal.getUserId());
        return ResponseEntity.noContent().build();
    }
}