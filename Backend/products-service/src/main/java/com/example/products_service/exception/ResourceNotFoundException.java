package com.example.products_service.exception;

/**
 * ResourceNotFoundException - Excepcion personalizada para manejar errores
 * de recursos no encontrados en la base de datos
 */
public class ResourceNotFoundException extends RuntimeException {
    // 1. Mejora de Serialización: Agrega el ID de serialización.
    private static final long serialVersionUID = 1L;

    /**
     * Constructor principal que acepta un mensaje.
     * @param message Mensaje detallado del error (ej: "Product with id 42 not found").
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }

    /**
     * 2. Mejora de Causa: Constructor que acepta un mensaje y la causa raíz.
     * Esto es útil si quieres envolver otra excepción (ej: una excepción de la BD).
     * @param message Mensaje detallado del error.
     * @param cause La causa raíz del error.
     */
    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
