export { useProducts } from './useProducts';
export { useInventory } from './useInventory';
export { useApi, useProductApi, useInventoryApi } from './useApi';
export { usePagination } from './usePagination';
export { useLocalStorage, useUserPreferences, useCart } from './useLocalStorage';

// Re-exportar tipos
export type { ApiState, ApiConfig } from './useApi';
export type { PaginationConfig } from './usePagination';