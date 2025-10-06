package com.example.products_service.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.math.BigDecimal;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.example.products_service.dto.ProductResponseDto;
import com.example.products_service.entity.Product;
import com.example.products_service.service.ProductService;

/**
 * ProductControllerTest - Clase de prueba para el controlador de productos
 */
@WebMvcTest(ProductController.class)
public class ProductControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Test
    void shouldListProductsWithPagination() throws Exception {
        
        // 1. Preparamos los datos base.
        Product product = new Product();
        product.setId(1L);
        product.setName("Laptop");
        product.setDescription("Dell XPS");
        product.setPrice(BigDecimal.valueOf(1200));
        product.setSku("XPS13");

        // 2. CORRECCIÓN: Crear el ProductResponseDto usando el constructor de todos los argumentos.
        // El orden de los argumentos DEBE coincidir con el orden de los campos en el DTO: (id, name, description, price, sku).
        ProductResponseDto productDto = new ProductResponseDto(
            product.getId(),           // Long id
            product.getName(),         // String name
            product.getDescription(),  // String description
            product.getPrice(),        // BigDecimal price
            product.getSku()           // String sku
        );

        // 3. Mockear el servicio.
        Page<ProductResponseDto> page = new PageImpl<>(List.of(productDto));
        Mockito.when(productService.getAllProducts(PageRequest.of(0, 10))).thenReturn(page);

        // 4. Ejecutar y verificar la petición.
        mockMvc.perform(get("/api/products?page=0&size=10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].attributes.name").value("Laptop"));
    }
}