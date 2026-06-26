package com.recfinder.recfinder.mapper;

import com.recfinder.recfinder.dto.CreateUserRequest;
import com.recfinder.recfinder.dto.UserResponse;
import com.recfinder.recfinder.entity.User;
import org.springframework.stereotype.Component;

import java.util.HashSet;

@Component
public class UserMapper {

    public User toEntity(CreateUserRequest request) {
        User user = new User();
        user.setName(request.name());
        user.setAge(request.age());
        user.setBio(request.bio());
        user.setSocials(request.socials());
        user.setLocation(request.location());
        user.setSports(request.sports() == null ? new HashSet<>() : new HashSet<>(request.sports()));
        return user;
    }

    public UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getAge(),
                user.getBio(),
                user.getSocials(),
                user.getLocation(),
                new HashSet<>(user.getSports())
        );
    }
}
