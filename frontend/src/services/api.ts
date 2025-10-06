import {
    InventoryResponse,
    InventoryUpdateRequest,
    ProductFormData,
    ProductsResponse
} from '@/types';
import axios, { AxiosError } from "axios";

// Configuración de APIs
const PRODUCTS_BASE_URL = process.env.NEXT_PUBLIC_PRODUCTS_BASE_URL || 'http://localhost:8080';
const INVENTORY_BASE_URL = process.env.NEXT_PUBLIC_INVENTORY_BASE_URL || 'http://localhost:8082';

// Cliente para Products Service
const productsApi = axios.create({
    baseURL: PRODUCTS_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.NEXT_PUBLIC_PRODUCTS_API_KEY || 'ab1a0aedc33841c286c108ff65ac501e=',
    },
    timeout: 10000, // 10 segundos
});

// Cliente para Inventory Service
const inventoryApi = axios.create({
    baseURL: INVENTORY_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.NEXT_PUBLIC_INVENTORY_API_KEY || 'c434f40f252d43e59a67451a5664188b=',
    },
    timeout: 10000,
});

// Interceptores para logging en desarrollo
productsApi.interceptors.request.use((config) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 [Products API] ${config.method?.toUpperCase()} ${config.url}`, config.params || '');
    }
    return config;
});

inventoryApi.interceptors.request.use((config) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 [Inventory API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
});

// Interceptores de respuesta para manejo de errores
productsApi.interceptors.response.use(
    (response) => {
        if (process.env.NODE_ENV === 'development') {
        console.log(`✅ [Products API] ${response.status} ${response.config.url}`);
        }
        return response;
    },
    (error) => {
        const errorMessage = error.response?.data?.errors?.[0]?.detail || error.message || 'Error desconocido';
        
        if (process.env.NODE_ENV === 'development') {
        console.error(`❌ [Products API Error] ${error.config?.url}:`, errorMessage);
        }
        
        return Promise.reject(error);
    }
);

inventoryApi.interceptors.response.use(
    (response) => {
        if (process.env.NODE_ENV === 'development') {
        console.log(`✅ [Inventory API] ${response.status} ${response.config.url}`);
        }
        return response;
    },
    (error) => {
        const errorMessage = error.response?.data?.errors?.[0]?.detail || error.message || 'Error desconocido';
        
        if (process.env.NODE_ENV === 'development') {
        console.error(`❌ [Inventory API Error] ${error.config?.url}:`, errorMessage);
        }
        
        return Promise.reject(error);
    }
);

/**
 * Servicio para Products API
 */
export const productsService = {
    /**
     * Obtener lista paginada de productos
     */
    getProducts: (page: number = 0, size: number = 10): Promise<ProductsResponse> => {
        return productsApi
        // ⭐️ CORREGIDO: Usando /api/products
        .get(`/api/products?page=${page}&size=${size}`) 
        .then(res => res.data);
    },

    /**
     * Obtener producto por ID
     */
    getProductById: (id: number): Promise<ProductsResponse> => {
        return productsApi
        // ⭐️ CORREGIDO: Usando /api/products/{id}
        .get(`/api/products/${id}`)
        .then(res => res.data);
    },

    /**
     * Crear nuevo producto
     */
    createProduct: (product: ProductFormData): Promise<ProductsResponse> => {
        return productsApi
        // ⭐️ CORREGIDO: Usando /api/products
        .post('/api/products', product)
        .then(res => res.data);
    },

    /**
     * Actualizar producto existente
     */
    updateProduct: (id: number, product: Partial<ProductFormData>): Promise<ProductsResponse> => {
        return productsApi
        // ⭐️ CORREGIDO: Usando /api/products/{id}
        .patch(`/api/products/${id}`, product)
        .then(res => res.data);
    },

    /**
     * Eliminar producto
     */
    deleteProduct: (id: number): Promise<void> => {
        return productsApi
        // ⭐️ CORREGIDO: Usando /api/products/{id}
        .delete(`/api/products/${id}`);
    },
};

/**
 * Servicio para Inventory API
 */
export const inventoryService = {
    /**
     * Obtener stock de un producto
     */
    getStock: (productId: number): Promise<InventoryResponse> => {
        return inventoryApi
        // ⭐️ CORREGIDO: Usando /api/inventory/{productId}
        .get(`/api/inventory/${productId}`)
        .then(res => res.data);
    },

    /**
     * Actualizar stock de un producto
     */
    updateStock: (productId: number, update: InventoryUpdateRequest): Promise<InventoryResponse> => {
        return inventoryApi
        // ⭐️ CORREGIDO: Usando /api/inventory/{productId}/update
        .post(`/api/inventory/${productId}/update`, update)
        .then(res => res.data);
    },
};
/**
 * Función para verificar si un error es de tipo AxiosError con 'errors' en la respuesta
 * @param error Error a verificar
 * @returns Booleano indicando si el error es de tipo AxiosError con 'errors'
 */
export const isApiError = (error: unknown): error is AxiosError<{ errors: { detail: string }[] }> => {
    return (
        axios.isAxiosError(error) &&
        !!error.response?.data?.errors
    );
};

/**
 * Función para obtener el mensaje de error de un error
 * @param error Error a formatear
 * @returns Mensaje de error
 */
export const getErrorMessage = (error: unknown): string => {
    if (isApiError(error)) {
        return error.response?.data?.errors?.[0]?.detail || 'Error desconocido';
    }

    if (error instanceof Error) {
        return error.message;
    }

    return 'Error de conexión';
};

const api = {
    products: productsService,
    inventory: inventoryService,
    isApiError,
    getErrorMessage,
};

export default api;
export { productsApi, inventoryApi };