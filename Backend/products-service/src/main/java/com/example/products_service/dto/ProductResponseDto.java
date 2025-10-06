package com.example.products_service.dto;

import java.math.BigDecimal;

import lombok.Value;

/**
 * ProductResponseDto - DTO de productos
 * representa la informacion de un producto en la base de datos mediante JPA
 */
@Value
public class ProductResponseDto {
    private Long id; // Incluye el ID, que no está en el DTO de creación/actualización
    private String name;
    private String description;
    private BigDecimal price;
    private String sku;

}
