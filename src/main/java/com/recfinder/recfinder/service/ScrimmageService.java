package com.recfinder.recfinder.service;

import com.recfinder.recfinder.dto.CreateScrimmageRequest;
import com.recfinder.recfinder.dto.ScrimmageResponse;
import com.recfinder.recfinder.entity.Scrimmage;
import com.recfinder.recfinder.entity.User;
import com.recfinder.recfinder.exception.ConflictException;
import com.recfinder.recfinder.exception.ForbiddenException;
import com.recfinder.recfinder.exception.NotFoundException;
import com.recfinder.recfinder.mapper.ScrimmageMapper;
import com.recfinder.recfinder.repository.AttendanceRepository;
import com.recfinder.recfinder.repository.ScrimmageRepository;
import com.recfinder.recfinder.repository.UserRepository;
import com.recfinder.recfinder.security.AppUserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class ScrimmageService {

    private final ScrimmageRepository scrimmageRepository;
    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final ScrimmageMapper scrimmageMapper;

    public ScrimmageService(ScrimmageRepository scrimmageRepository,
                            UserRepository userRepository,
                            ScrimmageMapper scrimmageMapper,
                            AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
        this.scrimmageRepository = scrimmageRepository;
        this.userRepository = userRepository;
        this.scrimmageMapper = scrimmageMapper;
    }

    @Transactional
    public ScrimmageResponse create(CreateScrimmageRequest request, Long userId) {
        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Authenticated user not found"));

        Scrimmage scrimmage = scrimmageMapper.toEntity(request, creator);
        Scrimmage saved = scrimmageRepository.save(scrimmage);
        return scrimmageMapper.toResponse(saved, 0);
    }

    @Transactional
    public ScrimmageResponse update(CreateScrimmageRequest request, Long scrimmageId, Long userId){
        Scrimmage scrimmage = scrimmageRepository.findById(scrimmageId)
                .orElseThrow(() -> new NotFoundException("Scrimmage not found"));

        if(!userId.equals(scrimmage.getCreatedBy().getId())){
            throw new ForbiddenException("User is not permitted to edit this scrimmage.");
        }

        scrimmage.setCity(request.city());
        scrimmage.setLocation(request.location());
        scrimmage.setSport(request.sport());
        scrimmage.setStartTime(request.startTime());
        scrimmage.setAttendanceCost(request.attendanceCost());
        scrimmage.setMaxPlayers(request.maxPlayers());
        scrimmage.setPrivate(request.isPrivate());

        return scrimmageMapper.toResponse(scrimmage, attendanceRepository.countByScrimmageId(scrimmageId));
    }

    @Transactional
    public void delete(Long scrimmageId, Long userId){
        Scrimmage scrimmage = scrimmageRepository.findById(scrimmageId)
                .orElseThrow(() -> new NotFoundException("Scrimmage not found"));

        if(!userId.equals(scrimmage.getCreatedBy().getId())){
            throw new ForbiddenException("User is not permitted to delete this scrimmage.");
        }

        scrimmageRepository.delete(scrimmage);
    }

    @Transactional(readOnly = true)
    public List<ScrimmageResponse> search(String sport, String city) {
        return scrimmageRepository.search(sport, city, Instant.now()).stream()
                .map(s -> scrimmageMapper.toResponse(s, attendanceRepository.countByScrimmageId(s.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ScrimmageResponse> findJoined(Long userId) {
        return attendanceRepository.findByUserIdOrderByScrimmageStartTimeDesc(userId).stream()
                .map(a -> scrimmageMapper.toResponse(a.getScrimmage(), attendanceRepository.countByScrimmageId(a.getScrimmage().getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ScrimmageResponse> findByCreator(Long userId) {
        return scrimmageRepository.findByCreatedByIdOrderByStartTimeDesc(userId).stream()
                .map(s -> scrimmageMapper.toResponse(s, attendanceRepository.countByScrimmageId(s.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public ScrimmageResponse findById(Long id) {
        Scrimmage scrimmage = scrimmageRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Scrimmage " + id + " not found"));
        return scrimmageMapper.toResponse(scrimmage, attendanceRepository.countByScrimmageId(id));
    }
}