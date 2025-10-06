import { create } from 'zustand';
import { Inventory, Product } from '@/types';

/**
 * Estado específico para inventario
 */
export interface InventoryState {
    // Estado
    inventory: { [productId: number]: Inventory };
    loading: boolean;
    error: string | null;
    lastUpdated: number | null;
    lowStockThreshold: number;

    // Acciones
    setInventory: (productId: number, inventory: Inventory) => void;
    setMultipleInventory: (inventoryMap: { [productId: number]: Inventory }) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    updateStock: (productId: number, change: number) => void;
    setStock: (productId: number, quantity: number) => void;
    setLowStockThreshold: (threshold: number) => void;
    clearInventory: () => void;
    reset: () => void;
}

/**
 * Estado inicial para inventario
 */
const initialInventoryState = {
    inventory: {},
    loading: false,
    error: null,
    lastUpdated: null,
    lowStockThreshold: 5,
};

/**
 * Store específico para inventario
 */
export const useInventoryStore = create<InventoryState>((set, get) => ({
    ...initialInventoryState,

    setInventory: (productId, inventory) =>
        set((state) => ({
        inventory: { ...state.inventory, [productId]: inventory },
        lastUpdated: Date.now(),
        })),

    setMultipleInventory: (inventoryMap) =>
        set((state) => ({
        inventory: { ...state.inventory, ...inventoryMap },
        lastUpdated: Date.now(),
        })),

    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    updateStock: (productId, change) =>
        set((state) => {
        const current = state.inventory[productId];
        if (!current) {
            // Si no existe, crear nuevo registro
            return {
            inventory: {
                ...state.inventory,
                [productId]: {
                productId,
                quantity: Math.max(0, change),
                productExists: true,
                },
            },
            lastUpdated: Date.now(),
            };
        }

        const newQuantity = Math.max(0, current.quantity + change);
        return {
            inventory: {
            ...state.inventory,
            [productId]: {
                ...current,
                quantity: newQuantity,
            },
            },
            lastUpdated: Date.now(),
        };
        }),

    setStock: (productId, quantity) =>
        set((state) => {
        const current = state.inventory[productId];
        return {
            inventory: {
            ...state.inventory,
            [productId]: {
                ...current,
                productId,
                quantity: Math.max(0, quantity),
                productExists: true,
            },
            },
            lastUpdated: Date.now(),
        };
        }),

    setLowStockThreshold: (threshold) => set({ lowStockThreshold: threshold }),

    clearInventory: () => set({ inventory: {}, lastUpdated: Date.now() }),

    reset: () => set(initialInventoryState),
}));

/**
 * Selectores derivados para inventario
 */
export const useInventoryByProductId = (productId: number) =>
    useInventoryStore((state) => state.inventory[productId]);

export const useLowStockItems = () => {
    const { inventory, lowStockThreshold } = useInventoryStore();
    
    return Object.values(inventory).filter(
        (item) => item.quantity > 0 && item.quantity <= lowStockThreshold
    );
};

export const useOutOfStockItems = () =>
    useInventoryStore((state) =>
        Object.values(state.inventory).filter((item) => item.quantity === 0)
    );

    export const useInventoryStats = () =>
    useInventoryStore((state) => {
        const items = Object.values(state.inventory);
        const totalItems = items.length;
        const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
        const lowStockCount = items.filter(
        (item) => item.quantity > 0 && item.quantity <= state.lowStockThreshold
        ).length;
        const outOfStockCount = items.filter((item) => item.quantity === 0).length;

        return {
        totalItems,
        totalQuantity,
        lowStockCount,
        outOfStockCount,
        inStockCount: totalItems - outOfStockCount,
        };
    });

export const useInventoryValue = (products: Product[]) =>
    useInventoryStore((state) =>
        Object.values(state.inventory).reduce((total, item) => {
        const product = products.find((p) => p.id === item.productId);
        return total + (product?.price || 0) * item.quantity;
        }, 0)
    );