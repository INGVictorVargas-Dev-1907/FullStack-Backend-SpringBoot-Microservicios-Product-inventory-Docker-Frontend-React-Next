// Exportar stores principales
export { useAppStore, useProducts, useInventory, usePagination, useUI, useAppActions } from './appStore';
export { useProductStore, useFilteredProducts, useProductStats } from './productStore';
export { useInventoryStore, useLowStockItems, useOutOfStockItems, useInventoryStats } from './inventoryStore';
export { useNotificationStore, useNotificationActions } from './notificationStore';

// Exportar tipos
export type { AppState } from './appStore';
export type { ProductState } from './productStore';
export type { InventoryState } from './inventoryStore';
export type { AppNotification } from './notificationStore';