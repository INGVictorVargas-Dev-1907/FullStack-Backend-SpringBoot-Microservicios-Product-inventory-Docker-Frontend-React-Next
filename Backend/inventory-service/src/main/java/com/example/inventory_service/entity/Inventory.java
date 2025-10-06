package com.example.inventory_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Inventory - Entidad de inventario de productos en la base de datos
 * representa una tabla en la base de datos
 */
@Entity
@Table(name = "inventories")
@Data
@NoArgsConstructor
public class Inventory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique=true)
    private Long productId;

    @Column(nullable=false)
    private Integer quantity;

    public Inventory(Long productId, Integer quantity){
        this.productId = productId;
        this.quantity = quantity;
    }
}
