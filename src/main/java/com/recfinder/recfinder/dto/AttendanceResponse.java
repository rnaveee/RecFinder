package com.recfinder.recfinder.dto;

import java.time.Instant;

/**
 * One attendee of a scrimmage. Flattens the Attendance entity's user + scrimmage
 * relationships down to ids/names so no entity crosses the boundary.
 */
public record AttendanceResponse(
        Long id,
        Long scrimmageId,
        Long userId,
        String userName,
        Instant joinedAt
) {}