package com.example.products_service.util;

import com.example.products_service.dto.ProductResponseDto;
import com.example.products_service.entity.Product;

/**
 * ProductMapper - Mapeador de productos
 * permite convertir la entidad (Product) a un DTO de respuesta (ProductResponseDto)
 */
public class ProductMapper {
    
     // Método para convertir la entidad (Product) al DTO de respuesta
    public static ProductResponseDto toResponseDto(Product product) {
        return new ProductResponseDto(
            product.getId(),
            product.getName(),
            product.getDescription(),
            product.getPrice(),
            product.getSku()
        );
    }
}
