import { useInventory } from '@/hooks/useInventory';
import { Inventory, Product } from '@/types';
import { formatCurrency, formatStockLevel } from '@/utils/helpers';
import { MinusIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ProductDetailProps {
    product: Product;
    inventory?: Inventory;
    isOpen: boolean;
    onClose: () => void;
    onUpdateStock: (productId: number, change: number) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
    product,
    inventory,
    isOpen,
    onClose,
    onUpdateStock
}) => {
    const { loading: inventoryLoading } = useInventory(product.id);
    
    if (!isOpen) return null;

    const stock = inventory?.quantity || 0;
    const productExists = inventory?.productExists !== false;
    const stockInfo = formatStockLevel(stock);

    const handleBackgroundClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
        onClose();
        }
    };

    const handleStockUpdate = (change: number) => {
        onUpdateStock(product.id, change);
    };

    return (
        <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={handleBackgroundClick}
        >
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b border-gray-200">
            <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                <p className="text-gray-500 mt-1">SKU: {product.sku}</p>
            </div>
            <button
                aria-label='Cerrar'
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl p-1 hover:bg-gray-100 rounded"
            >
                <XMarkIcon className="w-6 h-6" />
            </button>
            </div>

            {/* Contenido */}
            <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Información del producto */}
                <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    Información del Producto
                </h3>
                
                <div className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Descripción
                    </label>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {product.description}
                    </p>
                    </div>
                    
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Precio
                    </label>
                    <p className="text-3xl font-bold text-blue-600">
                        {formatCurrency(product.price)}
                    </p>
                    </div>
                    
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estado
                    </label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stockInfo.bgColor} ${stockInfo.color}`}>
                        {productExists ? stockInfo.text : 'Producto no disponible'}
                    </span>
                    </div>
                </div>
                </div>

                {/* Gestión de inventario */}
                <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    Gestión de Inventario
                </h3>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                        {stock}
                    </div>
                    <span className="text-sm text-gray-600">Unidades en stock</span>
                    </div>

                    {productExists ? (
                    <div className="space-y-3">
                        <div className="flex space-x-2">
                        <button
                            onClick={() => handleStockUpdate(-5)}
                            disabled={inventoryLoading || stock < 5}
                            className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            <MinusIcon className="w-4 h-4 mr-2" />
                            -5 Unidades
                        </button>
                        <button
                            onClick={() => handleStockUpdate(5)}
                            disabled={inventoryLoading}
                            className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                        >
                            <PlusIcon className="w-4 h-4 mr-2" />
                            +5 Unidades
                        </button>
                        </div>
                        
                        <div className="flex space-x-2">
                        <button
                            onClick={() => handleStockUpdate(-1)}
                            disabled={inventoryLoading || stock < 1}
                            className="flex-1 bg-red-400 text-white py-2 px-4 rounded hover:bg-red-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            -1
                        </button>
                        <button
                            onClick={() => handleStockUpdate(1)}
                            disabled={inventoryLoading}
                            className="flex-1 bg-green-400 text-white py-2 px-4 rounded hover:bg-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        >
                            +1
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
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
                Cerrar
            </button>
            </div>
        </div>
        </div>
    );
};