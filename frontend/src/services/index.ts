// Exportaciones principales
export type { Inventory, InventoryResponse, Product, ProductsResponse } from '@/types';
export { getErrorMessage, inventoryService, isApiError, productsService } from './api';

// Exportaciones de repositorios
export type { BaseRepository } from './repositories/BaseRepository';
export { inventoryRepository } from './repositories/InventoryRepository';
export { productRepository } from './repositories/ProductRepository';

// Exportaciones de cache (opcional)
export { queryClient, queryKeys } from './cache/ReactQueryCache';

// Instancia única de servicios
import { inventoryService as is, productsService as ps } from './api';
import { inventoryRepository as ir, productRepository as pr } from './repositories';

export const services = {
    products: ps,
    inventory: is,
    repositories: {
        products: pr,
        inventory: ir,
    },
};

export default services;