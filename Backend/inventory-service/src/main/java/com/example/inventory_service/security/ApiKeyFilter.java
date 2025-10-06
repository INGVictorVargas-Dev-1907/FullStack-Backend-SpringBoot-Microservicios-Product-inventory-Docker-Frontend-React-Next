package com.example.inventory_service.security;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
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

        String requestUri = request.getRequestURI();

        // 🔹 Permitir solicitudes preflight (CORS)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            response.setHeader("Access-Control-Allow-Origin", request.getHeader("Origin"));
            response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
            response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, X-API-KEY");
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        // 🔹 Ignorar validación para rutas públicas
        if (requestUri.startsWith("/swagger")
                || requestUri.startsWith("/v3/api-docs")
                || requestUri.startsWith("/actuator")
                || requestUri.startsWith("/error")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 🔹 Validar API Key solo para /api/inventory/**
        if (requestUri.startsWith("/api/inventory")) {
            String apiKey = request.getHeader("X-API-KEY");
            if (apiKey == null || !apiKey.equals(internalApiKey)) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                        "Acceso Denegado: API Key inválida o faltante.");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}