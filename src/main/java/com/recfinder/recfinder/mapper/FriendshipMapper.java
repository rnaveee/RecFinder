package com.recfinder.recfinder.mapper;

import com.recfinder.recfinder.dto.FriendshipResponse;
import com.recfinder.recfinder.entity.Friendship;
import org.springframework.stereotype.Component;

@Component
public class FriendshipMapper {

    public FriendshipResponse toResponse(Friendship friendship) {
        return new FriendshipResponse(
                friendship.getId(),
                friendship.getRequester().getId(),
                friendship.getAddressee().getId(),
                friendship.getStatus(),
                friendship.getCreatedAt(),
                friendship.getRequester().getName(),
                friendship.getAddressee().getName()
        );
    }
}
