import { ProductCard } from '@/components/products/ProductCard';
import { Inventory, Product } from '@/types';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

// Mock data
const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'This is a test product description',
    price: 99.99,
    sku: 'TEST123'
};

const mockInventory: Inventory = {
    productId: 1,
    quantity: 10,
    productExists: true,
    name: 'Test Product',
    description: 'This is a test product description',
    price: 99.99,
    sku: 'TEST123'
};

describe('ProductCard', () => {
    const mockOnUpdateStock = jest.fn();
    const mockOnViewDetails = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders product information correctly', () => {
        render(
        <ProductCard
            product={mockProduct}
            inventory={mockInventory}
            onUpdateStock={mockOnUpdateStock}
            onViewDetails={mockOnViewDetails}
        />
        );

        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('This is a test product description')).toBeInTheDocument();
        expect(screen.getByText('$99.99')).toBeInTheDocument();
        expect(screen.getByText('TEST123')).toBeInTheDocument();
        expect(screen.getByText('10 en stock')).toBeInTheDocument();
    });

    it('calls onUpdateStock when stock buttons are clicked', () => {
        render(
        <ProductCard
            product={mockProduct}
            inventory={mockInventory}
            onUpdateStock={mockOnUpdateStock}
            onViewDetails={mockOnViewDetails}
        />
        );

        const minusButton = screen.getByTitle('Disminuir stock');
        const plusButton = screen.getByTitle('Aumentar stock');

        fireEvent.click(minusButton);
        expect(mockOnUpdateStock).toHaveBeenCalledWith(1, -1);

        fireEvent.click(plusButton);
        expect(mockOnUpdateStock).toHaveBeenCalledWith(1, 1);
    });

    it('calls onViewDetails when view button is clicked', () => {
        render(
        <ProductCard
            product={mockProduct}
            inventory={mockInventory}
            onUpdateStock={mockOnUpdateStock}
            onViewDetails={mockOnViewDetails}
        />
        );

        const viewButton = screen.getByText('Ver');
        fireEvent.click(viewButton);

        expect(mockOnViewDetails).toHaveBeenCalledWith(mockProduct);
    });

    it('disables minus button when stock is zero', () => {
        const zeroInventory = { ...mockInventory, quantity: 0 };
        
        render(
        <ProductCard
            product={mockProduct}
            inventory={zeroInventory}
            onUpdateStock={mockOnUpdateStock}
            onViewDetails={mockOnViewDetails}
        />
        );

        const minusButton = screen.getByTitle('Disminuir stock');
        expect(minusButton).toBeDisabled();
    });

    it('shows "No disponible" when product does not exist in inventory', () => {
        const noInventory = { ...mockInventory, productExists: false };
        
        render(
        <ProductCard
            product={mockProduct}
            inventory={noInventory}
            onUpdateStock={mockOnUpdateStock}
            onViewDetails={mockOnViewDetails}
        />
        );

        expect(screen.getByText('No disponible')).toBeInTheDocument();
        expect(screen.queryByTitle('Disminuir stock')).not.toBeInTheDocument();
        expect(screen.queryByTitle('Aumentar stock')).not.toBeInTheDocument();
    });

    it('applies loading state correctly', () => {
        render(
        <ProductCard
            product={mockProduct}
            inventory={mockInventory}
            onUpdateStock={mockOnUpdateStock}
            onViewDetails={mockOnViewDetails}
            loading={true}
        />
        );

        const buttons = screen.getAllByRole('button');
        buttons.forEach(button => {
        if (button.getAttribute('title')?.includes('stock')) {
            expect(button).toBeDisabled();
        }
        });
    });
});