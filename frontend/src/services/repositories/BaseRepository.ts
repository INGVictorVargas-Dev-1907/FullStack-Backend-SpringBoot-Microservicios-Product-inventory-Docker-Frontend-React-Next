import { AxiosInstance, AxiosResponse } from "axios";

/**
 * Repositorio base abstracto para operaciones CRUD
 */
export abstract class BaseRepository<
    T,
    CreateDto = Partial<T>,
    UpdateDto = Partial<T>
> {
    protected abstract basePath: string;
    protected abstract api: AxiosInstance;

    /**
     * Obtener todos los recursos
     */
    async getAll(params?: Record<string, unknown>): Promise<T[]> {
        const response: AxiosResponse = await this.api.get(this.basePath, { params });
        return this.transformResponse<{ data: T[] }>(response.data).data;
    }

    /**
     * Obtener recurso por ID
     */
    async getById(id: number | string): Promise<T> {
        const response: AxiosResponse = await this.api.get(`${this.basePath}/${id}`);
        return this.transformResponse<{ data: T }>(response.data).data;
    }

    /**
     * Crear nuevo recurso
     */
    async create(data: CreateDto): Promise<T> {
        const response: AxiosResponse = await this.api.post(this.basePath, data);
        return this.transformResponse<{ data: T }>(response.data).data;
    }

    /**
     * Actualizar recurso existente
     */
    async update(id: number | string, data: UpdateDto): Promise<T> {
        const response: AxiosResponse = await this.api.patch(`${this.basePath}/${id}`, data);
        return this.transformResponse<{ data: T }>(response.data).data;
    }

    /**
     * Eliminar recurso
     */
    async delete(id: number | string): Promise<void> {
        await this.api.delete(`${this.basePath}/${id}`);
    }

    /**
     * Transformar respuesta JSON:API a formato plano
     */
    protected transformResponse<R>(response: unknown): R {
        if (
        typeof response === "object" &&
        response !== null &&
        "data" in response
        ) {
        type JsonApiResponse = {
            data:
            | Array<{ id: string | number; attributes: Record<string, unknown> }>
            | { id: string | number; attributes: Record<string, unknown> };
            meta?: Record<string, unknown>;
        };

        const r = response as JsonApiResponse;

        // Si es una colección
        if (Array.isArray(r.data)) {
            return {
            data: r.data.map((item) => ({
                id: item.id,
                ...item.attributes,
            })),
            meta: r.meta,
            } as R;
        }

        // Si es un solo recurso
        if ("attributes" in r.data) {
            return {
            data: {
                id: r.data.id,
                ...r.data.attributes,
            },
            meta: r.meta,
            } as R;
        }
        }

        return response as R;
    }
}
