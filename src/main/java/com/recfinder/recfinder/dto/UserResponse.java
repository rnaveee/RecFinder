package com.recfinder.recfinder.dto;

import java.util.Set;

public record UserResponse(
        Long id,
        String name,
        Integer age,
        String bio,
        String socials,
        String location,
        Set<String> sports
) {}