package com.recfinder.recfinder.dto;

import java.time.Instant;

public record AttendanceResponse(
        Long id,
        Long scrimmageId,
        Long userId,
        String userName,
        Instant joinedAt
) {}
