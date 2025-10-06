/**
 * Constantes de configuración de la aplicación Frontend,
 * incluyendo URLs de API, configuración de paginación y mensajes de error.
 */
export const API_CONFIG = {
    PRODUCTS: {
        BASE_URL: process.env.NEXT_PUBLIC_PRODUCTS_BASE_URL || 'http://localhost:8081',
        ENDPOINTS: {
        PRODUCTS: '/api/products',
        PRODUCT_BY_ID: '/api/products/{id}',
        },
    },
    INVENTORY: {
        BASE_URL: process.env.NEXT_PUBLIC_INVENTORY_BASE_URL || 'http://localhost:8082',
        ENDPOINTS: {
        STOCK: '/api/inventory/{productId}',
        UPDATE_STOCK: '/api/inventory/{productId}/update',
        },
    },
} as const;

/**
 * Constantes de configuración de la paginación.
 * Incluye el tamaño de páginas predeterminado, tamaño de páginas disponibles y páginas predeterminadas.
 */
export const PAGINATION_CONFIG = {
    DEFAULT_PAGE_SIZE: 10,
    DEFAULT_PAGE: 0,
    PAGE_SIZES: [10, 25, 50],
} as const;

/**
 * Constantes de configuración de niveles de stock.
 * Incluye niveles de stock bajo, medio y alto.
 */
export const STOCK_LEVELS = {
    LOW: 5,
    MEDIUM: 10,
    HIGH: 20,
} as const;

/**
 * Constantes de mensajes de error.
 * Incluye mensajes de error de red, error general, recurso no encontrado y permisos insuficientes.
 */
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Error de conexión. Verifica tu internet e intenta nuevamente.',
    DEFAULT_ERROR: 'Ha ocurrido un error inesperado.',
    NOT_FOUND: 'Recurso no encontrado.',
    UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
} as const;