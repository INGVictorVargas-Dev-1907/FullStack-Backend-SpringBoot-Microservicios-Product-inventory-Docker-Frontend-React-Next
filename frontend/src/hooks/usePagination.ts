import { useState, useCallback } from 'react';

/**
 * Configuración de paginación
 */
export interface PaginationConfig {
    initialPage?: number;
    initialSize?: number;
    totalItems?: number;
}

/**
 * Hook para gestión de paginación
 */
export const usePagination = (config: PaginationConfig = {}) => {
    const {
        initialPage = 0,
        initialSize = 10,
        totalItems = 0
    } = config;

    const [page, setPage] = useState(initialPage);
    const [size, setSize] = useState(initialSize);
    const [total, setTotal] = useState(totalItems);

    /**
     * Ir a página específica
     */
    const goToPage = useCallback((newPage: number) => {
        setPage(Math.max(0, newPage));
    }, []);

    /**
     * Página siguiente
     */
    const nextPage = useCallback(() => {
        setPage(prev => prev + 1);
    }, []);

    /**
     * Página anterior
     */
    const prevPage = useCallback(() => {
        setPage(prev => Math.max(0, prev - 1));
    }, []);

    /**
     * Primera página
     */
    const firstPage = useCallback(() => {
        setPage(0);
    }, []);

    /**
     * Última página
     */
    const lastPage = useCallback(() => {
        const lastPage = Math.ceil(total / size) - 1;
        setPage(Math.max(0, lastPage));
    }, [total, size]);

    /**
     * Cambiar tamaño de página
     */
    const changeSize = useCallback((newSize: number) => {
        setSize(newSize);
        setPage(0); // Reset a primera página al cambiar tamaño
    }, []);

    /**
     * Actualizar total de items
     */
    const updateTotal = useCallback((newTotal: number) => {
        setTotal(newTotal);
    }, []);

    /**
     * Resetear paginación
     */
    const reset = useCallback(() => {
        setPage(initialPage);
        setSize(initialSize);
        setTotal(totalItems);
    }, [initialPage, initialSize, totalItems]);

    // Cálculos derivados
    const totalPages = Math.ceil(total / size);
    const startItem = page * size;
    const endItem = Math.min(startItem + size, total);
    const hasNextPage = page < totalPages - 1;
    const hasPrevPage = page > 0;
    const isFirstPage = page === 0;
    const isLastPage = page >= totalPages - 1;

    return {
        // Estado
        page,
        size,
        total,
        
        // Acciones
        goToPage,
        nextPage,
        prevPage,
        firstPage,
        lastPage,
        changeSize,
        updateTotal,
        reset,
        
        // Utilidades
        totalPages,
        startItem,
        endItem,
        hasNextPage,
        hasPrevPage,
        isFirstPage,
        isLastPage,
        showingText: total > 0 
        ? `Mostrando ${startItem + 1}-${endItem} de ${total}`
        : 'Sin elementos'
    };
};