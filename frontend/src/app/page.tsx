'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductList } from '@/components/products/ProductList';
import { ProductDetail } from '@/components/products/ProductDetail';
import { ProductForm } from '@/components/products/ProductForm';
import { useProducts } from '@/hooks/useProducts';
import { useInventory } from '@/hooks/useInventory';
import { Product, ProductFormData } from '@/types';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { products, createProduct, updateProduct, loading: productsLoading } = useProducts();
  const { updateStock, loading: inventoryLoading } = useInventory();

  // Manejar ver detalles del producto
  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  // Manejar cerrar detalles
  const handleCloseDetail = () => {
    setShowProductDetail(false);
    setSelectedProduct(null);
  };

  // Manejar abrir formulario para nuevo producto
  const handleNewProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  // Manejar editar producto
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  // Manejar cerrar formulario
  const handleCloseForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
  };

  // Manejar enviar formulario
  const handleSubmitProduct = async (productData: ProductFormData) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        toast.success('Producto actualizado correctamente');
      } else {
        await createProduct(productData);
        toast.success('Producto creado correctamente');
      }
      handleCloseForm();
    } catch (error) {
      // El error ya se maneja en el hook
    }
  };

  // Manejar actualización de stock
  const handleUpdateStock = async (productId: number, change: number) => {
    try {
      await updateStock(productId, change);
    } catch (error) {
      // El error ya se maneja en el hook
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header title="Inventory Manager" />
      
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header with Actions */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
                <p className="text-gray-600 mt-2">
                  Administra tu inventario y stock de productos
                </p>
              </div>
              
              <button
                onClick={handleNewProduct}
                disabled={productsLoading}
                className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Nuevo Producto</span>
              </button>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Productos</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">S</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">En Stock</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {products.filter(p => p.id).length} {/* Placeholder */}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">B</span>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Stock Bajo</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product List */}
          <ProductList 
            onViewDetails={handleViewDetails}
            onUpdateStock={handleUpdateStock}
          />
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          isOpen={showProductDetail}
          onClose={handleCloseDetail}
          onUpdateStock={handleUpdateStock}
        />
      )}

      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              
              <ProductForm
                product={editingProduct || undefined}
                onSubmit={handleSubmitProduct}
                onCancel={handleCloseForm}
                loading={productsLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {(productsLoading || inventoryLoading) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex flex-col items-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-2"></div>
            <p className="text-gray-600">Procesando...</p>
          </div>
        </div>
      )}
    </div>
  );
}