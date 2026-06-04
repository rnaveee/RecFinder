package com.recfinder.recfinder.dto;

public record ApiError(int status, String message, String path) {}