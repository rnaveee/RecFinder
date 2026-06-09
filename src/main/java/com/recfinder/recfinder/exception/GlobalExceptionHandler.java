package com.recfinder.recfinder.exception;

import com.recfinder.recfinder.dto.ApiError;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // A resource the caller asked for doesn't exist → 404, not 500.
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiError> handleNotFound(NotFoundException ex, HttpServletRequest request) {
        ApiError body = new ApiError(404, ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    // Request is valid but conflicts with current state (already joined, game full) → 409.
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiError> handleConflict(ConflictException ex, HttpServletRequest request) {
        ApiError body = new ApiError(409, ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    // Bean Validation (@Valid) failures are the CLIENT's fault → 400, not 500.
    // This handler is more specific than handleAll below, so Spring prefers it
    // for validation errors. We flatten the field errors into a readable message
    // ("name: name is required, age: must be greater than or equal to 13")
    // instead of leaking Spring's internal error codes.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex,
                                                     HttpServletRequest request) {
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.joining(", "));
        ApiError body = new ApiError(400, message, request.getRequestURI());
        return ResponseEntity.badRequest().body(body);
    }

    // Fallback for anything we didn't handle explicitly → 500.
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleAll(Exception ex, HttpServletRequest request) {
        ApiError body = new ApiError(500, ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(500).body(body);
    }
}