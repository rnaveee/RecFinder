package com.recfinder.recfinder.controller;


import com.recfinder.recfinder.dto.UpdateUserRequest;
import com.recfinder.recfinder.dto.UserResponse;
import com.recfinder.recfinder.security.AppUserDetails;
import com.recfinder.recfinder.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(
            @AuthenticationPrincipal AppUserDetails principal
    ) {
        return userService.findById(principal.getUserId());
    }

    @PutMapping("/me")
    public UserResponse updateCurrentUser(
            @AuthenticationPrincipal AppUserDetails principal,
            @Valid @RequestBody UpdateUserRequest request
    ){
        return userService.update(request, principal.getUserId());
    }

    @GetMapping
    public List<UserResponse> findAll() {
        return userService.findAll();
    }
}
