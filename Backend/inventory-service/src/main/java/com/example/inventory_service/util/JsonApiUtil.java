package com.example.inventory_service.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;

/**
 * JsonApiUtil - Utilitario estático para generar respuestas que cumplen con el estándar JSON:API.
 * Proporciona métodos para construir documentos de recurso único, colecciones/listados y errores.
 * NOTA: Este utilitario asume que los DTOs de atributo tienen un método 'getId()' para la creación
 * de recursos. Si no lo tienen, el ID del recurso será nulo.
 */
public class JsonApiUtil {

    /**
     * Crea un objeto JSON:API de un solo recurso.
     * * @param id - ID del recurso (Long, Integer, etc.).
     * @param type - Tipo del recurso (ej: "products", "inventory").
     * @param attributes - Objeto con los atributos del recurso (el DTO de respuesta plano).
     * @return Un objeto Map que representa el documento JSON:API de un solo recurso.
     */
    public static <T> Map<String, Object> single(T id, String type, Object attributes) {
        // Objeto 'data' (el recurso)
        Map<String, Object> data = new HashMap<>();
        // El formato JSON:API requiere que el ID sea una cadena.
        data.put("id", id == null ? null : String.valueOf(id));
        data.put("type", type);
        data.put("attributes", attributes);
        
        // Objeto raíz
        Map<String, Object> root = new HashMap<>();
        root.put("data", data);
        return root;
    }

    /**
     * Crea un objeto JSON:API de una colección de recursos con metadatos de paginación.
     * Este método es crucial para el listado de productos paginado.
     * * @param items - Lista de DTOs (los atributos).
     * @param type - Tipo del recurso (ej: "products").
     * @param page - Objeto Page de Spring Data JPA para extraer metadatos de paginación.
     * @return Un objeto Map que representa el documento JSON:API de una colección con 'meta'.
     */
    public static Map<String, Object> collection(List<?> items, String type, Page<?> page) {
        
        // 1. Construir la lista de recursos ('data' array)
        List<Map<String, Object>> dataList = items.stream()
            .map(attributes -> {
                Long id = null;
                // Intenta obtener el ID del DTO (necesario para el estándar)
                try {
                    id = (Long) attributes.getClass().getMethod("getId").invoke(attributes);
                } catch (Exception ignored) {
                    // Si el DTO no tiene getId(), el id del recurso será nulo.
                }

                Map<String, Object> resource = new HashMap<>();
                resource.put("id", id != null ? String.valueOf(id) : null);
                resource.put("type", type);
                resource.put("attributes", attributes);
                return resource;
            })
            .collect(Collectors.toList());

        // 2. Construir los metadatos de paginación ('meta' block)
        Map<String, Object> meta = new HashMap<>();
        meta.put("total-elements", page.getTotalElements());
        meta.put("total-pages", page.getTotalPages());
        meta.put("page-number", page.getNumber());
        meta.put("page-size", page.getSize());
        
        // 3. Construir la respuesta raíz
        Map<String, Object> root = new HashMap<>();
        root.put("data", dataList); // Lista de recursos
        root.put("meta", meta);     // Metadatos de paginación
        
        return root;
    }


    /**
     * Crea un objeto JSON:API de un error (bloque 'errors').
     * Utilizado en los métodos @ExceptionHandler del controlador.
     * * @param status - Código de estado HTTP del error (String).
     * @param title - Título breve del error.
     * @param detail - Detalle específico del error.
     * @return Un objeto Map que representa el documento JSON:API de error.
     */
    public static Map<String, Object> error(String status, String title, String detail) {
        Map<String, String> err = new HashMap<>();
        err.put("status", status);
        err.put("title", title);
        err.put("detail", detail);
        
        Map<String, Object> root = new HashMap<>();
        root.put("errors", List.of(err));
        return root;
    }
}