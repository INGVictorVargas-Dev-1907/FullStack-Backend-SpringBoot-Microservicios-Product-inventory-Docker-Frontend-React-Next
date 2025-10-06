package com.example.inventory_service.exception;

/**
 * ProductNotFoundException
 * Excepción personalizada para indicar que un producto no fue encontrado en la base de datos
 */
public class ProductNotFoundException extends RuntimeException {
    public ProductNotFoundException(String message) {
        super(message);
    }
}
