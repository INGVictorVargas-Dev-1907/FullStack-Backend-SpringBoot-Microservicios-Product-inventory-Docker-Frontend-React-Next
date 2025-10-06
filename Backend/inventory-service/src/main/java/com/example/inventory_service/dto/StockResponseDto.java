package com.example.inventory_service.dto;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StockResponseDto {
    private Long productId;
    private Integer quantity;
    private boolean productExists;

     // Datos del Producto (Añadidos de ProductDto)
    private String name;
    private String description;
    private BigDecimal price; // Usar el tipo de dato correcto
    private String sku;
}
