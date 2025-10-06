import { QueryClient } from "@tanstack/react-query";
import { productRepository } from "../repositories/ProductRepository";

/**
 * Configuración de React Query para caching y estado del servidor
 */
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000,   // 10 minutos
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        refetchOnReconnect: true,
        },
        mutations: {
        retry: 1,
        },
    },
});

/**
 * Claves de query para React Query
 */
export const queryKeys = {
    products: {
        all: ["products"] as const,
        lists: () => [...queryKeys.products.all, "list"] as const,
        list: (filters: Record<string, unknown>) =>
        [...queryKeys.products.lists(), { filters }] as const,
        details: () => [...queryKeys.products.all, "detail"] as const,
        detail: (id: number) => [...queryKeys.products.details(), id] as const,
    },
    inventory: {
        all: ["inventory"] as const,
        details: () => [...queryKeys.inventory.all, "detail"] as const,
        detail: (productId: number) =>
        [...queryKeys.inventory.details(), productId] as const,
    },
};

/**
 * Prefetch de datos comunes
 */
export const prefetchConfig = {
    products: {
        firstPage: () => ({
        queryKey: queryKeys.products.list({ page: 0, size: 10 }),
        queryFn: async () => productRepository.getAll({ page: 0, size: 10 }),
        }),
    },
};

const exports = {
    queryClient,
    queryKeys,
    prefetchConfig,
};

export default exports;