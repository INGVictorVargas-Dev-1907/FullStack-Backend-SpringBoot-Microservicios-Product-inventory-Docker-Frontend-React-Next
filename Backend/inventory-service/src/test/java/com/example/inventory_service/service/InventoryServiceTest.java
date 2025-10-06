package com.example.inventory_service.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.example.inventory_service.client.ProductsClient;
import com.example.inventory_service.dto.ProductDto;
import com.example.inventory_service.dto.StockResponseDto;
import com.example.inventory_service.entity.Inventory;
import com.example.inventory_service.exception.InsufficientStockException;
import com.example.inventory_service.exception.ProductNotFoundException;
import com.example.inventory_service.mapper.InventoryMapper;
import com.example.inventory_service.repository.InventoryRepository;

public class InventoryServiceTest {
    // Se mockean todas las dependencias del constructor de InventoryService
    @Mock
    private InventoryRepository inventoryRepository;

    @Mock
    private ProductsClient productsClient;

    @Mock
    private InventoryMapper inventoryMapper;

    @InjectMocks
    private InventoryService inventoryService;

    private Inventory inventory;
    private final Long PRODUCT_ID = 1L;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        inventory = new Inventory(PRODUCT_ID, 10); // Stock inicial: 10
    }

    /**
     * Helper para simular que ProductsClient devuelve un producto válido de forma asíncrona.
     */
    private ProductDto mockProductExists() {
        ProductDto mockProduct = new ProductDto(PRODUCT_ID, "Test Product", "Desc", BigDecimal.TEN, "SKU123");
        // Devolvemos un CompletableFuture que ya está completado con el DTO
        when(productsClient.getProductById(PRODUCT_ID))
            .thenReturn(CompletableFuture.completedFuture(mockProduct));
        return mockProduct;
    }

    /**
     * Helper para crear un StockResponseDto mock con la cantidad deseada.
     */
    private StockResponseDto createMockStockResponse(Integer quantity) {
        return StockResponseDto.builder()
                .productId(PRODUCT_ID)
                .quantity(quantity)
                .productExists(true)
                .name("Test Product")
                .build();
    }

    // --------------------------------------------------------------------------
    // 1. Prueba de Éxito (Disminución - Compra)
    // --------------------------------------------------------------------------
    @Test
    void shouldDecreaseInventorySuccessfully() {
        ProductDto mockProduct = mockProductExists(); // 1. Simular que el producto existe

        // 2. Simular inventario actual (10)
        when(inventoryRepository.findByProductId(PRODUCT_ID)).thenReturn(Optional.of(inventory));
        
        // 3. Simular que el guardado devuelve el inventario con el nuevo valor
        // NOTA: El objeto 'inventory' original se modifica en el servicio (cantidad a 5) antes de ser guardado.
        when(inventoryRepository.save(any(Inventory.class))).thenReturn(inventory); 

        // 4. Mockear el mapeador para devolver el DTO final con la cantidad actualizada (5)
        StockResponseDto expectedDto = createMockStockResponse(5); 
        // 💡 Uso de 'any()' para Inventory, ProductDto y 'eq(true)' para el booleano
        when(inventoryMapper.toStockResponseDto(any(Inventory.class), any(ProductDto.class), eq(true)))
            .thenReturn(expectedDto);

        // Llama a updateInventory y captura el DTO de respuesta
        StockResponseDto updatedDto = inventoryService.updateInventory(PRODUCT_ID, -5); // 💡 Tipo corregido

        assertNotNull(updatedDto);
        assertEquals(5, updatedDto.getQuantity()); // 💡 Assertions sobre el DTO
        
        // Verifica que se llamó al repositorio para guardar el cambio
        verify(inventoryRepository, times(1)).save(inventory);
    }

    // --------------------------------------------------------------------------
    // 2. Prueba de Fallo (Inventario Insuficiente)
    // --------------------------------------------------------------------------
    @Test
    void shouldThrowWhenInventoryNotEnough() {
        mockProductExists(); // 1. Simular que el producto existe
        when(inventoryRepository.findByProductId(PRODUCT_ID)).thenReturn(Optional.of(inventory)); // Stock 10

        assertThrows(InsufficientStockException.class,
                // Llama a updateInventory para disminuir 20 (10 - 20 = -10)
                () -> inventoryService.updateInventory(PRODUCT_ID, -20));
        
        verify(inventoryRepository, never()).save(any());
    }
    
    // --------------------------------------------------------------------------
    // 3. Prueba de Fallo (Producto No Existe)
    // --------------------------------------------------------------------------
    @Test
    void shouldThrowWhenProductDoesNotExist() {
        // 1. Simular que ProductsClient retorna NULL (simula 404 o fallback)
        when(productsClient.getProductById(PRODUCT_ID))
            .thenReturn(CompletableFuture.completedFuture(null)); 

        assertThrows(ProductNotFoundException.class,
                // Llama al método para que intente validar el producto
                () -> inventoryService.updateInventory(PRODUCT_ID, -5)); 
        
        verify(inventoryRepository, never()).findByProductId(any());
    }

    // --------------------------------------------------------------------------
    // 4. Prueba de Éxito (Aumento - Reposición)
    // --------------------------------------------------------------------------
    @Test
    void shouldIncreaseInventorySuccessfully() {
        ProductDto mockProduct = mockProductExists(); // Simular que el producto existe

        when(inventoryRepository.findByProductId(PRODUCT_ID)).thenReturn(Optional.of(inventory));
        // NOTA: El objeto 'inventory' original se modifica en el servicio (cantidad a 30)
        when(inventoryRepository.save(any(Inventory.class))).thenReturn(inventory);

        // Mockear el mapeador para devolver el DTO final con la cantidad actualizada (30)
        StockResponseDto expectedDto = createMockStockResponse(30); 
        when(inventoryMapper.toStockResponseDto(any(Inventory.class), any(ProductDto.class), eq(true)))
            .thenReturn(expectedDto);

        // Llama a updateInventory y captura el DTO de respuesta
        StockResponseDto updatedDto = inventoryService.updateInventory(PRODUCT_ID, 20);

        assertNotNull(updatedDto);
        assertEquals(30, updatedDto.getQuantity()); // 10 + 20 = 30
        verify(inventoryRepository, times(1)).save(inventory);
    }
}
