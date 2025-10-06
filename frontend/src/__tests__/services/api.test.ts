import axios from 'axios';
import { productsService, inventoryService, isApiError, getErrorMessage } from '@/services/api';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Services', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset environment variables
        process.env.NEXT_PUBLIC_PRODUCTS_BASE_URL = 'http://localhost:8081';
        process.env.NEXT_PUBLIC_INVENTORY_BASE_URL = 'http://localhost:8082';
    });

    describe('Products Service', () => {
        it('fetches products successfully', async () => {
        const mockResponse = {
            data: {
            data: [
                {
                id: '1',
                type: 'products',
                attributes: {
                    id: 1,
                    name: 'Test Product',
                    description: 'Test Description',
                    price: 99.99,
                    sku: 'TEST123'
                }
                }
            ],
            meta: {
                totalElements: 1,
                totalPages: 1,
                pageNumber: 0,
                pageSize: 10
            }
            }
        };

        mockedAxios.get.mockResolvedValue(mockResponse);

        const result = await productsService.getProducts();

        expect(result).toEqual(mockResponse.data);
        expect(mockedAxios.get).toHaveBeenCalledWith(
            'http://localhost:8081/products?page=0&size=10'
        );
        });

        it('fetches product by ID', async () => {
        const mockResponse = {
            data: {
            data: {
                id: '1',
                type: 'products',
                attributes: {
                id: 1,
                name: 'Test Product',
                description: 'Test Description',
                price: 99.99,
                sku: 'TEST123'
                }
            }
            }
        };

        mockedAxios.get.mockResolvedValue(mockResponse);

        const result = await productsService.getProductById(1);

        expect(result).toEqual(mockResponse.data);
        expect(mockedAxios.get).toHaveBeenCalledWith(
            'http://localhost:8081/products/1'
        );
        });

        it('creates a product', async () => {
        const productData = {
            name: 'New Product',
            description: 'New Description',
            price: 199.99,
            sku: 'NEW123'
        };

        const mockResponse = {
            data: {
            data: {
                id: '2',
                type: 'products',
                attributes: {
                id: 2,
                ...productData
                }
            }
            }
        };

        mockedAxios.post.mockResolvedValue(mockResponse);

        const result = await productsService.createProduct(productData);

        expect(result).toEqual(mockResponse.data);
        expect(mockedAxios.post).toHaveBeenCalledWith(
            'http://localhost:8081/products',
            productData
        );
        });

        it('updates a product', async () => {
        const updates = { name: 'Updated Product', price: 149.99 };

        const mockResponse = {
            data: {
            data: {
                id: '1',
                type: 'products',
                attributes: {
                id: 1,
                name: 'Updated Product',
                description: 'Test Description',
                price: 149.99,
                sku: 'TEST123'
                }
            }
            }
        };

        mockedAxios.patch.mockResolvedValue(mockResponse);

        const result = await productsService.updateProduct(1, updates);

        expect(result).toEqual(mockResponse.data);
        expect(mockedAxios.patch).toHaveBeenCalledWith(
            'http://localhost:8081/products/1',
            updates
        );
        });

        it('deletes a product', async () => {
        mockedAxios.delete.mockResolvedValue({});

        await productsService.deleteProduct(1);

        expect(mockedAxios.delete).toHaveBeenCalledWith(
            'http://localhost:8081/products/1'
        );
        });
    });

    describe('Inventory Service', () => {
        it('fetches stock successfully', async () => {
        const mockResponse = {
            data: {
            data: {
                id: '1',
                type: 'inventory',
                attributes: {
                productId: 1,
                quantity: 10,
                productExists: true,
                name: 'Test Product',
                description: 'Test Description',
                price: 99.99,
                sku: 'TEST123'
                }
            }
            }
        };

        mockedAxios.get.mockResolvedValue(mockResponse);

        const result = await inventoryService.getStock(1);

        expect(result).toEqual(mockResponse.data);
        expect(mockedAxios.get).toHaveBeenCalledWith(
            'http://localhost:8082/inventory/1'
        );
        });

        it('updates stock successfully', async () => {
        const updateData = { changeQuantity: 5 };
        const mockResponse = {
            data: {
            data: {
                id: '1',
                type: 'inventory',
                attributes: {
                productId: 1,
                quantity: 15,
                productExists: true
                }
            }
            }
        };

        mockedAxios.post.mockResolvedValue(mockResponse);

        const result = await inventoryService.updateStock(1, updateData);

        expect(result).toEqual(mockResponse.data);
        expect(mockedAxios.post).toHaveBeenCalledWith(
            'http://localhost:8082/inventory/1/update',
            updateData
        );
        });
    });

    describe('Error Utilities', () => {
        it('identifies API errors correctly', () => {
        const apiError = {
            errors: [
            {
                status: '404',
                title: 'Not Found',
                detail: 'Product not found'
            }
            ]
        };

        const regularError = { message: 'Regular error' };
        const networkError = { response: { data: { errors: [] } } };

        expect(isApiError(apiError)).toBe(true);
        expect(isApiError(regularError)).toBe(false);
        expect(isApiError(networkError)).toBe(true);
        });

        it('extracts error messages correctly', () => {
        const apiError = {
            response: {
            data: {
                errors: [
                {
                    status: '404',
                    title: 'Not Found',
                    detail: 'Product not found'
                }
                ]
            }
            }
        };

        const messageError = { message: 'Network error' };
        const unknownError = {};

        expect(getErrorMessage(apiError)).toBe('Product not found');
        expect(getErrorMessage(messageError)).toBe('Network error');
        expect(getErrorMessage(unknownError)).toBe('Error de conexión');
        });
    });

    describe('Error Handling', () => {
        it('handles network errors', async () => {
        const networkError = new Error('Network error');
        mockedAxios.get.mockRejectedValue(networkError);

        await expect(productsService.getProducts()).rejects.toThrow('Network error');
        });

        it('handles API errors with JSON:API format', async () => {
        const apiError = {
            response: {
            data: {
                errors: [
                {
                    status: '400',
                    title: 'Bad Request',
                    detail: 'Invalid product data'
                }
                ]
            }
            }
        };

        mockedAxios.get.mockRejectedValue(apiError);

        await expect(productsService.getProducts()).rejects.toEqual(apiError);
        });
    });
});