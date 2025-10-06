import { useCallback, useEffect, useState } from 'react';
import { useAppStore } from '@/store/appStore';
import { inventoryService } from '@/services/api';
import { Inventory } from '@/types';
import toast from 'react-hot-toast';

/**
 * Tipo de error esperado en respuestas del backend
 */
type ApiError = {
    response?: {
        data?: {
        errors?: { detail?: string }[];
        };
        status?: number;
    };
};

/**
 * Hook para gestión de inventario
 */
export const useInventory = (productId?: number) => {
    const {
        inventory,
        inventoryLoading,
        inventoryError,
        setInventory,
        setInventoryLoading,
        setInventoryError
    } = useAppStore();

    const [localLoading, setLocalLoading] = useState(false);

    /**
     * Cargar inventario de un producto
     */
    const loadInventory = useCallback(async (id: number) => {
        try {
        setInventoryLoading(true);
        setInventoryError(null);

        const response = await inventoryService.getStock(id);
        const inventoryData: Inventory = {
            ...response.data.attributes,
            productId: parseInt(response.data.id)
        };

        setInventory(id, inventoryData);
        return inventoryData;
        } catch (error: unknown) {
        const err = error as ApiError;
        const errorMessage =
            err.response?.data?.errors?.[0]?.detail || 'Error al cargar inventario';
        setInventoryError(errorMessage);

        if (err.response?.status !== 404) {
            toast.error(errorMessage);
        }

        throw err;
        } finally {
        setInventoryLoading(false);
        }
    }, [setInventory, setInventoryLoading, setInventoryError]);

    /**
     * Actualizar stock de un producto
     */
    const updateStock = useCallback(async (id: number, change: number) => {
        try {
        setLocalLoading(true);

        const response = await inventoryService.updateStock(id, { changeQuantity: change });
        const updatedInventory: Inventory = {
            ...response.data.attributes,
            productId: parseInt(response.data.id)
        };

        setInventory(id, updatedInventory);

        const action = change > 0 ? 'incrementado' : 'disminuido';
        toast.success(`Stock ${action} correctamente`);

        return updatedInventory;
        } catch (error: unknown) {
        const err = error as ApiError;
        const errorMessage =
            err.response?.data?.errors?.[0]?.detail || 'Error al actualizar stock';
        toast.error(errorMessage);
        throw err;
        } finally {
        setLocalLoading(false);
        }
    }, [setInventory]);

    /**
     * Cargar inventario para múltiples productos
     */
    const loadMultipleInventory = useCallback(async (productIds: number[]) => {
        try {
        setInventoryLoading(true);

        const promises = productIds.map((id) => loadInventory(id));
        const results = await Promise.allSettled(promises);

        const successfulLoads = results.filter(
            (result) => result.status === 'fulfilled'
        ).length;

        if (process.env.NODE_ENV === 'development') {
            console.log(
            `✅ Cargado inventario para ${successfulLoads}/${productIds.length} productos`
            );
        }
        } catch (error) {
        console.error('Error cargando inventario múltiple:', error);
        } finally {
        setInventoryLoading(false);
        }
    }, [loadInventory, setInventoryLoading]);

    /**
     * Verificar si un producto tiene stock suficiente
     */
    const hasSufficientStock = useCallback(
        (id: number, requiredQuantity: number): boolean => {
        const productInventory = inventory[id];
        return (
            productInventory?.productExists &&
            productInventory.quantity >= requiredQuantity
        );
        },
        [inventory]
    );

    /**
     * Obtener nivel de stock
     */
    const getStockLevel = useCallback(
        (id: number): 'out' | 'low' | 'medium' | 'high' => {
        const productInventory = inventory[id];

        if (!productInventory?.productExists) {
            return 'out';
        }

        const quantity = productInventory.quantity;

        if (quantity === 0) return 'out';
        if (quantity <= 5) return 'low';
        if (quantity <= 10) return 'medium';
        return 'high';
        },
        [inventory]
    );

    /**
     * Reiniciar inventario (para testing o reset)
     */
    const resetInventory = useCallback(
        async (id: number, newQuantity: number = 0) => {
        try {
            setLocalLoading(true);

            const currentQuantity = inventory[id]?.quantity || 0;
            const change = newQuantity - currentQuantity;

            if (change !== 0) {
            await updateStock(id, change);
            }

            toast.success('Inventario reiniciado');
        } catch (error: unknown) {
            const err = error as ApiError;
            const errorMessage =
            err.response?.data?.errors?.[0]?.detail || 'Error al reiniciar inventario';
            toast.error(errorMessage);
            throw err;
        } finally {
            setLocalLoading(false);
        }
        },
        [inventory, updateStock]
    );

    /**
     * Limpiar errores
     */
    const clearErrors = useCallback(() => {
        setInventoryError(null);
    }, [setInventoryError]);

    // Cargar inventario automáticamente si se proporciona productId
    useEffect(() => {
        if (productId && !inventory[productId]) {
        loadInventory(productId);
        }
    }, [productId, inventory, loadInventory]);

    return {
        // Estado
        inventory: productId ? inventory[productId] : undefined,
        allInventory: inventory,
        loading: inventoryLoading || localLoading,
        error: inventoryError,

        // Acciones
        loadInventory,
        updateStock,
        loadMultipleInventory,
        resetInventory,
        clearErrors,

        // Utilidades
        hasSufficientStock,
        getStockLevel,
        stockLevel: productId ? getStockLevel(productId) : undefined,
        isOutOfStock: productId ? getStockLevel(productId) === 'out' : false,
        isLowStock: productId ? getStockLevel(productId) === 'low' : false
    };
};