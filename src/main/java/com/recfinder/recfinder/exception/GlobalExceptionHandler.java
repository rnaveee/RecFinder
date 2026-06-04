package com.recfinder.recfinder.exception;

import com.recfinder.recfinder.dto.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleAll(Exception ex, HttpServletRequest request) {
        ApiError body = new ApiError(500, ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(500).body(body);
    }
}