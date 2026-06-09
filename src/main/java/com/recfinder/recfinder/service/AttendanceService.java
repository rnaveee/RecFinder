package com.recfinder.recfinder.service;

import com.recfinder.recfinder.dto.AttendanceResponse;
import com.recfinder.recfinder.dto.JoinScrimmageRequest;
import com.recfinder.recfinder.entity.Attendance;
import com.recfinder.recfinder.entity.Scrimmage;
import com.recfinder.recfinder.entity.User;
import com.recfinder.recfinder.exception.ConflictException;
import com.recfinder.recfinder.exception.NotFoundException;
import com.recfinder.recfinder.mapper.AttendanceMapper;
import com.recfinder.recfinder.repository.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class AttendanceService {
    private final AttendanceRepository attendanceRepository;
    private final ScrimmageRepository scrimmageRepository;
    private final UserRepository userRepository;
    private final AttendanceMapper attendanceMapper;

    public AttendanceService(AttendanceRepository attendanceRepository,
                             ScrimmageRepository scrimmageRepository,
                             UserRepository userRepository,
                             AttendanceMapper attendanceMapper) {
        this.attendanceRepository = attendanceRepository;
        this.scrimmageRepository = scrimmageRepository;
        this.userRepository = userRepository;
        this.attendanceMapper = attendanceMapper;
    }

    @Transactional
    public AttendanceResponse join(Long scrimmageId, JoinScrimmageRequest joinScrimmageRequest) {
        Scrimmage scrimmage = scrimmageRepository.findById(scrimmageId)
                .orElseThrow(() -> new NotFoundException("Scrimmage " + scrimmageId + " not found"));

        User user = userRepository.findById(joinScrimmageRequest.userId())
                .orElseThrow(() -> new NotFoundException("User " + joinScrimmageRequest.userId() + " not found"));

        if(attendanceRepository.existsByScrimmageIdAndUserId(scrimmageId, user.getId())){
            throw new ConflictException("User " + user.getId() + " has already joined scrimmage " + scrimmageId);
        } else if (attendanceRepository.countByScrimmageId(scrimmageId) + 1 > scrimmage.getMaxPlayers()){
            throw new ConflictException("Scrimmage " + scrimmageId + " is full");
        } else {
            Attendance attendance = new Attendance();
            attendance.setUser(user);
            attendance.setScrimmage(scrimmage);
            attendance.setJoinedAt(Instant.now());

            Attendance saved = attendanceRepository.save(attendance);
            return attendanceMapper.toResponse(saved);
        }

    }

    @Transactional
    public void leave(Long scrimmageId, Long userId){
        Attendance attendance = attendanceRepository.findByScrimmageIdAndUserId(scrimmageId, userId)
                .orElseThrow(() -> new NotFoundException("User " + userId + " not found in " + scrimmageId));

        attendanceRepository.delete(attendance);
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponse> listAttendees(Long scrimmageId) {
        return attendanceRepository.findByScrimmageId(scrimmageId).stream()
                .map(attendanceMapper::toResponse)
                .toList();
    }
}
