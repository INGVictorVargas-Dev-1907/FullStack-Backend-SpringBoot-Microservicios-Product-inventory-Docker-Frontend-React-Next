package com.example.inventory_service.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.inventory_service.dto.InventoryUpdateDto;
import com.example.inventory_service.dto.StockResponseDto;
import com.example.inventory_service.exception.InsufficientStockException;
import com.example.inventory_service.exception.ProductNotFoundException;
import com.example.inventory_service.mapper.InventoryMapper;
import com.example.inventory_service.service.InventoryService;
import com.example.inventory_service.util.JsonApiUtil;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/inventory")
@Tag(name = "Inventario", description = "Gestión del stock de productos")
public class InventoryController {
    
    private final InventoryService inventoryService;
    private final InventoryMapper inventoryMapper; 

    public InventoryController(InventoryService inventoryService, InventoryMapper inventoryMapper) {
        this.inventoryService = inventoryService;
        this.inventoryMapper = inventoryMapper;
    }

    /**
     * GET /api/inventory/{productId}
     * Consultar la cantidad de un producto. Respuesta JSON:API.
     */
    @Operation(
        summary = "Consultar Stock por ID de Producto",
        description = "Verifica la existencia del producto en el servicio de Productos y retorna el stock disponible localmente."
    )
    @ApiResponse(responseCode = "200", description = "Stock encontrado y producto existe.")
    @GetMapping("/{productId}")
    public ResponseEntity<Map<String, Object>> getStockByProductId(
        @Parameter(description = "ID único del producto a consultar") 
        @PathVariable Long productId) {
        
        StockResponseDto stock = inventoryService.checkStock(productId);
        
        return ResponseEntity.ok(JsonApiUtil.single(productId, "inventory", stock));
    }
    
    
    /**
     * POST /api/inventory/{productId}/update
     * Actualizar la cantidad disponible. Respuesta JSON:API.
     */
    @Operation(
        summary = "Actualizar Stock (Compra/Reposición)",
        description = "Modifica la cantidad de stock para un producto. Usar valores negativos para compras y positivos para reposición."
    )
    @ApiResponse(responseCode = "200", description = "Stock actualizado correctamente")
    @PostMapping("/{productId}/update")
    public ResponseEntity<Map<String, Object>> updateStock(
            @Parameter(description = "ID único del producto a actualizar")
            @PathVariable Long productId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Cantidad a modificar (negativo para compra)")
            @Valid @RequestBody InventoryUpdateDto updateDto) {
        
        StockResponseDto stockResponse = inventoryService.updateInventory(productId, updateDto.getChangeQuantity());
        
        return ResponseEntity.status(HttpStatus.OK).body(JsonApiUtil.single(productId, "inventory", stockResponse));
    }
    
    /**
     * Manejador de excepción para Producto No Encontrado (404). Devuelve JSON:API de error.
     */
    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(ProductNotFoundException.class)
    public Map<String, Object> handleNotFound(ProductNotFoundException ex) {
        return JsonApiUtil.error(
            String.valueOf(HttpStatus.NOT_FOUND.value()), // status
            "Recurso no encontrado", // title
            ex.getMessage() // detail
        );
    }
    
    /**
     * Manejador de excepción para Stock Insuficiente (400 Bad Request). Devuelve JSON:API de error.
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(InsufficientStockException.class)
    public Map<String, Object> handleInsufficientStock(InsufficientStockException ex) {
        return JsonApiUtil.error(
            String.valueOf(HttpStatus.BAD_REQUEST.value()), // status
            "Solicitud inválida", // title
            ex.getMessage() // detail
        );
    }
}