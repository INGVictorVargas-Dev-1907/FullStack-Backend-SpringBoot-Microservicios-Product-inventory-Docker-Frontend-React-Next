import { Inventory, Product } from '@/types';
import { formatCurrency, formatStockLevel } from '@/utils/helpers';
import { EyeIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface ProductCardProps {
    product: Product;
    inventory?: Inventory;
    onUpdateStock: (productId: number, change: number) => void;
    onViewDetails: (product: Product) => void;
    loading?: boolean;
    className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
    product,
    inventory,
    onUpdateStock,
    onViewDetails,
    loading = false,
    className = ''
}) => {
    const stock = inventory?.quantity || 0;
    const productExists = inventory?.productExists !== false;
    const stockInfo = formatStockLevel(stock);

    return (
        <div className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 ${className}`}>
        {/* Header con nombre y SKU */}
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 mr-2">
            {product.name}
            </h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded flex-shrink-0">
            {product.sku}
            </span>
        </div>
        
        {/* Descripción */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
            {product.description}
        </p>
        
        {/* Precio y Stock */}
        <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-blue-600">
            {formatCurrency(product.price)}
            </span>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${stockInfo.bgColor} ${stockInfo.color}`}>
            {productExists ? `${stock} en stock` : 'No disponible'}
            </div>
        </div>

        {/* Acciones */}
        <div className="flex space-x-2">
            <button
            onClick={() => onViewDetails(product)}
            className="flex-1 bg-gray-500 text-white py-2 px-3 rounded text-sm hover:bg-gray-600 transition-colors flex items-center justify-center"
            >
            <EyeIcon className="w-4 h-4 mr-2" />
            Ver
            </button>
            
            {productExists && (
            <div className="flex space-x-1">
                <button
                onClick={() => onUpdateStock(product.id, -1)}
                disabled={loading || stock <= 0}
                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                title="Disminuir stock"
                >
                <MinusIcon className="w-4 h-4" />
                </button>
                <button
                onClick={() => onUpdateStock(product.id, 1)}
                disabled={loading}
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                title="Aumentar stock"
                >
                <PlusIcon className="w-4 h-4" />
                </button>
            </div>
            )}
        </div>
        </div>
    );
};