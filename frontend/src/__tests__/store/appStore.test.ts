import { useAppActions, useAppStore, useInventory, useProducts } from '@/store/appStore';
import { Inventory, Product } from '@/types';
import { act, renderHook } from '@testing-library/react';

// Mock data
const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    sku: 'TEST123'
};

const mockInventory: Inventory = {
    productId: 1,
    quantity: 10,
    productExists: true
};

describe('App Store', () => {
    beforeEach(() => {
        // Reset the store to initial state
        useAppStore.setState(useAppStore.getInitialState());
    });

    it('should set products correctly', () => {
        const { result } = renderHook(() => useAppStore());

        act(() => {
        result.current.setProducts([mockProduct]);
        });

        expect(result.current.products).toEqual([mockProduct]);
    });

    it('should update product in list', () => {
        const { result } = renderHook(() => useAppStore());

        // First set some products
        act(() => {
        result.current.setProducts([mockProduct]);
        });

        const updatedProduct = { ...mockProduct, name: 'Updated Product' };

        act(() => {
        result.current.updateProductInList(updatedProduct);
        });

        expect(result.current.products[0].name).toBe('Updated Product');
    });

    it('should remove product from list', () => {
        const { result } = renderHook(() => useAppStore());

        // First set some products
        act(() => {
        result.current.setProducts([mockProduct]);
        });

        act(() => {
        result.current.removeProductFromList(1);
        });

        expect(result.current.products).toHaveLength(0);
    });

    it('should set inventory for product', () => {
        const { result } = renderHook(() => useAppStore());

        act(() => {
        result.current.setInventory(1, mockInventory);
        });

        expect(result.current.inventory[1]).toEqual(mockInventory);
    });

    it('should clear errors', () => {
        const { result } = renderHook(() => useAppStore());

        // First set some errors
        act(() => {
        result.current.setProductsError('Product error');
        result.current.setInventoryError('Inventory error');
        });

        act(() => {
        result.current.clearErrors();
        });

        expect(result.current.productsError).toBeNull();
        expect(result.current.inventoryError).toBeNull();
    });

    it('should toggle sidebar', () => {
        const { result } = renderHook(() => useAppStore());

        const initialSidebarState = result.current.sidebarOpen;

        act(() => {
        result.current.toggleSidebar();
        });

        expect(result.current.sidebarOpen).toBe(!initialSidebarState);
    });

    it('should toggle dark mode', () => {
        const { result } = renderHook(() => useAppStore());

        const initialDarkModeState = result.current.darkMode;

        act(() => {
        result.current.toggleDarkMode();
        });

        expect(result.current.darkMode).toBe(!initialDarkModeState);
    });

    describe('Selectors', () => {
        it('useProducts selector should return correct state', () => {
        const { result: store } = renderHook(() => useAppStore());
        const { result: selector } = renderHook(() => useProducts());

        act(() => {
            store.current.setProducts([mockProduct]);
            store.current.setProductsLoading(true);
        });

        expect(selector.current.products).toEqual([mockProduct]);
        expect(selector.current.loading).toBe(true);
        });

        it('useInventory selector should return correct state', () => {
        const { result: store } = renderHook(() => useAppStore());
        const { result: selector } = renderHook(() => useInventory());

        act(() => {
            store.current.setInventory(1, mockInventory);
            store.current.setInventoryLoading(true);
        });

        expect(selector.current.inventory).toEqual({ 1: mockInventory });
        expect(selector.current.loading).toBe(true);
        });

        it('useAppActions should return all actions', () => {
        const { result } = renderHook(() => useAppActions());

        expect(result.current.setProducts).toBeDefined();
        expect(result.current.setInventory).toBeDefined();
        expect(result.current.clearErrors).toBeDefined();
        expect(result.current.toggleSidebar).toBeDefined();
        expect(result.current.toggleDarkMode).toBeDefined();
        });
    });

    describe('Derived State', () => {
        it('should calculate products count', () => {
        const { result } = renderHook(() => useAppStore());

        act(() => {
            result.current.setProducts([mockProduct, { ...mockProduct, id: 2 }]);
        });

        expect(result.current.products.length).toBe(2);
        });

        it('should handle notifications', () => {
        const { result } = renderHook(() => useAppStore());

        act(() => {
            result.current.addNotification({
            type: 'success',
            title: 'Success',
            message: 'Operation completed',
            read: false,
            });
        });

        expect(result.current.notifications).toHaveLength(1);
        expect(result.current.notifications[0].type).toBe('success');

        const notificationId = result.current.notifications[0].id;

        act(() => {
            result.current.removeNotification(notificationId);
        });

        expect(result.current.notifications).toHaveLength(0);
        });
    });
});