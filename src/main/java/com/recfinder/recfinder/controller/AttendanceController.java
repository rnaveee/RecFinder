package com.recfinder.recfinder.controller;

import com.recfinder.recfinder.dto.AttendanceResponse;
import com.recfinder.recfinder.security.AppUserDetails;
import com.recfinder.recfinder.service.AttendanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
            @AuthenticationPrincipal AppUserDetails principal) {

        AttendanceResponse created = attendanceService.join(scrimmageId, principal.getUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public List<AttendanceResponse> list(@PathVariable Long scrimmageId) {
        return attendanceService.listAttendees(scrimmageId);
    }

    @DeleteMapping
    public ResponseEntity<Void> leave (
            @PathVariable Long scrimmageId,
            @AuthenticationPrincipal AppUserDetails principal
    ) {
        attendanceService.leave(scrimmageId, principal.getUserId());
        return ResponseEntity.noContent().build();
    }
}
