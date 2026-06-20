import axios, { AxiosInstance } from 'axios';
import type { Endpoints } from './api-context';

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message: string;
  timestamp: number;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export class ApiService {
  private axiosInstance: AxiosInstance;
  private baseUrl: string;
  private endpoints: Endpoints | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  setEndpoints(ep: Endpoints | null) {
    this.endpoints = ep;
  }

  private resolvePath(endpoint: string, id?: string | number): string {
    if (id !== undefined) {
      return endpoint.replace('{id}', String(id));
    }
    return endpoint;
  }

  private extractRecords(responseData: any): any[] {
    if (Array.isArray(responseData)) {
      return responseData;
    }

    return responseData.items || [];
  }

  private recordMatchesQuery(record: any, query: string): boolean {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return true;
    }

    const values: string[] = [];
    const visit = (value: any) => {
      if (value === null || value === undefined) {
        return;
      }

      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        values.push(String(value).toLowerCase());
        return;
      }

      if (Array.isArray(value)) {
        value.forEach(visit);
        return;
      }

      if (typeof value === 'object') {
        Object.values(value).forEach(visit);
      }
    };

    visit(record);

    return values.some((value) => value.includes(normalizedQuery));
  }

  private async getAllRecords(resource: string, batchSize: number = 100) {
    const records: any[] = [];
    let page = 1;

    while (true) {
      const response = await this.getRecords(resource, page, batchSize);
      records.push(...response.data);

      if (response.data.length < batchSize) {
        break;
      }

      if (typeof response.total === 'number' && records.length >= response.total) {
        break;
      }

      page += 1;
    }

    return records;
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await this.axiosInstance.get('/');
      return response.status === 200 || response.status === 404;
    } catch (error) {
      return false;
    }
  }

  async getRecords(resource: string, page: number = 1, limit: number = 10) {
    try {
      const path = this.endpoints?.list || `/${resource}`;
      const startTime = performance.now();
      const response = await this.axiosInstance.get(this.resolvePath(path), {
        params: { page, limit },
      });
      const endTime = performance.now();

      return {
        data: this.extractRecords(response.data),
        total: response.data.total || (Array.isArray(response.data) ? response.data.length : 0),
        responseTime: endTime - startTime,
        status: response.status,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch records'
      );
    }
  }

  async createRecord(resource: string, data: any) {
    try {
      const path = this.endpoints?.create || `/${resource}`;
      const startTime = performance.now();
      const response = await this.axiosInstance.post(this.resolvePath(path), data);
      const endTime = performance.now();

      return {
        data: response.data,
        responseTime: endTime - startTime,
        status: response.status,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to create record'
      );
    }
  }

  async updateRecord(resource: string, id: string | number, data: any) {
    try {
      const path = this.endpoints?.update || `/${resource}/${id}`;
      const startTime = performance.now();
      const response = await this.axiosInstance.put(this.resolvePath(path, id), data);
      const endTime = performance.now();

      return {
        data: response.data,
        responseTime: endTime - startTime,
        status: response.status,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to update record'
      );
    }
  }

  async deleteRecord(resource: string, id: string | number) {
    try {
      const path = this.endpoints?.delete || `/${resource}/${id}`;
      const startTime = performance.now();
      const response = await this.axiosInstance.delete(this.resolvePath(path, id));
      const endTime = performance.now();

      return {
        data: response.data,
        responseTime: endTime - startTime,
        status: response.status,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to delete record'
      );
    }
  }

  async getSchema(): Promise<any> {
    try {
      const response = await this.axiosInstance.get('/schema');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch schema'
      );
    }
  }

  async searchRecords(resource: string, query: string, limit: number = 10) {
    try {
      const startTime = performance.now();
      const allRecords = await this.getAllRecords(resource, Math.max(limit, 100));
      const endTime = performance.now();

      const records = allRecords.filter((record) => this.recordMatchesQuery(record, query));

      return {
        data: records.slice(0, limit),
        total: records.length,
        responseTime: endTime - startTime,
        status: 200,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          error.message ||
          'Failed to search records'
      );
    }
  }
}

let apiServiceInstance: ApiService | null = null;

export function getApiService(baseUrl: string): ApiService {
  if (!apiServiceInstance) {
    apiServiceInstance = new ApiService(baseUrl);
  } else {
    apiServiceInstance.setBaseUrl(baseUrl);
  }
  return apiServiceInstance;
}
