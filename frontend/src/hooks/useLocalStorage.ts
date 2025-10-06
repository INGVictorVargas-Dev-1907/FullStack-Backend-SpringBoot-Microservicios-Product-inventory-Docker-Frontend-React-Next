import { Product } from '@/types';
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para manejo de localStorage con TypeScript
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
) => {
  // Estado para almacenar nuestro valor
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);

  // Leer localStorage al inicializar
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
    } finally {
      setIsLoaded(true);
    }
  }, [key]);

  // Función para actualizar localStorage y estado
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Permitir función como setState de React
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remover item de localStorage
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Limpiar todo localStorage (cuidado con esto)
  const clearAll = useCallback(() => {
    try {
      window.localStorage.clear();
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }, [initialValue]);

  return {
    value: storedValue,
    setValue,
    removeValue,
    clearAll,
    isLoaded
  };
};

/**
 * Hook específico para preferencias de usuario
 */
export const useUserPreferences = () => {
    const pageSize = useLocalStorage('user-page-size', 10);
    const theme = useLocalStorage('user-theme', 'light');
    const language = useLocalStorage('user-language', 'es');

    return {
        pageSize,
        theme,
        language
    };
};

/**
 * Hook para carrito de compras en localStorage
 */
export const useCart = () => {
    const { value: cart, setValue: setCart } = useLocalStorage<Array<{
        productId: number;
        quantity: number;
        product?: Product;
    }>>('shopping-cart', []);

    const addToCart = useCallback((productId: number, quantity: number = 1, product?: Product) => {
        setCart(prev => {
        const existingItem = prev.find(item => item.productId === productId);
        
        if (existingItem) {
            return prev.map(item =>
            item.productId === productId
                ? { ...item, quantity: item.quantity + quantity, product }
                : item
            );
        }
        
        return [...prev, { productId, quantity, product }];
        });
    }, [setCart]);

    const removeFromCart = useCallback((productId: number) => {
        setCart(prev => prev.filter(item => item.productId !== productId));
    }, [setCart]);

    const updateQuantity = useCallback((productId: number, quantity: number) => {
        if (quantity <= 0) {
        removeFromCart(productId);
        return;
        }

        setCart(prev =>
        prev.map(item =>
            item.productId === productId ? { ...item, quantity } : item
        )
        );
    }, [setCart, removeFromCart]);

    const clearCart = useCallback(() => {
        setCart([]);
    }, [setCart]);

    const getTotalItems = useCallback(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);

    const getTotalPrice = useCallback(() => {
        return cart.reduce((total, item) => {
        const price = item.product?.price || 0;
        return total + (price * item.quantity);
        }, 0);
    }, [cart]);

    return {
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        totalItems: getTotalItems(),
        totalPrice: getTotalPrice(),
        isEmpty: cart.length === 0
    };
};