package com.recfinder.recfinder.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.Instant;

public record CreateScrimmageRequest(
        @NotBlank @Size(max = 50)
        String sport,

        @NotBlank @Size(max = 100)
        String city,

        @Size(max = 200)
        String location,

        @NotNull @Future
        Instant startTime,

        @NotNull @PositiveOrZero
        BigDecimal attendanceCost,

        @NotNull @Min(2)
        Integer maxPlayers
) {}
