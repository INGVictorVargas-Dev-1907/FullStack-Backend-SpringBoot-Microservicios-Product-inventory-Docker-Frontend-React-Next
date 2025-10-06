import { Product, ProductFormData } from '@/types';
import { validateProduct } from '@/utils/helpers';
import React from 'react';
import { useForm } from 'react-hook-form';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface ProductFormProps {
    product?: Product;
    onSubmit: (data: ProductFormData) => void;
    onCancel: () => void;
    loading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
    product,
    onSubmit,
    onCancel,
    loading = false
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        watch
    } = useForm<ProductFormData>({
        defaultValues: product ? {
        name: product.name,
        description: product.description,
        price: product.price,
        sku: product.sku
        } : undefined
    });

    const handleFormSubmit = (data: ProductFormData) => {
        const validationErrors = validateProduct(data);
        
        if (validationErrors.length > 0) {
        validationErrors.forEach(error => {
            // Asignar errores a campos específicos
            if (error.includes('nombre')) {
            setError('name', { message: error });
            } else if (error.includes('descripción')) {
            setError('description', { message: error });
            } else if (error.includes('precio')) {
            setError('price', { message: error });
            } else if (error.includes('SKU')) {
            setError('sku', { message: error });
            }
        });
        return;
        }

        onSubmit(data);
    };

    const price = watch('price');

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Nombre */}
        <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Producto *
            </label>
            <input
            type="text"
            id="name"
            {...register('name', { 
                required: 'El nombre es requerido',
                minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ingrese el nombre del producto"
            />
            {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
        </div>

        {/* Descripción */}
        <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción *
            </label>
            <textarea
            id="description"
            rows={4}
            {...register('description', { 
                required: 'La descripción es requerida',
                minLength: { value: 10, message: 'La descripción debe tener al menos 10 caracteres' }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describa el producto..."
            />
            {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
        </div>

        {/* Precio y SKU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Precio */}
            <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Precio *
            </label>
            <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                type="number"
                id="price"
                step="0.01"
                min="0"
                {...register('price', { 
                    required: 'El precio es requerido',
                    min: { value: 0, message: 'El precio debe ser mayor o igual a 0' },
                    valueAsNumber: true
                })}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                />
            </div>
            {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
            {price !== undefined && !errors.price && (
                <p className="mt-1 text-sm text-gray-500">
                    Precio ingresado: ${price.toFixed(2)}
                </p>
            )}
            </div>

            {/* SKU */}
            <div>
            <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                SKU *
            </label>
            <input
                type="text"
                id="sku"
                {...register('sku', { 
                required: 'El SKU es requerido'
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Código único del producto"
            />
            {errors.sku && (
                <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
            )}
            </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-4">
            <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
            Cancelar
            </button>
            <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
            >
            {loading && (
                <LoadingSpinner size="sm" className="mr-2" />
            )}
            {product ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
        </div>
        </form>
    );
};