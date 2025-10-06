import { Product } from '@/types';
import { create } from 'zustand';

/**
 * Estado específico para productos
 */
export interface ProductState {
    // Estado
    products: Product[];
    selectedProduct: Product | null;
    loading: boolean;
    error: string | null;
    searchQuery: string;
    filters: {
        minPrice: number | null;
        maxPrice: number | null;
        inStock: boolean | null;
    };
    sortBy: 'name' | 'price' | 'sku';
    sortOrder: 'asc' | 'desc';

    // Acciones
    setProducts: (products: Product[]) => void;
    setSelectedProduct: (product: Product | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setSearchQuery: (query: string) => void;
    setFilters: (filters: Partial<ProductState['filters']>) => void;
    setSort: (sortBy: ProductState['sortBy'], sortOrder?: ProductState['sortOrder']) => void;
    addProduct: (product: Product) => void;
    updateProduct: (productId: number, updates: Partial<Product>) => void;
    deleteProduct: (productId: number) => void;
    clearFilters: () => void;
    reset: () => void;
}

/**
 * Estado inicial para productos
 */
const initialProductState = {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
    searchQuery: '',
    filters: {
        minPrice: null,
        maxPrice: null,
        inStock: null,
    },
    sortBy: 'name' as const,
    sortOrder: 'asc' as const,
};

/**
 * Store específico para productos
 */
export const useProductStore = create<ProductState>((set, get) => ({
    ...initialProductState,

    setProducts: (products) => set({ products }),

    setSelectedProduct: (product) => set({ selectedProduct: product }),

    setLoading: (loading) => set({ loading }),

    setError: (error) => set({ error }),

    setSearchQuery: (query) => set({ searchQuery: query }),

    setFilters: (filters) => 
        set((state) => ({ 
        filters: { ...state.filters, ...filters } 
        })),

    setSort: (sortBy, sortOrder) => 
        set({ 
        sortBy, 
        sortOrder: sortOrder || get().sortOrder 
        }),

    addProduct: (product) =>
        set((state) => ({
        products: [product, ...state.products],
        })),

    updateProduct: (productId, updates) =>
        set((state) => ({
        products: state.products.map((product) =>
            product.id === productId ? { ...product, ...updates } : product
        ),
        selectedProduct:
            state.selectedProduct?.id === productId
            ? { ...state.selectedProduct, ...updates }
            : state.selectedProduct,
        })),

    deleteProduct: (productId) =>
        set((state) => ({
        products: state.products.filter((product) => product.id !== productId),
        selectedProduct:
            state.selectedProduct?.id === productId ? null : state.selectedProduct,
        })),

    clearFilters: () =>
        set({
        searchQuery: '',
        filters: initialProductState.filters,
        }),

    reset: () => set(initialProductState),
}));

/**
 * Selectores derivados para productos
 */
export const useFilteredProducts = () => {
    const { products, searchQuery, filters, sortBy, sortOrder } = useProductStore();

    const filtered = products.filter((product) => {
        // Filtro de búsqueda
        const matchesSearch =
        searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchQuery.toLowerCase());

        // Filtros de precio
        const matchesMinPrice = !filters.minPrice || product.price >= filters.minPrice;
        const matchesMaxPrice = !filters.maxPrice || product.price <= filters.maxPrice;

        return matchesSearch && matchesMinPrice && matchesMaxPrice;
    });

    // Ordenamiento tipado correctamente
    filtered.sort((a, b) => {
        const aValue = a[sortBy] as string | number;
        const bValue = b[sortBy] as string | number;

        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    return filtered;
};

export const useProductStats = () =>
    useProductStore((state) => {
        const totalProducts = state.products.length;
        const totalValue = state.products.reduce((sum, product) => sum + product.price, 0);
        const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;

        return {
        totalProducts,
        totalValue,
        averagePrice,
        };
    });