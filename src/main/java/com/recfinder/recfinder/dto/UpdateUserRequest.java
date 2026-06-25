package com.recfinder.recfinder.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Set;

public record UpdateUserRequest (
        @NotBlank
        String name,
        Integer age,
        String bio,
        String socials,
        String location,
        Set<String> sports
){

}
