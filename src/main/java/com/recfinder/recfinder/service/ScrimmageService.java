package com.recfinder.recfinder.service;

import com.recfinder.recfinder.dto.CreateScrimmageRequest;
import com.recfinder.recfinder.dto.ScrimmageResponse;
import com.recfinder.recfinder.entity.Scrimmage;
import com.recfinder.recfinder.entity.User;
import com.recfinder.recfinder.exception.NotFoundException;
import com.recfinder.recfinder.mapper.ScrimmageMapper;
import com.recfinder.recfinder.repository.ScrimmageRepository;
import com.recfinder.recfinder.repository.UserRepository;
import com.recfinder.recfinder.security.AppUserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ScrimmageService {

    private final ScrimmageRepository scrimmageRepository;
    private final UserRepository userRepository;
    private final ScrimmageMapper scrimmageMapper;

    public ScrimmageService(ScrimmageRepository scrimmageRepository,
                            UserRepository userRepository,
                            ScrimmageMapper scrimmageMapper) {
        this.scrimmageRepository = scrimmageRepository;
        this.userRepository = userRepository;
        this.scrimmageMapper = scrimmageMapper;
    }

    @Transactional
    public ScrimmageResponse create(CreateScrimmageRequest request) {
        AppUserDetails principal = (AppUserDetails) SecurityContextHolder
                .getContext().getAuthentication().getPrincipal();
        User creator = userRepository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new NotFoundException("Authenticated user not found"));

        Scrimmage scrimmage = scrimmageMapper.toEntity(request, creator);
        Scrimmage saved = scrimmageRepository.save(scrimmage);
        return scrimmageMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ScrimmageResponse> findAll() {
        return scrimmageRepository.findAll().stream()
                .map(scrimmageMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ScrimmageResponse findById(Long id) {
        Scrimmage scrimmage = scrimmageRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Scrimmage " + id + " not found"));
        return scrimmageMapper.toResponse(scrimmage);
    }
}