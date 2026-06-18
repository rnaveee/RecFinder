package com.recfinder.recfinder.dto;

import com.recfinder.recfinder.entity.FriendshipStatus;

import java.time.Instant;

public record FriendshipResponse (
        Long id,
        Long requesterId,
        Long addresseeId,
        FriendshipStatus status,
        Instant createdAt
){}
