package com.example.products_service.exception;

import com.example.products_service.controller.ProductController;
import com.example.products_service.service.ProductService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    // -----------------------------------------------------------
    // TEST 1: Producto No Encontrado (HTTP 404)
    // -----------------------------------------------------------
    @Test
    void shouldReturnHttp404WhenResourceNotFound() throws Exception {
        // 1. Mock: Lanza la excepción específica ResourceNotFoundException
        Mockito.when(productService.getProductById(anyLong()))
                .thenThrow(new ResourceNotFoundException("Producto con ID 99 no encontrado"));

        mockMvc.perform(get("/api/products/99")
                        .contentType(MediaType.APPLICATION_JSON))
                // 2. ✅ CORRECCIÓN: Esperar 404 Not Found (isNotFound())
                .andExpect(status().isNotFound())
                // 3. Verificar el cuerpo JSON que genera el handler de 404
                // (Basado en JsonApiUtil.error("404", "Not Found", ex.getMessage()))
                .andExpect(jsonPath("$.errors[0].status").value("404"))
                .andExpect(jsonPath("$.errors[0].title").value("Not Found"))
                .andExpect(jsonPath("$.errors[0].detail").value("Producto con ID 99 no encontrado"));
    }

    // -----------------------------------------------------------
    // TEST 2: Error Genérico (HTTP 500)
    // -----------------------------------------------------------
    @Test
    void shouldReturnHttp500WhenGenericErrorOccurs() throws Exception {
        final String errorMessage = "Error inesperado en la base de datos";
        
        // Mock: Lanza una excepción genérica (la cual será capturada por handleAll(Exception.class))
        Mockito.when(productService.getProductById(anyLong()))
                .thenThrow(new RuntimeException(errorMessage));

        mockMvc.perform(get("/api/products/1")
                        .contentType(MediaType.APPLICATION_JSON))
                // 1. ✅ Esperar 500 Internal Server Error (isInternalServerError())
                .andExpect(status().isInternalServerError())
                // 2. Verificar el cuerpo JSON que genera el handler de 500
                // (Basado en JsonApiUtil.error("500", "Internal Server Error", ex.getMessage()))
                .andExpect(jsonPath("$.errors[0].status").value("500"))
                .andExpect(jsonPath("$.errors[0].title").value("Internal Server Error"))
                .andExpect(jsonPath("$.errors[0].detail").value(errorMessage));
    }
}