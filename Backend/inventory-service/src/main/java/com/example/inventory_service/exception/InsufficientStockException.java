package com.example.inventory_service.exception;

/**
 * InsufficientStockException
 * Excepción personalizada para indicar que no hay suficiente stock de un producto en la base de datos
 */
public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String message) {
        super(message);
    }
}
