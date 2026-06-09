package com.recfinder.recfinder.exception;

/**
 * Thrown when a request is well-formed but conflicts with the current state of
 * the data (e.g. joining a scrimmage you're already in, or one that's full).
 * The GlobalExceptionHandler maps this to a 409 Conflict response.
 */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}