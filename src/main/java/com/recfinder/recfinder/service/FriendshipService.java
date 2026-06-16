package com.recfinder.recfinder.service;

import com.recfinder.recfinder.repository.FriendshipRepository;
import com.recfinder.recfinder.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;


@Service
public class FriendshipService {
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    public FriendshipService(FriendshipRepository friendshipRepository, UserRepository userRepository){
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
    }

}
