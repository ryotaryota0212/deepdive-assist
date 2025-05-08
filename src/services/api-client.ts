import { getFullUrl } from '../config/api';

/**
 * API client for making HTTP requests
 */
class ApiClient {
  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(getFullUrl(endpoint));
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`GET request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(getFullUrl(endpoint), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`POST request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(getFullUrl(endpoint), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`PUT request failed: ${endpoint}`, error);
      throw error;
    }
  }

  async delete(endpoint: string): Promise<void> {
    try {
      const response = await fetch(getFullUrl(endpoint), {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`DELETE request failed: ${endpoint}`, error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
