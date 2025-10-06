package com.example.products_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;

@Configuration
public class OpenApiConfig {
    private static final String API_KEY_HEADER = "X-API-KEY";

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .components(new Components()
                .addSecuritySchemes(API_KEY_HEADER, createApiKeyScheme())
            )
            // Aplica la seguridad de la API Key globalmente
            .addSecurityItem(new SecurityRequirement().addList(API_KEY_HEADER));
    }

    private SecurityScheme createApiKeyScheme() {
        return new SecurityScheme()
                .type(SecurityScheme.Type.APIKEY)
                .in(SecurityScheme.In.HEADER)
                .name(API_KEY_HEADER)
                .description("Clave de acceso para la API de productos (requerida por ApiKeyFilter)");
    }
}