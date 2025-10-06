package com.example.products_service.controller;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.products_service.dto.ProductDto;
import com.example.products_service.dto.ProductResponseDto;
import com.example.products_service.service.ProductService;
import com.example.products_service.util.JsonApiUtil;

// Importaciones de Swagger/OpenAPI (para documentación)
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor; // Para inyección de dependencias

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor // Genera automáticamente el constructor para el campo 'service'
@Tag(name = "Productos", description = "Operaciones CRUD para la gestión de productos en el inventario.")
public class ProductController {
    
    // Inyección de dependencias por constructor (gestionada por Lombok)
    private final ProductService service;
    
    /**
     * Crea un nuevo producto.
     *
     * @param dto Información del producto a crear.
     * @return El DTO del producto creado..
     */
    @PostMapping
    @Operation(
        summary = "Crear Nuevo Producto",
        description = "Registra un nuevo producto en la base de datos."
    )
    @ApiResponse(responseCode = "201", description = "Producto creado con éxito.")
    @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos (fallas en la validación @Valid).")
    public ResponseEntity<?> create(@Valid @RequestBody ProductDto dto) {
        ProductResponseDto responseDto = service.create(dto);
        return ResponseEntity.status(201).body(JsonApiUtil.single(responseDto.getId(), "products", responseDto));
    }

    /**
     * Obtiene todos los productos con paginación.
     *
     * @param pageable Información de la paginación de los productos disponibles en la base de datos.
     *  Utiliza parámetros 'page', 'size', 'sort(campos a ordenar en 'sort')' y 'direction'.
     * @return Una colección de productos paginados.
     */
    @GetMapping
    @Operation(
        summary = "Obtener Todos los Productos con Paginación",
        description = "Recupera una lista paginada de todos los productos disponibles. Utiliza parámetros 'page', 'size'"
    )
    @ApiResponse(responseCode = "200", description = "Lista de productos devuelta con éxito.")
    public ResponseEntity<Map<String, Object>> getAllProducts(
        @PageableDefault(page = 0, size = 10, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        
        Page<ProductResponseDto> products = service.getAllProducts(pageable);
        return ResponseEntity.ok(JsonApiUtil.collection(products.getContent(), "products", products));
    }

    /**
     * Busca un producto por su ID.
     *
     * @param id ID del producto a buscar.
     * @return El DTO del producto encontrado.
     */
    @GetMapping("/{id}")
    @Operation(
        summary = "Buscar Producto por ID",
        description = "Busca y recupera un producto específico usando su ID."
    )
    @ApiResponse(responseCode = "200", description = "Producto encontrado.")
    @ApiResponse(responseCode = "404", description = "Producto no encontrado para el ID proporcionado.")
    public ResponseEntity<?> getById(
        @Parameter(description = "ID del producto a buscar", required = true)
        @PathVariable Long id) {
        
        ProductResponseDto responseDto = service.findById(id);
        return ResponseEntity.ok(JsonApiUtil.single(responseDto.getId(), "products", responseDto));
    }

    /**
     * Actualiza parcialmente un producto existente.
     *
     * @param id - ID del producto a actualizar
     * @param dto - Información del producto a actualizar
     * @return El DTO del producto actualizado
     */
    @PatchMapping("/{id}")
    @Operation(
        summary = "Actualizar Producto Parcialmente",
        description = "Modifica uno o más campos de un producto existente. Solo se requieren los campos a cambiar."
    )
    @ApiResponse(responseCode = "200", description = "Producto actualizado con éxito.")
    @ApiResponse(responseCode = "404", description = "Producto a actualizar no encontrado.")
    @ApiResponse(responseCode = "400", description = "Datos de actualización inválidos.")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody ProductDto dto) {
        ProductResponseDto responseDto = service.update(id, dto);
        return ResponseEntity.ok(JsonApiUtil.single(responseDto.getId(), "products", responseDto));
    }

    /**
     * Elimina un producto de la base de datos.
     *
     * @param id ID del producto a eliminar.
     * @return ResponseEntity sin contenido (204 No Content).
     */
    @DeleteMapping("/{id}")
    @Operation(
        summary = "Eliminar Producto",
        description = "Elimina un producto de la base de datos por su ID."
    )
    @ApiResponse(responseCode = "204", description = "Producto eliminado con éxito (No Content).")
    @ApiResponse(responseCode = "404", description = "Producto a eliminar no encontrado.")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
