package com.example.inventory_service.mapper;

import org.springframework.stereotype.Component;

import com.example.inventory_service.dto.ProductDto;
import com.example.inventory_service.dto.StockResponseDto;
import com.example.inventory_service.entity.Inventory;

/**
 * Mapper para convertir un objeto Inventory en un StockResponseDto,
 * combinando la información de producto y el estado de existencia.
 */
@Component
public class InventoryMapper {
    
    // Método modificado para aceptar ProductDto
    public StockResponseDto toStockResponseDto(Inventory inventory, ProductDto product, boolean productExists) {

        // Stock por defecto es 0 si no hay registro de inventario
        Integer quantity = inventory != null ? inventory.getQuantity() : 0;
        
        // El productId se toma del ProductDto, si está disponible, o del Inventory
        Long productId = product != null ? product.getProductId() : (inventory != null ? inventory.getProductId() : null);

        // Caso de NO EXISTE o Fallback (Retorna solo datos básicos)
        if (!productExists || product == null) {
            return StockResponseDto.builder()
                    .productExists(false)
                    .productId(productId)
                    .quantity(quantity)
                    .build();
        }

        // Caso de ÉXITO: Producto existe y se combina la información
        return StockResponseDto.builder()
                .productId(productId)
                .quantity(quantity)
                .productExists(true)
                // Mapeo de campos de ProductDto
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .sku(product.getSku())
                .build();
    }
}
