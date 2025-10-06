'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { ProductDetailSkeleton } from '@/components/ui/SkeletonLoader';
import { useProducts } from '@/hooks/useProducts';
import { useInventory } from '@/hooks/useInventory';
import { formatCurrency, formatStockLevel } from '@/utils/helpers';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = parseInt(params.id as string);

    const {
        currentProduct,
        loadProductById,
        deleteProduct,
        loading: productsLoading,
        error: productsError,
    } = useProducts();

    const { inventory, updateStock, loading: inventoryLoading } = useInventory(productId);

    const [localLoading, setLocalLoading] = useState(false);

    // Cargar producto al montar el componente
    useEffect(() => {
        if (productId) loadProductById(productId);
    }, [productId, loadProductById]);

    // Volver atrás
    const handleBack = () => {
        router.back();
    };

    // Editar producto
    const handleEdit = () => {
        router.push(`/products/${productId}/edit`);
    };

    // Eliminar producto
    const handleDelete = async () => {
        if (!currentProduct || !window.confirm('¿Estás seguro de que quieres eliminar este producto?')) return;

        try {
            setLocalLoading(true);
            await deleteProduct(currentProduct.id);
            toast.success('Producto eliminado correctamente');
            router.push('/');
        } catch {
            // Error manejado en el hook
        } finally {
            setLocalLoading(false);
        }
    };

    // Actualizar stock
    const handleUpdateStock = async (change: number) => {
        if (!currentProduct) return;
        try {
            await updateStock(currentProduct.id, change);
        } catch {
            // Error manejado en el hook
        }
    };

    if (productsLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <ProductDetailSkeleton />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (productsError || !currentProduct) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <ErrorMessage
                            title="Error al cargar producto"
                            message={productsError || 'Producto no encontrado'}
                            onRetry={() => loadProductById(productId)}
                        />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const stock = inventory?.quantity || 0;
    const productExists = inventory?.productExists !== false;
    const stockInfo = formatStockLevel(stock);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Breadcrumb y acciones */}
                    <div className="mb-6">
                        <button
                            onClick={handleBack}
                            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                        >
                            <ArrowLeftIcon className="w-5 h-5 mr-2" />
                            Volver a productos
                        </button>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{currentProduct.name}</h1>
                                <p className="text-gray-500 mt-1">SKU: {currentProduct.sku}</p>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={handleEdit}
                                    className="btn-secondary flex items-center space-x-2"
                                >
                                    <PencilIcon className="w-4 h-4" />
                                    <span>Editar</span>
                                </button>

                                <button
                                    onClick={handleDelete}
                                    disabled={localLoading}
                                    className="btn-danger flex items-center space-x-2"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                    <span>Eliminar</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Contenido del producto */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Información del producto */}
                        <div className="card p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Información del Producto</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descripción
                                    </label>
                                    <p className="text-gray-600 leading-relaxed">{currentProduct.description}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Precio
                                    </label>
                                    <p className="text-3xl font-bold text-blue-600">
                                        {formatCurrency(currentProduct.price)}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Estado del Inventario
                                    </label>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${stockInfo.bgColor} ${stockInfo.color}`}>
                                            {productExists ? stockInfo.text : 'No disponible'}
                                        </span>
                                        {productExists && <span className="text-sm text-gray-500">({stock} unidades)</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gestión de inventario */}
                        <div className="card p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Gestión de Inventario</h2>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-center mb-6">
                                    <div className="text-4xl font-bold text-gray-900 mb-2">{stock}</div>
                                    <span className="text-sm text-gray-600">Unidades en stock</span>
                                </div>

                                {productExists ? (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => handleUpdateStock(-5)}
                                                disabled={inventoryLoading || stock < 5}
                                                className="btn-danger flex items-center justify-center space-x-2"
                                            >
                                                <span>-5</span>
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStock(5)}
                                                disabled={inventoryLoading}
                                                className="btn-primary flex items-center justify-center space-x-2"
                                            >
                                                <span>+5</span>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => handleUpdateStock(-1)}
                                                disabled={inventoryLoading || stock < 1}
                                                className="btn-secondary flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white"
                                            >
                                                <span>-1</span>
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStock(1)}
                                                disabled={inventoryLoading}
                                                className="btn-secondary flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white"
                                            >
                                                <span>+1</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500 py-4">
                                        Este producto no está disponible en el inventario
                                    </div>
                                )}

                                {inventoryLoading && (
                                    <div className="mt-4 flex justify-center">
                                        <LoadingSpinner size="sm" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Historial de movimientos */}
                    <div className="card p-6 mt-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Historial de Movimientos</h2>
                        <div className="text-center text-gray-500 py-8">
                            <p>El historial de movimientos estará disponible próximamente</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Loading Overlay */}
            {localLoading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 flex flex-col items-center">
                        <LoadingSpinner size="lg" text="Eliminando producto..." />
                    </div>
                </div>
            )}
        </div>
    );
}