package com.example.products_service.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class ApiKeyFilter extends OncePerRequestFilter {

    @Value("${app.security.internal-api-key}")
    private String internalApiKey;

    @Override
    protected void doFilterInternal(
            @org.springframework.lang.NonNull HttpServletRequest request,
            @org.springframework.lang.NonNull HttpServletResponse response,
            @org.springframework.lang.NonNull FilterChain filterChain)
            throws ServletException, IOException {

        if (HttpMethod.OPTIONS.matches(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String requestUri = request.getRequestURI();

        // 🔹 Ignorar validación para rutas públicas (no OPTIONS)
        if (requestUri.startsWith("/swagger")
                || requestUri.startsWith("/v3/api-docs")
                || requestUri.startsWith("/actuator")
                || requestUri.startsWith("/error")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 🔹 Validar API Key solo para /api/products/** (solo en GET, POST, etc.)
        if (requestUri.startsWith("/api/products")) {
            String apiKey = request.getHeader("X-API-KEY");
            if (apiKey == null || !apiKey.equals(internalApiKey)) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                        "Acceso Denegado: API Key inválida o faltante.");
                return;
            }
        }

        // Dejar continuar la cadena
        filterChain.doFilter(request, response);
    }
}