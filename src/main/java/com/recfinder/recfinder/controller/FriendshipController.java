package com.recfinder.recfinder.controller;

import com.recfinder.recfinder.dto.FriendshipResponse;
import com.recfinder.recfinder.security.AppUserDetails;
import com.recfinder.recfinder.service.FriendshipService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friendships")
public class FriendshipController {

    private final FriendshipService friendshipService;

    public FriendshipController(FriendshipService friendshipService){
        this.friendshipService = friendshipService;
    }

    @PostMapping("/{addresseeId}")
    public ResponseEntity<FriendshipResponse> sendFriendRequest(
            @AuthenticationPrincipal AppUserDetails principal,
            @PathVariable Long addresseeId
    ){
        FriendshipResponse created = friendshipService.sendRequest(principal.getUserId(), addresseeId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{friendshipId}/accept")
    public ResponseEntity<FriendshipResponse> acceptFriendRequest(
            @AuthenticationPrincipal AppUserDetails principal,
            @PathVariable Long friendshipId
    ){
        FriendshipResponse accepted = friendshipService.acceptRequest(friendshipId, principal.getUserId());
        return ResponseEntity.ok(accepted);
    }

    @PutMapping("/{friendshipId}/decline")
    public ResponseEntity<FriendshipResponse> declineFriendRequest(
            @AuthenticationPrincipal AppUserDetails principal,
            @PathVariable Long friendshipId
    ){
        FriendshipResponse declined = friendshipService.declineRequest(friendshipId, principal.getUserId());
        return ResponseEntity.ok(declined);
    }

    @GetMapping
    public List<FriendshipResponse> getFriends(@AuthenticationPrincipal AppUserDetails principal){
        return friendshipService.getFriends(principal.getUserId());
    }

    @GetMapping("/requests")
    public List<FriendshipResponse> getPendingRequests(@AuthenticationPrincipal AppUserDetails principal){
        return friendshipService.getPendingRequests(principal.getUserId());
    }


}
