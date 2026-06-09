package com.recfinder.recfinder.exception;

/**
 * Thrown by the service layer when a requested resource doesn't exist
 * (e.g. GET /api/scrimmages/{id} for an id that isn't in the DB).
 * The GlobalExceptionHandler maps this to a 404 response.
 */
public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }
}