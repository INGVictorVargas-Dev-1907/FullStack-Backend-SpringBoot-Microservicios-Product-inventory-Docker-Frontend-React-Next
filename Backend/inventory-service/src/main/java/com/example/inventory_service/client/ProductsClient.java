package com.example.inventory_service.client;

import java.util.Map;
import java.util.concurrent.CompletableFuture;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import com.example.inventory_service.dto.ProductDto;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.github.resilience4j.retry.annotation.Retry;
import io.github.resilience4j.timelimiter.annotation.TimeLimiter;
import reactor.core.publisher.Mono;

@Component
public class ProductsClient {

    private static final Logger log = LoggerFactory.getLogger(ProductsClient.class);

    private final WebClient webClient;
    private final String apiKey;
    private final ObjectMapper objectMapper;

    public ProductsClient(WebClient webClient,
                            @Value("${products.base-url}") String baseUrl,
                            @Value("${products.api-key}") String apiKey,
                            ObjectMapper objectMapper){
                            
        this.webClient = webClient.mutate().baseUrl(baseUrl).build();
        this.apiKey = apiKey;
        this.objectMapper = objectMapper;
    }

    @Retry(name = "productsClient", fallbackMethod = "fallbackGetProduct")
    @TimeLimiter(name = "productsClient")
    public CompletableFuture<ProductDto> getProductById(Long id) {
        return CompletableFuture.supplyAsync(() -> {
            log.info("🔗 Consultando producto {} en Products Service", id);
            
            Map<String, Object> JsonApiWrapper = webClient.get()
                    .uri("/api/products/{id}", id) 
                    .header("X-API-KEY", apiKey)
                    .retrieve()
                    
                    // Manejo del 404 (NOT_FOUND)
                    .onStatus(status -> status.isSameCodeAs(HttpStatus.NOT_FOUND), 
                        response -> Mono.empty() 
                    )
                    // Esperamos el Wrapper de JSON:API
                    .bodyToMono(Map.class)
                    .block();
            
            // Si la respuesta fue 404 o el cuerpo estaba vacío
            if (jsonApiWrapper == null || !jsonApiWrapper.containsKey("data")) {
                return null;
            }

            Map<String, Object> dataBlock = (Map<String, Object>) jsonApiWrapper.get("data");

            if (dataBlock == null || !dataBlock.containsKey("attributes")) {
                log.error("❌ Respuesta JSON:API inválida para producto {}: Falta el bloque 'attributes'.", id);
                return null;
            }
            Map<String, Object> attributes = (Map<String, Object>) dataBlock.get("attributes");

            return objectMapper.convertValue(attributes, ProductDto.class);
        });
    }

    @SuppressWarnings("unused")
    private CompletableFuture<ProductDto> fallbackGetProduct(Long id, Throwable ex) {
        if (ex instanceof WebClientResponseException wcre && wcre.getStatusCode() == HttpStatus.NOT_FOUND) {
                log.warn("Producto {} no encontrado (404) y se devolvió null en fallback.", id);
                return CompletableFuture.completedFuture(null);
        }
        
        log.error("❌ Error al consultar producto {} en Products Service. Fallback activado: {}", id, ex.getMessage());
        return CompletableFuture.completedFuture(null);
    }
}