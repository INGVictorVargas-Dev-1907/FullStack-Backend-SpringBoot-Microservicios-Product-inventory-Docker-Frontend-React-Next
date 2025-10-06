package com.example.inventory_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.inventory_service.entity.Inventory;

/**
 * Interface para el repositorio de inventario de productos en la base de datos,
 * hereda de JpaRepository para proporcionar metodos de acceso a la base de datos
 */
public interface InventoryRepository extends JpaRepository<Inventory, Long>{
    // Usa Optional<Inventory> para indicar explícitamente que el registro puede no existir
    Optional<Inventory> findByProductId(Long productId);
}
