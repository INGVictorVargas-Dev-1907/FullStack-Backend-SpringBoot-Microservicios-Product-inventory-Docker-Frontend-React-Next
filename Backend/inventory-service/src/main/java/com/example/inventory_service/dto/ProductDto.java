package com.example.inventory_service.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {
    private Long productId; // Debe estar para mapear la respuesta
    private String name;
    private String description;
    private BigDecimal price;
    private String sku;

    
}
