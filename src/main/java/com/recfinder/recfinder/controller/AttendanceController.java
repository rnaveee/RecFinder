package com.recfinder.recfinder.controller;

import com.recfinder.recfinder.dto.AttendanceResponse;
import com.recfinder.recfinder.dto.JoinScrimmageRequest;
import com.recfinder.recfinder.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/scrimmages/{scrimmageId}/attendees")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @PostMapping
    public ResponseEntity<AttendanceResponse> join(
            @PathVariable Long scrimmageId,
            @Valid @RequestBody JoinScrimmageRequest request) {
        AttendanceResponse created = attendanceService.join(scrimmageId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public List<AttendanceResponse> list(@PathVariable Long scrimmageId) {
        return attendanceService.listAttendees(scrimmageId);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> leave (
            @PathVariable Long scrimmageId,
            @PathVariable Long userId
    ) {
        attendanceService.leave(scrimmageId, userId);
        return ResponseEntity.noContent().build();
    }
}
