package com.recfinder.recfinder.dto;

public record ChatMessageResponse (
        Long id,
        Long scrimmageId,
        Long userId,
        String username,
        String content,
        String timestamp
){
}
