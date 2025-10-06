import { inventoryApi } from "../api";
import { BaseRepository } from "./BaseRepository";
import { Inventory, InventoryUpdateRequest, InventoryResponse } from "@/types";

/**
 * Repositorio específico para inventario
 */
export class InventoryRepository extends BaseRepository<
    Inventory,
    never,
    InventoryUpdateRequest
> {
    protected basePath = "/inventory";
    protected api = inventoryApi;

    /**
     * Obtener stock por productId (endpoint específico)
     */
    async getByProductId(productId: number): Promise<Inventory> {
        const response = await this.api.get<InventoryResponse>(
        `${this.basePath}/${productId}`
        );

        // Aplicamos la transformación genérica con tipado fuerte
        const transformed = this.transformResponse<{ data: Inventory }>(
        response.data
        );
        return transformed.data;
    }

    /**
     * Actualizar stock (endpoint específico)
     */
    async updateStock(
        productId: number,
        update: InventoryUpdateRequest
    ): Promise<Inventory> {
        const response = await this.api.post<InventoryResponse>(
        `${this.basePath}/${productId}/update`,
        update
        );

        const transformed = this.transformResponse<{ data: Inventory }>(
        response.data
        );
        return transformed.data;
    }

    /**
     * Obtener múltiples stocks a la vez
     */
    async getMultipleStocks(productIds: number[]): Promise<Inventory[]> {
        const promises = productIds.map((id) => this.getByProductId(id));
        const results = await Promise.allSettled(promises);

        return results
        .filter((result): result is PromiseFulfilledResult<Inventory> => result.status === "fulfilled")
        .map((result) => result.value);
    }

    /**
     * Override para transformación específica de inventory
     */
    protected override transformResponse<R>(response: unknown): R {
        if (
        typeof response === "object" &&
        response !== null &&
        "data" in response
        ) {
        type JsonApiResponse = {
            data: { id: string; attributes: Record<string, unknown> };
        };

        const r = response as JsonApiResponse;

        if (r.data && r.data.attributes) {
            return {
            data: {
                productId: parseInt(r.data.id, 10),
                ...r.data.attributes,
            },
            } as R;
        }
        }

        return response as R;
    }
}

// Instancia singleton del repositorio
export const inventoryRepository = new InventoryRepository();