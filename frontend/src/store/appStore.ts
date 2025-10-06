import { Inventory, PaginationMeta, Product } from '@/types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

/**
 * Estado global de la aplicación
 */
export interface AppState {
    // === PRODUCTOS ===
    products: Product[];
    currentProduct: Product | null;
    productsLoading: boolean;
    productsError: string | null;
    
    // === INVENTARIO ===
    inventory: { [productId: number]: Inventory };
    inventoryLoading: boolean;
    inventoryError: string | null;
    
    // === PAGINACIÓN ===
    pagination: PaginationMeta | null;
    currentPage: number;
    
    // === UI/UX ===
    sidebarOpen: boolean;
    darkMode: boolean;
    notifications: Notification[];
    
    // === ACCIONES - PRODUCTOS ===
    setProducts: (products: Product[]) => void;
    setCurrentProduct: (product: Product | null) => void;
    setProductsLoading: (loading: boolean) => void;
    setProductsError: (error: string | null) => void;
    
    // === ACCIONES - INVENTARIO ===
    setInventory: (productId: number, inventory: Inventory) => void;
    setInventoryLoading: (loading: boolean) => void;
    setInventoryError: (error: string | null) => void;
    
    // === ACCIONES - PAGINACIÓN ===
    setPagination: (pagination: PaginationMeta) => void;
    setCurrentPage: (page: number) => void;
    
    // === ACCIONES - UI/UX ===
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;
    setDarkMode: (enabled: boolean) => void;
    toggleDarkMode: () => void;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
    
    // === ACCIONES UTILITARIAS ===
    updateProductInList: (updatedProduct: Product) => void;
    removeProductFromList: (productId: number) => void;
    clearErrors: () => void;
    reset: () => void;
}

/**
 * Tipo para notificaciones del sistema
 */
interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: number;
    read: boolean;
}

/**
 * Estado inicial de la aplicación
 */
const initialState = {
    // Productos
    products: [],
    currentProduct: null,
    productsLoading: false,
    productsError: null,
    
    // Inventario
    inventory: {},
    inventoryLoading: false,
    inventoryError: null,
    
    // Paginación
    pagination: null,
    currentPage: 0,
    
    // UI/UX
    sidebarOpen: false,
    darkMode: false,
    notifications: [],
};

/**
 * Store principal de la aplicación con persistencia
 */
export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
        ...initialState,

        // === ACCIONES - PRODUCTOS ===
        
        setProducts: (products) => set({ products }),
        
        setCurrentProduct: (product) => set({ currentProduct: product }),
        
        setProductsLoading: (loading) => set({ productsLoading: loading }),
        
        setProductsError: (error) => set({ productsError: error }),

        // === ACCIONES - INVENTARIO ===
        
        setInventory: (productId, inventory) => 
            set((state) => ({ 
            inventory: { ...state.inventory, [productId]: inventory } 
            })),
            
        setInventoryLoading: (loading) => set({ inventoryLoading: loading }),
        
        setInventoryError: (error) => set({ inventoryError: error }),

        // === ACCIONES - PAGINACIÓN ===
        
        setPagination: (pagination) => set({ pagination }),
        
        setCurrentPage: (page) => set({ currentPage: page }),

        // === ACCIONES - UI/UX ===
        
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        
        toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        
        setDarkMode: (enabled) => set({ darkMode: enabled }),
        
        toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
        
        addNotification: (notification) => 
            set((state) => ({
            notifications: [
                {
                id: Math.random().toString(36).substr(2, 9),
                timestamp: Date.now(),
                ...notification,
                read: false,
                },
                ...state.notifications,
            ].slice(0, 50), // Limitar a 50 notificaciones
            })),
            
        removeNotification: (id) =>
            set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
            })),
            
        clearNotifications: () => set({ notifications: [] }),

        // === ACCIONES UTILITARIAS ===
        
        updateProductInList: (updatedProduct) =>
            set((state) => ({
            products: state.products.map((product) =>
                product.id === updatedProduct.id ? updatedProduct : product
            ),
            })),
            
        removeProductFromList: (productId) =>
            set((state) => ({
            products: state.products.filter((product) => product.id !== productId),
            })),
            
        clearErrors: () => set({ 
            productsError: null, 
            inventoryError: null 
        }),
        
        reset: () => set(initialState),
        }),
        {
        name: 'inventory-app-storage',
        storage: createJSONStorage(() => localStorage),
        // Solo persistir estos estados
        partialize: (state) => ({
            darkMode: state.darkMode,
            sidebarOpen: state.sidebarOpen,
            currentPage: state.currentPage,
        }),
        }
    )
);

/**
 * Selectores derivados para optimización
 */
export const useProducts = () => useAppStore((state) => ({
    products: state.products,
    loading: state.productsLoading,
    error: state.productsError,
    currentProduct: state.currentProduct,
}));

export const useInventory = () => useAppStore((state) => ({
    inventory: state.inventory,
    loading: state.inventoryLoading,
    error: state.inventoryError,
}));

export const usePagination = () => useAppStore((state) => ({
    pagination: state.pagination,
    currentPage: state.currentPage,
}));

export const useUI = () => useAppStore((state) => ({
    sidebarOpen: state.sidebarOpen,
    darkMode: state.darkMode,
    notifications: state.notifications,
}));

/**
 * Selectores computados
 */
export const useProductsCount = () => 
    useAppStore((state) => state.products.length);

export const useTotalInventoryValue = () =>
    useAppStore((state) => 
        Object.values(state.inventory).reduce((total, inv) => {
        const product = state.products.find(p => p.id === inv.productId);
        return total + (product?.price || 0) * (inv.quantity || 0);
        }, 0)
    );

export const useLowStockProducts = () =>
    useAppStore((state) =>
        state.products.filter((product) => {
        const inventory = state.inventory[product.id];
        return inventory && inventory.quantity > 0 && inventory.quantity <= 5;
        })
    );

export const useOutOfStockProducts = () =>
    useAppStore((state) =>
        state.products.filter((product) => {
        const inventory = state.inventory[product.id];
        return !inventory || inventory.quantity === 0;
        })
    );

/**
 * Hook para acciones del store
 */
export const useAppActions = () =>
    useAppStore((state) => ({
        setProducts: state.setProducts,
        setCurrentProduct: state.setCurrentProduct,
        setInventory: state.setInventory,
        updateProductInList: state.updateProductInList,
        removeProductFromList: state.removeProductFromList,
        clearErrors: state.clearErrors,
        reset: state.reset,
        toggleSidebar: state.toggleSidebar,
        toggleDarkMode: state.toggleDarkMode,
        addNotification: state.addNotification,
        removeNotification: state.removeNotification,
    }));