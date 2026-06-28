package com.recfinder.recfinder.dto;

import java.util.Set;

public record UserPublicResponse(
        Long id,
        String name,
        Integer age,
        String bio,
        String socials,
        String location,
        Set<String> sports
) {}
