package com.recfinder.recfinder.mapper;

import com.recfinder.recfinder.dto.CreateUserRequest;
import com.recfinder.recfinder.dto.UserResponse;
import com.recfinder.recfinder.entity.User;
import org.springframework.stereotype.Component;

import java.util.HashSet;

/**
 * Converts between the User entity and its DTOs. Kept as a plain @Component
 * (no logic, no state) so the service can inject and reuse it. Manual mapping
 * for now — we'll only reach for MapStruct if this ever gets tedious.
 */
@Component
public class UserMapper {

    /** Build a new entity from an incoming create request. No id — the DB assigns it on save. */
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

    /** Build the outbound response from a saved entity (now has an id). */
    public UserResponse toResponse(User user) {
        // Copy sports into a plain HashSet here, while we're still inside the
        // service's @Transactional session. This forces the lazy @ElementCollection
        // to load now (instead of failing later when Jackson serializes outside the
        // session — a LazyInitializationException), and keeps Hibernate's proxy
        // type out of the DTO.
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