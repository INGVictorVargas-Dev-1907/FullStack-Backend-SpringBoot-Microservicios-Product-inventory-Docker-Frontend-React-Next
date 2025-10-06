import { Product } from '@/types';

/**
 * Función para formatear el precio de un producto en formato de moneda
 * @param amount Precio del producto a formatear
 * @returns Precio formateado en formato de moneda
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

/**
 * Función para formatear el nivel de stock de un producto
 * @param quantity Cantidad de productos en stock
 * @returns Objeto con el texto, color y fondo del nivel de stock
 */
export const formatStockLevel = (quantity: number): {
    text: string;
    color: string;
    bgColor: string;
} => {
    if (quantity === 0) {
        return {
        text: 'Sin stock',
        color: 'text-error-600',
        bgColor: 'bg-error-100',
        };
    }
    
    if (quantity <= 5) {
        return {
        text: 'Stock bajo',
        color: 'text-warning-600',
        bgColor: 'bg-warning-100',
        };
    }
    
    if (quantity <= 10) {
        return {
        text: 'Stock medio',
        color: 'text-primary-600',
        bgColor: 'bg-primary-100',
        };
    }
    
    return {
        text: 'En stock',
        color: 'text-success-600',
        bgColor: 'bg-success-100',
    };
};

/**
 * Función para aplicar un debounce a una función asíncrona para evitar llamadas innecesarias al servidor
 *
 * @param func - Función asíncrona a la cual se le va a aplicar el debounce
 * @param delay - Tiempo de espera en milisegundos
 * @returns Función con el debounce aplicado a la función original
 */
export const debounce = <T extends (...args: unknown[]) => void>(
    func: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

/**
 * Función para validar un producto en base a sus propiedades
 * @param product Producto a validar
 * @returns Arreglo de errores en caso de que el producto no sea valido
 */
export const validateProduct = (product: Partial<Product>): string[] => {
    const errors: string[] = [];
    
    if (!product.name || product.name.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!product.description || product.description.trim().length < 10) {
        errors.push('La descripción debe tener al menos 10 caracteres');
    }
    
    if (!product.price || product.price <= 0) {
        errors.push('El precio debe ser mayor a 0');
    }
    
    if (!product.sku || product.sku.trim().length === 0) {
        errors.push('El SKU es requerido');
    }
    
    return errors;
};