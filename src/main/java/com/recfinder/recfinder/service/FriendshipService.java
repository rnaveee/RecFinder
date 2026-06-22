package com.recfinder.recfinder.service;

import com.recfinder.recfinder.dto.FriendshipResponse;
import com.recfinder.recfinder.entity.Friendship;
import com.recfinder.recfinder.entity.FriendshipStatus;
import com.recfinder.recfinder.entity.User;
import com.recfinder.recfinder.exception.ConflictException;
import com.recfinder.recfinder.exception.NotFoundException;
import com.recfinder.recfinder.mapper.FriendshipMapper;
import com.recfinder.recfinder.repository.FriendshipRepository;
import com.recfinder.recfinder.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;


@Service
public class FriendshipService {
    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    private final FriendshipMapper friendshipMapper;

    public FriendshipService(FriendshipRepository friendshipRepository, UserRepository userRepository, FriendshipMapper friendshipMapper){
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
        this.friendshipMapper = friendshipMapper;
    }

    @Transactional
    public FriendshipResponse sendRequest(Long requesterId, Long addresseeId){
        if(requesterId.equals(addresseeId)){
            throw new ConflictException(requesterId + " cannot request themself");
        } else if (friendshipRepository.findByRequesterIdAndAddresseeId(requesterId, addresseeId).isPresent()){
            throw new ConflictException(requesterId + " has already sent a request");
        }

        User requester = userRepository.findById(requesterId)
                .orElseThrow(() -> new NotFoundException("User requester " + requesterId + " not found"));
        User addressee = userRepository.findById(addresseeId)
                .orElseThrow(() -> new NotFoundException("User addressee " + addresseeId + " not found"));

        Friendship friendship = new Friendship();
        friendship.setRequester(requester);
        friendship.setAddressee(addressee);
        friendship.setStatus(FriendshipStatus.PENDING);
        friendship.setCreatedAt(Instant.now());

        Friendship saved = friendshipRepository.save(friendship);
        return friendshipMapper.toResponse(saved);
    }

    @Transactional
    public FriendshipResponse acceptRequest(Long friendshipId, Long addresseeId){
        Friendship request = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new NotFoundException("Friendship " + friendshipId + " not found"));

        if (!request.getAddressee().getId().equals(addresseeId)){
            throw new ConflictException("addressee is mismatched");
        } else if (!request.getStatus().equals(FriendshipStatus.PENDING)){
            throw new ConflictException(request.getId() + " is already accepted or declined");
        }

        request.setStatus(FriendshipStatus.ACCEPTED);
        return friendshipMapper.toResponse(request);
    }

    @Transactional
    public FriendshipResponse declineRequest(Long friendshipId, Long addresseeId){
        Friendship request = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new NotFoundException("Friendship " + friendshipId + " not found"));

        if (!request.getAddressee().getId().equals(addresseeId)){
            throw new ConflictException("addressee is mismatched");
        } else if (!request.getStatus().equals(FriendshipStatus.PENDING)){
            throw new ConflictException(request.getId() + " is already accepted or declined");
        }

        request.setStatus(FriendshipStatus.DECLINED);
        return friendshipMapper.toResponse(request);
    }

    @Transactional(readOnly = true)
    public List<FriendshipResponse> getFriends(Long userId){
        return friendshipRepository.findAcceptedRequests(userId, FriendshipStatus.ACCEPTED).stream()
                .map(friendshipMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FriendshipResponse> getPendingRequests(Long userId){
        return friendshipRepository.findByAddresseeIdAndStatus(userId, FriendshipStatus.PENDING).stream()
                .map(friendshipMapper::toResponse)
                .toList();
    }
}
