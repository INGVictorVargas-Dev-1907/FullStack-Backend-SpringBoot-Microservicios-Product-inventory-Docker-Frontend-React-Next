import { productsApi } from "../api";
import { BaseRepository } from "./BaseRepository";
import { Product, ProductFormData, PaginationMeta } from "@/types";

/**
 * Repositorio específico para productos
 */
export class ProductRepository extends BaseRepository<
    Product,
    ProductFormData,
    Partial<ProductFormData>
> {
    protected basePath = "/products";
    protected api = productsApi;

    /**
     * Buscar productos por nombre
     */
    async searchByName(
        name: string,
        page: number = 0,
        size: number = 10
    ): Promise<{ data: Product[]; meta: PaginationMeta }> {
        const response = await this.api.get(this.basePath, {
        params: { page, size, name },
        });
        return this.transformResponse<{ data: Product[]; meta: PaginationMeta }>(
        response.data
        );
    }

    /**
     * Obtener productos con stock bajo
     */
    async getLowStockProducts(
        threshold: number = 5
    ): Promise<{ data: Product[]; meta: PaginationMeta }> {
        const response = await this.api.get(this.basePath, {
        params: { lowStock: true, threshold },
        });
        return this.transformResponse<{ data: Product[]; meta: PaginationMeta }>(
        response.data
        );
    }
}

// Instancia singleton del repositorio
export const productRepository = new ProductRepository();
