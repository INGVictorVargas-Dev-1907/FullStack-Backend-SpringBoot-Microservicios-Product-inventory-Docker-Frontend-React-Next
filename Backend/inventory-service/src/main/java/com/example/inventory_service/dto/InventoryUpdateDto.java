package com.example.inventory_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InventoryUpdateDto {
    @NotNull(message = "La cantidad a modificar no puede ser nula")
     private Integer changeQuantity; // Puede ser positivo (restock) o negativo (compra)
}
