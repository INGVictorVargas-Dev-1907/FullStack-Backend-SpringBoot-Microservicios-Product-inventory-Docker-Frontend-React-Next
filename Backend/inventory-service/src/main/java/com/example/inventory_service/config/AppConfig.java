package com.example.inventory_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

// Importaciones necesarias para Swagger/OpenAPI
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

// 1. Define el esquema de seguridad global para la API
@OpenAPIDefinition(
    security = {
        // Indica que todas las operaciones requieren esta seguridad por defecto
        @SecurityRequirement(name = "X-API-KEY")
    }
)
// 2. Define cómo funciona el esquema de seguridad
@SecurityScheme(
    name = "X-API-KEY", // Nombre referenciado arriba
    type = SecuritySchemeType.APIKEY,
    in = SecuritySchemeIn.HEADER, // Indica que la clave viaja en el Header
    paramName = "X-API-KEY" // Nombre exacto del header esperado por ApiKeyFilter
)
@Configuration
public class AppConfig {

    @Bean
    public WebClient webClient() {
        return WebClient.create();
    }
}
