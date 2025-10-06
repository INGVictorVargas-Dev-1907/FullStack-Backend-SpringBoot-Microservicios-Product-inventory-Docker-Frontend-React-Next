import { inventoryService, productsService } from '@/services/api';
import { useAppStore } from '@/store/appStore';
import { Inventory, Product } from '@/types';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { ErrorMessage } from '../ui/ErrorMessage';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Pagination } from '../ui/Pagination';
import { SkeletonLoader } from '../ui/SkeletonLoader';
import { ProductCard } from './ProductCard';

export interface ProductListProps {
    onViewDetails: (product: Product) => void;
    onUpdateStock: (productId: number, change: number) => Promise<void>;
}

/** Tipo seguro para errores de API */
type ApiError = {
    response?: {
        data?: {
        errors?: { detail?: string }[];
        };
        status?: number;
    };
};

export const ProductList: React.FC<ProductListProps> = ({
    onViewDetails,
    onUpdateStock,
}) => {
    const {
        products,
        inventory,
        productsLoading,
        productsError,
        inventoryLoading,
        pagination,
        currentPage,
        setProducts,
        setProductsLoading,
        setProductsError,
        setInventory,
        setInventoryLoading,
        setPagination,
        setCurrentPage,
    } = useAppStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [localLoading, setLocalLoading] = useState(false);

    // Cargar productos
    const loadProducts = async (page: number = 0) => {
        try {
        setProductsLoading(true);
        setProductsError(null);

        const response = await productsService.getProducts(page);

        const productsData: Product[] = response.data.map(item => {
            const { id: _ignoredId, ...attrs } = item.attributes;
            return {
            id: parseInt(item.id),
            ...attrs,
            };
        });

        setProducts(productsData);
        setPagination(response.meta);
        setCurrentPage(page);

        // Cargar inventario
        await loadInventoryForProducts(productsData);
        } catch (error: unknown) {
        const err = error as ApiError;
        const errorMessage = err.response?.data?.errors?.[0]?.detail || 'Error al cargar productos';
        setProductsError(errorMessage);
        toast.error(errorMessage);
        } finally {
        setProductsLoading(false);
        }
    };

    // Cargar inventario para productos
    const loadInventoryForProducts = async (products: Product[]) => {
        try {
        setInventoryLoading(true);

        const inventoryPromises = products.map(product =>
            inventoryService
            .getStock(product.id)
            .then(response => {
                const { productId: _ignoredProductId, ...attrs } = response.data.attributes;
                return {
                productId: product.id,
                inventory: {
                    productId: parseInt(response.data.id),
                    ...attrs,
                } as Inventory,
                };
            })
            .catch(err => {
                console.error(`Error loading inventory for product ${product.id}:`, err);
                return null;
            })
        );

        const inventoryResults = await Promise.all(inventoryPromises);

        inventoryResults.forEach(result => {
            if (result) {
            setInventory(result.productId, result.inventory);
            }
        });
        } catch (error: unknown) {
        console.error('Error loading inventory:', error);
        toast.error('Error al cargar información de inventario');
        } finally {
        setInventoryLoading(false);
        }
    };

    const handleLocalUpdateStock = async (productId: number, change: number) => {
        try {
        setLocalLoading(true);
        await onUpdateStock(productId, change);
        } finally {
        setLocalLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        toast('Búsqueda realizada', { icon: 'ℹ️' });
    };

    const filteredProducts = searchTerm
        ? products.filter(
            product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : products;

    useEffect(() => {
        if (products.length === 0) loadProducts();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (productsLoading && products.length === 0) return <SkeletonLoader />;

    if (productsError && products.length === 0) {
        return (
        <ErrorMessage
            title="Error al cargar productos"
            message={productsError}
            onRetry={() => loadProducts()}
            className="my-8"
        />
        );
    }

    return (
        <div className="space-y-6">
        {/* Header con búsqueda */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
            <h2 className="text-2xl font-bold text-gray-900">Productos</h2>
            <p className="text-sm text-gray-500 mt-1">{pagination?.totalElements || 0} productos en total</p>
            </div>
            <form onSubmit={handleSearch} className="w-full sm:w-64">
            <div className="relative">
                <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            </form>
        </div>

        {searchTerm && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
                Mostrando {filteredProducts.length} de {products.length} productos
                {searchTerm && ` para "${searchTerm}"`}
            </p>
            </div>
        )}

        {filteredProducts.length === 0 && !productsLoading ? (
            <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron productos</p>
            {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="mt-2 text-blue-600 hover:text-blue-800">
                Limpiar búsqueda
                </button>
            )}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
                <ProductCard
                key={product.id}
                product={product}
                inventory={inventory[product.id]}
                onUpdateStock={handleLocalUpdateStock}
                onViewDetails={onViewDetails}
                loading={localLoading || inventoryLoading}
                />
            ))}
            </div>
        )}

        {pagination && pagination.totalPages > 1 && !searchTerm && (
            <Pagination currentPage={currentPage} totalPages={pagination.totalPages} onPageChange={loadProducts} className="mt-8" />
        )}

        {(localLoading || inventoryLoading) && (
            <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <LoadingSpinner size="sm" text="Actualizando..." />
            </div>
        )}
        </div>
    );
};

export default ProductList;