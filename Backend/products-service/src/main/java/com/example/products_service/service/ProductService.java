package com.example.products_service.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.products_service.dto.ProductDto;
import com.example.products_service.dto.ProductResponseDto;
import com.example.products_service.entity.Product;
import com.example.products_service.exception.ResourceNotFoundException;
import com.example.products_service.repository.ProductRepository;
import com.example.products_service.util.ProductMapper;

import lombok.RequiredArgsConstructor;

/**
 * ProductService - Servicio de productos.
 * Utiliza transacciones de solo lectura por defecto y DTOs para el desacoplamiento.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ProductService {
    // Lombok genera el constructor para este campo final.
    private final ProductRepository repo;

    /**
     * Crea un nuevo producto en la base de datos.
     * @param dto Informacion del producto a crear.
     * @return El DTO del producto creado.
     */
    @Transactional
    public ProductResponseDto create(ProductDto dto){
        Product p = new Product(dto.getName(), dto.getDescription(), dto.getPrice(), dto.getSku());
        Product savedProduct = repo.save(p);
        
        return ProductMapper.toResponseDto(savedProduct);
    }

    /**
     * Obtiene todos los productos de la base de datos con paginacion.
     * @param pageable Informacion de la paginacion de los productos.
     * @return Una página de DTOs de producto.
     */
    public Page<ProductResponseDto> getAllProducts(Pageable pageable) {
        return repo.findAll(pageable).map(ProductMapper::toResponseDto);
    }

    /**
     * Actualiza un producto en la base de datos.
     * @param id Id del producto a actualizar.
     * @param dto Informacion del producto a actualizar (solo campos no nulos).
     * @return El DTO del producto actualizado.
     * @throws ResourceNotFoundException Si el producto no se encuentra.
     */
    @Transactional
    public ProductResponseDto update(Long id, ProductDto dto) {
        Product p = repo.findById(id).orElseThrow(
            () -> new ResourceNotFoundException(String.format("Product with id %d not found", id))
        );
        
        if(dto.getName() != null) p.setName(dto.getName());
        if(dto.getDescription() != null) p.setDescription(dto.getDescription());
        if(dto.getPrice() != null) p.setPrice(dto.getPrice());
        if(dto.getSku() != null) p.setSku(dto.getSku());
        
        // Spring JPA aplica automáticamente los cambios en una transacción activa.
        Product updatedProduct = repo.save(p);
        
        return ProductMapper.toResponseDto(updatedProduct);
    }

    /**
     * Busca un producto en la base de datos por su id.
     * @param id Id del producto a buscar en la base de datos.
     * @return El DTO del producto encontrado.
     * @throws ResourceNotFoundException Si el producto no se encuentra.
     */
    public ProductResponseDto findById(Long id) {
        Product p = repo.findById(id).orElseThrow(
            () -> new ResourceNotFoundException(String.format("Product with id %d not found", id))
        );
        return ProductMapper.toResponseDto(p);
    }

    /**
     * Elimina un producto de la base de datos con su id.
     * @param id Id del producto a eliminar en la base de datos.
     * @throws ResourceNotFoundException Si el producto no se encuentra.
     */
    @Transactional
    public void delete(Long id) {
        // 8. Mejora: Verificar existencia antes de borrar para lanzar ResourceNotFoundException.
        if (!repo.existsById(id)) {
            throw new ResourceNotFoundException(String.format("Product with id %d not found", id));
        }
        // Uso directo de deleteById, más eficiente.
        repo.deleteById(id);
    }
}
