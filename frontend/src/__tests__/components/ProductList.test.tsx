import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductList } from '@/components/products/ProductList';
import { useAppStore } from '@/store/appStore';
import { productsService, inventoryService } from '@/services/api';

// Mocks
jest.mock('@/store/appStore');
jest.mock('@/services/api');
jest.mock('react-hot-toast');

const mockUseAppStore = useAppStore as jest.MockedFunction<typeof useAppStore>;
const mockProductsService = productsService as jest.Mocked<typeof productsService>;
const mockInventoryService = inventoryService as jest.Mocked<typeof inventoryService>;

const mockProducts = [
    { id: 1, name: 'Product 1', description: 'Description 1', price: 100, sku: 'SKU1' },
    { id: 2, name: 'Product 2', description: 'Description 2', price: 200, sku: 'SKU2' },
];

const mockInventory = {
    1: { productId: 1, quantity: 5, productExists: true },
    2: { productId: 2, quantity: 0, productExists: true },
};

describe('ProductList', () => {
    const onViewDetails = jest.fn();
    const onUpdateStock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        mockUseAppStore.mockReturnValue({
        products: mockProducts,
        inventory: mockInventory,
        productsLoading: false,
        productsError: null,
        inventoryLoading: false,
        pagination: {
            totalElements: 2,
            totalPages: 1,
            pageNumber: 0,
            pageSize: 10,
        },
        currentPage: 0,
        setProducts: jest.fn(),
        setProductsLoading: jest.fn(),
        setProductsError: jest.fn(),
        setInventory: jest.fn(),
        setInventoryLoading: jest.fn(),
        setPagination: jest.fn(),
        setCurrentPage: jest.fn(),
        });

        mockProductsService.getProducts.mockResolvedValue({
        data: mockProducts.map(product => ({
            id: product.id.toString(),
            type: 'products',
            attributes: product,
        })),
        meta: {
            totalElements: 2,
            totalPages: 1,
            pageNumber: 0,
            pageSize: 10,
        },
        });

        mockInventoryService.getStock.mockImplementation((productId: number) =>
        Promise.resolve({
            data: {
            id: productId.toString(),
            type: 'inventory',
            attributes: mockInventory[productId as keyof typeof mockInventory],
            },
        })
        );

        mockInventoryService.updateStock.mockResolvedValue({
        data: {
            id: '1',
            type: 'inventory',
            attributes: { productId: 1, quantity: 6, productExists: true },
        },
        });
    });

    it('renders product list correctly', async () => {
        render(<ProductList onViewDetails={onViewDetails} onUpdateStock={onUpdateStock} />);

        await waitFor(() => {
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
        expect(screen.getByText('2 productos en total')).toBeInTheDocument();
        });
    });

    it('shows loading state', () => {
        mockUseAppStore.mockReturnValue({
        ...mockUseAppStore(),
        productsLoading: true,
        products: [],
        });

        render(<ProductList onViewDetails={onViewDetails} onUpdateStock={onUpdateStock} />);

        // Aquí puedes agregar tus assertions para skeleton loaders
    });

    it('shows error state', () => {
        mockUseAppStore.mockReturnValue({
        ...mockUseAppStore(),
        productsError: 'Failed to load products',
        products: [],
        });

        render(<ProductList onViewDetails={onViewDetails} onUpdateStock={onUpdateStock} />);

        expect(screen.getByText('Error al cargar productos')).toBeInTheDocument();
        expect(screen.getByText('Failed to load products')).toBeInTheDocument();
    });

    it('handles search functionality', async () => {
        render(<ProductList onViewDetails={onViewDetails} onUpdateStock={onUpdateStock} />);

        const searchInput = screen.getByPlaceholderText('Buscar productos...');
        fireEvent.change(searchInput, { target: { value: 'Product 1' } });

        await waitFor(() => {
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
        });
    });

    it('handles stock updates', async () => {
        render(<ProductList onViewDetails={onViewDetails} onUpdateStock={onUpdateStock} />);

        await waitFor(() => {
        const minusButton = screen.getAllByTitle('Disminuir stock')[0];
        fireEvent.click(minusButton);
        });

        await waitFor(() => {
        expect(mockInventoryService.updateStock).toHaveBeenCalledWith(1, { changeQuantity: -1 });
        });
    });
});