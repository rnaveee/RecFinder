package com.recfinder.recfinder.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record ScrimmageResponse(
        Long id,
        String sport,
        String city,
        String location,
        Instant startTime,
        BigDecimal attendanceCost,
        Integer maxPlayers,
        Long createdById,
        String createdByName,
        Integer attendeeCount
) {}