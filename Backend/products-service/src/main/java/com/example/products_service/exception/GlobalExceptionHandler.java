package com.example.products_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.products_service.util.JsonApiUtil;

/**
 * GlobalExceptionHandler - Controlador global de excepciones
 * maneja las excepciones que puedan ocurrir en la API
 * y devuelve un objeto JsonApi con el error correspondiente
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * handleNotFound - Maneja la excepcion ResourceNotFoundException
     * @param ex Excepcion a manejar de tipo ResourceNotFoundException
     * @return Un objeto JsonApi con el error correspondiente
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(JsonApiUtil.error("404","Not Found", ex.getMessage()));
    }

    /**
     * handleAll - Maneja todas las demas excepciones no manejadas
     * @param ex Excepcion a manejar de cualquier tipo
     * @return Un objeto JsonApi con el error correspondiente
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAll(Exception ex){
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(JsonApiUtil.error("500","Internal Server Error", ex.getMessage()));
    }
}
