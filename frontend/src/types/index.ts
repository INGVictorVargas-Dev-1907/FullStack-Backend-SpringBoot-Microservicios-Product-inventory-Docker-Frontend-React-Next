/**
 * Interfaz para un producto
 * @constant id - ID del producto
 * @constant name - Nombre del producto
 * @constant description - Descripción del producto
 * @constant price - Precio del producto
 * @constant sku - SKU del producto(Codigo de barras)
 */
export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    sku: string;
}

/**
 * Interfaz para el inventario de productos
 * @constant productId - ID del producto
 * @constant quantity - Cantidad de productos en el inventario
 * @constant productExists - Indica si el producto existe en el inventario
 * @constant name - Nombre del producto
 * @constant description - Descripción del producto
 * @constant price - Precio del producto
 * @constant sku - SKU del producto
 */
export interface Inventory {
    productId: number;
    quantity: number;
    productExists: boolean;
    name?: string;
    description?: string;
    price?: number;
    sku?: string;
}

/**
 * Interfaz para los metadatos de la respuesta (paginación)
 * @constant totalElements - Total de elementos en la respuesta
 * @constant totalPages - Total de paginas en la respuesta
 * @constant pageNumber - Número de pagina actual
 * @constant pageSize - Cantidad de elementos por pagina
 */
export interface PaginationMeta {
    totalElements: number;
    totalPages: number;
    pageNumber: number;
    pageSize: number;
}

/**
 * Interfaz para la respuesta de la API
 * @constant data - Datos de la respuesta
 * @constant data[].id - ID del producto
 * @constant data[].type - Tipo de recurso
 * @constant data[].attributes - Atributos del producto
 * @constant meta - Metadatos de la respuesta (paginación)
 */
export interface ProductsResponse {
    data: Array<{
        id: string;
        type: string;
        attributes: Product;
    }>;
    meta: PaginationMeta;
}

/**
 * Interfaz para la respuesta de la API
 * @constant data - Datos de la respuesta
 * @constant data.id - ID del producto
 * @constant data.type - Tipo de recurso
 * @constant data.attributes - Atributos del producto
 */
export interface InventoryResponse {
    data: {
        id: string;
        type: string;
        attributes: Inventory;
    };
}

/**
 * Interfaz para la respuesta de error de la API
 * @constant errors - Array de errores
 * @constant errors[].status - Código de estado HTTP del error
 * @constant errors[].title - Mensaje de error
 * @constant errors[].detail - Detalle del error
 */
export interface ApiError {
    errors: Array<{
        status: string;
        title: string;
        detail: string;
    }>;
}

/**
 * Interfaz para la solicitud de actualización de stock
 * @constant changeQuantity - Cantidad de stock a actualizar
 */
export interface InventoryUpdateRequest {
    changeQuantity: number;
}

/**
 * Interfaz para los datos de un producto en el formulario
 * @constant name - Nombre del producto
 * @constant description - Descripción del producto
 * @constant price - Precio del producto
 * @constant sku - SKU del producto
 */
export interface ProductFormData {
    name: string;
    description: string;
    price: number;
    sku: string;
}

/**
 * Estados de stock para un producto
 * @constant OUT_OF_STOCK - Sin stock
 * @constant LOW_STOCK - Stock bajo
 * @constant IN_STOCK - Stock medio
 * @constant HIGH_STOCK - Stock alto
 */
export enum StockStatus {
    OUT_OF_STOCK = 'out_of_stock',
    LOW_STOCK = 'low_stock',
    IN_STOCK = 'in_stock',
    HIGH_STOCK = 'high_stock'
}

/**
 * Estados de carga para la aplicación
 * @constant IDLE - Estado de inicio
 * @constant LOADING - Estado de carga
 * @constant SUCCESS - Estado de éxito
 * @constant ERROR - Estado de error
 */
export enum LoadingState {
    IDLE = 'idle',
    LOADING = 'loading',
    SUCCESS = 'success',
    ERROR = 'error'
}

/**
 * Interfaz para el estado global de la aplicación
 * @constant products - Array de productos
 * @constant currentProduct - Producto actual
 * @constant loading - Estado de carga
 * @constant error - Mensaje de error
 * @constant pagination - Metadatos de la respuesta (paginación)
 */
export interface AppState {
    products: Product[];
    currentProduct: Product | null;
    loading: LoadingState;
    error: string | null;
    pagination: PaginationMeta | null;
}