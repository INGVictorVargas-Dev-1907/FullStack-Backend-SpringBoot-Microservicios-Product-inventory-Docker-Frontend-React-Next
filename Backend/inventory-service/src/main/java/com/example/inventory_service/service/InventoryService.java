package com.example.inventory_service.service;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.inventory_service.client.ProductsClient;
import com.example.inventory_service.dto.ProductDto;
import com.example.inventory_service.dto.StockResponseDto;
import com.example.inventory_service.entity.Inventory;
import com.example.inventory_service.exception.InsufficientStockException;
import com.example.inventory_service.exception.ProductNotFoundException;
import com.example.inventory_service.mapper.InventoryMapper;
import com.example.inventory_service.repository.InventoryRepository;

@Service
public class InventoryService {
    
    private static final Logger log  = LoggerFactory.getLogger(InventoryService.class);

    private final InventoryRepository inventoryRepository;
    private final ProductsClient productsClient;
    private final InventoryMapper inventoryMapper;

    public InventoryService(InventoryRepository inventoryRepository, ProductsClient productsClient, InventoryMapper inventoryMapper) {
        this.inventoryRepository = inventoryRepository;
        this.productsClient = productsClient;
        this.inventoryMapper = inventoryMapper;
    }

    private ProductDto validateProductExistence(Long productId) {
        try {
            // Bloquea el hilo esperando el resultado del CompletableFuture.join()
            return productsClient.getProductById(productId).join(); 
        } catch (Exception e) {
            log.error("Error al obtener producto {} (posiblemente fallback o error de conexión): {}", productId, e.getMessage());
            return null; // El 404/Fallback del cliente resultará en null
        }
    }

    /**
     * GET: Consultar la cantidad de un producto.
     */
    @Transactional(readOnly = true)
    public StockResponseDto checkStock(Long productId) {

        ProductDto productDto = validateProductExistence(productId);

        if (productDto == null) {
            throw new ProductNotFoundException("Producto con ID " + productId + " no encontrado en Products Service.");
        }

        Optional<Inventory> inventoryOpt = inventoryRepository.findByProductId(productId);
        
        // Pasamos Inventory, ProductDto y 'true' al mapper.
        return inventoryMapper.toStockResponseDto(
            inventoryOpt.orElse(null), 
            productDto, 
            true
        );
    }

    /**
     * POST: Actualizar la cantidad disponible tras una compra.
     * 💡 El retorno es StockResponseDto.
     */
    @Transactional
    public StockResponseDto updateInventory(Long productId, Integer changeQuantity) {
        
        // 1. Validar existencia del producto y OBTENER el ProductDto
        ProductDto productDto = validateProductExistence(productId);
        if (productDto == null) {
            throw new ProductNotFoundException("Producto con ID " + productId + " no encontrado en Products Service. No se puede actualizar el inventario.");
        }
        
        // 2. Lógica de negocio (Obtener/Inicializar/Validar Stock)
        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseGet(() -> {
                    if (changeQuantity < 0) {
                        throw new InsufficientStockException("El producto " + productId + " no tiene inventario inicial para realizar la compra.");
                    }
                    return new Inventory(productId, 0);
                });
        
        int newQuantity = inventory.getQuantity() + changeQuantity;
        
        if (newQuantity < 0) {
            throw new InsufficientStockException("Stock insuficiente para el producto " + productId + ". Stock actual: " + inventory.getQuantity());
        }

        // 3. Actualizar y guardar
        int oldQuantity = inventory.getQuantity();
        inventory.setQuantity(newQuantity);
        Inventory updatedInventory = inventoryRepository.save(inventory);

        // Emitir un evento básico (log en consola).
        log.info("EVENTO: El inventario del producto {} ha cambiado de {} a {}. Cambio: {}",
                            productId, oldQuantity, newQuantity, changeQuantity);
        
        // 4. Mapear y devolver el DTO final
        return inventoryMapper.toStockResponseDto(
            updatedInventory,
            productDto,
            true
        );
    }
}