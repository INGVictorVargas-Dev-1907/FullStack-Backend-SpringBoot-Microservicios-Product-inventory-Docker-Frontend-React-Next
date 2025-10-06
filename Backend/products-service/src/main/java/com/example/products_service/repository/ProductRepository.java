package com.example.products_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.products_service.entity.Product;

/**
 * ProductRepository - Repositorio de productos
 * hace la comunicación con la base de datos mediante JPA, y se encarga de realizar las operaciones CRUD
 * para la entidad Product en la base de datos
 */
public interface ProductRepository  extends JpaRepository<Product, Long>{
    Optional<Product> findBySku(String sku); // Busca un producto por su SKU(stock)
}
