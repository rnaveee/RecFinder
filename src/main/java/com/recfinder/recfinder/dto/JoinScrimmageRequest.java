package com.recfinder.recfinder.dto;

import jakarta.validation.constraints.NotNull;

/**
 * Body for POST /api/scrimmages/{id}/attendees — which user is joining.
 * userId is the auth stand-in (later replaced by the logged-in user).
 */
public record JoinScrimmageRequest(
        @NotNull Long userId
) {}