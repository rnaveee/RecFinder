package com.recfinder.recfinder.dto;

import jakarta.validation.constraints.*;

import java.util.Set;

public record CreateUserRequest(
        @NotBlank(message="name is required")
        @Size(max=100)
        String name,

        @Min(13) @Max(120)
        Integer age,

        @Size(max = 500)
        String bio,

        @Size(max = 255)
        String socials,

        @Size(max = 100)
        String location,

        Set<String> sports

) {}
