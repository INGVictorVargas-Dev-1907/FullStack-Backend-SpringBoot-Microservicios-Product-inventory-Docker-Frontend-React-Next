import { Inventory, Product } from '@/types';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

/**
 * Estado para operaciones API
 */
export interface ApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

/**
 * Configuración para operaciones API
 */
export interface ApiConfig {
    showToast?: boolean;
    successMessage?: string;
    errorMessage?: string;
}

/**
 * Hook genérico para operaciones API
 */
export const useApi = <T>() => {
    const [state, setState] = useState<ApiState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    /**
     * Ejecutar operación API
     */
    const execute = useCallback(
        async (
            operation: () => Promise<T>,
            config: ApiConfig = {}
        ): Promise<T | null> => {
            const { showToast = true, successMessage, errorMessage } = config;

            try {
            setState((prev) => ({ ...prev, loading: true, error: null }));

            const result = await operation();

            setState({
                data: result,
                loading: false,
                error: null,
            });

            if (showToast && successMessage) {
                toast.success(successMessage);
            }

            return result;
            } catch (error: unknown) {
                let message = errorMessage || 'Error en la operación';

                // Refinar el tipo del error
                if (error instanceof Error) {
                    message = error.message;
                } else if (
                    typeof error === 'object' &&
                    error !== null &&
                    'response' in error
                ) {
                    // Definir tipo local sin usar "any"
                    const axiosError = error as {
                    response?: {
                        data?: {
                        errors?: Array<{ detail?: string }>;
                        };
                    };
                    };

                    const apiDetail = axiosError.response?.data?.errors?.[0]?.detail;
                    if (apiDetail) {
                    message = apiDetail;
                    }
                }

                setState((prev) => ({
                    ...prev,
                    loading: false,
                    error: message,
                }));

                if (showToast) {
                    toast.error(message);
                }

                return null;
            }
        },
        []
    );

    /**
     * Resetear estado
     */
    const reset = useCallback(() => {
        setState({
        data: null,
        loading: false,
        error: null,
        });
    }, []);

    /**
     * Setear data manualmente
     */
    const setData = useCallback((data: T | null) => {
        setState((prev) => ({ ...prev, data }));
    }, []);

    /**
     * Setear error manualmente
     */
    const setError = useCallback((error: string | null) => {
        setState((prev) => ({ ...prev, error }));
    }, []);

    return {
        ...state,
        execute,
        reset,
        setData,
        setError,
        hasData: state.data !== null,
        hasError: state.error !== null,
        isIdle: !state.loading && state.data === null && state.error === null,
    };
};

/**
 * Hook específico para operaciones de productos
 */
export const useProductApi = () => {
    const api = useApi<Product>();

    const createProduct = useCallback(
        async (productData: Product) => {
        return api.execute(
            async () => {
            // Aquí irá la llamada real al servicio (por ahora lanzamos un error simulado)
            throw new Error('Not implemented');
            },
            {
            successMessage: 'Producto creado correctamente',
            errorMessage: 'Error al crear producto',
            }
        );
        },
        [api]
    );

    return {
        ...api,
        createProduct,
    };
};

/**
 * Hook específico para operaciones de inventario
 */
export const useInventoryApi = () => {
    const api = useApi<Inventory>();

    const updateStock = useCallback(
        async (productId: number, change: number) => {
        return api.execute(
            async () => {
            // Implementación real pendiente
            throw new Error('Not implemented');
            },
            {
            successMessage: 'Stock actualizado correctamente',
            errorMessage: 'Error al actualizar stock',
            }
        );
        },
        [api]
    );

    return {
        ...api,
        updateStock,
    };
};

export default useApi;