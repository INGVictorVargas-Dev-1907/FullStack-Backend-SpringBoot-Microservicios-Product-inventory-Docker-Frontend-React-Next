'use client';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { ProductForm } from '@/components/products/ProductForm';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const productId = parseInt(params.id as string);

    const { currentProduct, loadProductById, updateProduct, loading: productsLoading, error: productsError } = useProducts();

    // Cargar producto al montar el componente
    useEffect(() => {
        if (productId) {
        loadProductById(productId);
        }
    }, [productId, loadProductById]);

    // Manejar volver atrás
    const handleBack = () => {
        router.back();
    };

    // Manejar enviar formulario
    const handleSubmit = async (productData: Partial<Product>) => {
        try {
        await updateProduct(productId, productData);
        toast.success('Producto actualizado correctamente');
        router.push(`/products/${productId}`);
        } catch (error) {
        // El error ya se maneja en el hook
        }
    };

    // Manejar cancelar
    const handleCancel = () => {
        router.back();
    };

    if (productsLoading && !currentProduct) {
        return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex items-center justify-center">
            <LoadingSpinner size="lg" text="Cargando producto..." />
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

    return (
        <div className="min-h-screen flex flex-col">
        {/* Header */}
        <Header />
        
        {/* Main Content */}
        <main className="flex-1">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <div className="mb-6">
                <button
                onClick={handleBack}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Volver al producto
                </button>
                
                <h1 className="text-3xl font-bold text-gray-900">Editar Producto</h1>
                <p className="text-gray-600 mt-2">
                Actualiza la información del producto
                </p>
            </div>

            {/* Formulario */}
            <div className="card p-6">
                <ProductForm
                product={currentProduct}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                loading={productsLoading}
                />
            </div>
            </div>
        </main>

        {/* Footer */}
        <Footer />
        </div>
    );
}