import { productsService } from '@/services/api';
import { useAppStore } from '@/store/appStore';
import { Product, ProductsResponse } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

/** Tipo seguro para errores de API */
type ApiError = {
    response?: {
        data?: {
        errors?: { detail?: string }[];
        };
        status?: number;
    };
};

/**
 * Hook para gestión de productos
 */
export const useProducts = () => {
    const {
        products,
        currentProduct,
        productsLoading,
        productsError,
        pagination,
        currentPage,
        setProducts,
        setCurrentProduct,
        setProductsLoading,
        setProductsError,
        setPagination,
        setCurrentPage,
        updateProductInList,
        removeProductFromList
    } = useAppStore();

    const [localLoading, setLocalLoading] = useState(false);

    /** Cargar productos con paginación */
    const loadProducts = useCallback(
        async (page: number = 0, size: number = 10) => {
        try {
            setProductsLoading(true);
            setProductsError(null);

            const response: ProductsResponse = await productsService.getProducts(page, size);

            const productsData: Product[] = response.data.map(({ id, attributes }) => ({
            ...attributes,
            id: Number(id)
            }));

            setProducts(productsData);
            setPagination(response.meta);
            setCurrentPage(page);

            return response;
        } catch (error: unknown) {
            const err = error as ApiError;
            const errorMessage =
            err.response?.data?.errors?.[0]?.detail || 'Error al cargar productos';
            setProductsError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setProductsLoading(false);
        }
        },
        [setProducts, setProductsLoading, setProductsError, setPagination, setCurrentPage]
    );

    /** Cargar producto por ID */
    const loadProductById = useCallback(
        async (id: number) => {
        try {
            setProductsLoading(true);

            const response: ProductsResponse = await productsService.getProductById(id);
            const { id: productId, attributes } = response.data[0]; // response.data es un array
            const productData: Product = {
            ...attributes,
            id: Number(productId)
            };

            setCurrentProduct(productData);
            return productData;
        } catch (error: unknown) {
            const err = error as ApiError;
            const errorMessage =
            err.response?.data?.errors?.[0]?.detail || 'Error al cargar el producto';
            setProductsError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setProductsLoading(false);
        }
        },
        [setCurrentProduct, setProductsLoading, setProductsError]
    );

    /** Crear nuevo producto */
    const createProduct = useCallback(
        async (productData: Omit<Product, 'id'>) => {
        try {
            setLocalLoading(true);

            const response: ProductsResponse = await productsService.createProduct(productData);
            const { id: newId, attributes } = response.data[0]; // response.data es un array
            const newProduct: Product = {
            ...attributes,
            id: Number(newId)
            };

            setProducts([newProduct, ...products]);
            toast.success('Producto creado correctamente');

            return newProduct;
        } catch (error: unknown) {
            const err = error as ApiError;
            const errorMessage =
            err.response?.data?.errors?.[0]?.detail || 'Error al crear producto';
            toast.error(errorMessage);
            throw err;
        } finally {
            setLocalLoading(false);
        }
        },
        [products, setProducts]
    );

    /** Actualizar producto existente */
    const updateProduct = useCallback(
        async (id: number, productData: Partial<Product>) => {
        try {
            setLocalLoading(true);

            const response: ProductsResponse = await productsService.updateProduct(id, productData);
            const { id: updatedId, attributes } = response.data[0]; // response.data es un array
            const updatedProduct: Product = {
            ...attributes,
            id: Number(updatedId)
            };

            updateProductInList(updatedProduct);

            if (currentProduct?.id === id) {
            setCurrentProduct(updatedProduct);
            }

            toast.success('Producto actualizado correctamente');
            return updatedProduct;
        } catch (error: unknown) {
            const err = error as ApiError;
            const errorMessage =
            err.response?.data?.errors?.[0]?.detail || 'Error al actualizar producto';
            toast.error(errorMessage);
            throw err;
        } finally {
            setLocalLoading(false);
        }
        },
        [currentProduct, updateProductInList, setCurrentProduct]
    );

    /** Eliminar producto */
    const deleteProduct = useCallback(
        async (id: number) => {
        try {
            setLocalLoading(true);

            await productsService.deleteProduct(id);
            removeProductFromList(id);

            if (currentProduct?.id === id) {
            setCurrentProduct(null);
            }

            toast.success('Producto eliminado correctamente');
        } catch (error: unknown) {
            const err = error as ApiError;
            const errorMessage =
            err.response?.data?.errors?.[0]?.detail || 'Error al eliminar producto';
            toast.error(errorMessage);
            throw err;
        } finally {
            setLocalLoading(false);
        }
        },
        [currentProduct, removeProductFromList, setCurrentProduct]
    );

    /** Buscar productos por término */
    const searchProducts = useCallback(
        async (searchTerm: string, page: number = 0) => {
        if (!searchTerm.trim()) return loadProducts(page);

        try {
            setProductsLoading(true);

            const response: ProductsResponse = await productsService.getProducts(page);
            const filteredProducts: Product[] = response.data
            .map(({ id, attributes }) => ({
                ...attributes,
                id: Number(id)
            }))
            .filter(
                (product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchTerm.toLowerCase())
            );

            setProducts(filteredProducts);
            setPagination({
            ...response.meta,
            totalElements: filteredProducts.length,
            totalPages: Math.ceil(filteredProducts.length / 10)
            });
        } catch (error: unknown) {
            const err = error as ApiError;
            const errorMessage =
            err.response?.data?.errors?.[0]?.detail || 'Error al buscar productos';
            setProductsError(errorMessage);
            toast.error(errorMessage);
            throw err;
        } finally {
            setProductsLoading(false);
        }
        },
        [loadProducts, setProducts, setProductsLoading, setProductsError, setPagination]
    );

    /** Limpiar errores */
    const clearErrors = useCallback(() => setProductsError(null), [setProductsError]);

    /** Limpiar producto actual */
    const clearCurrentProduct = useCallback(() => setCurrentProduct(null), [setCurrentProduct]);

    /** Cargar productos al inicializar */
    useEffect(() => {
        if (products.length === 0) {
        loadProducts();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return {
        // Estado
        products,
        currentProduct,
        loading: productsLoading || localLoading,
        error: productsError,
        pagination,
        currentPage,

        // Acciones
        loadProducts,
        loadProductById,
        createProduct,
        updateProduct,
        deleteProduct,
        searchProducts,
        clearErrors,
        clearCurrentProduct,

        // Utilidades
        hasProducts: products.length > 0,
        totalProducts: pagination?.totalElements || 0
    };
};