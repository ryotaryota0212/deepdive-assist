export const API_BASE_URL = 'http://172.16.8.2:8000'; // Local IP for Expo Go testing
export const API_PREFIX = '/api/v1';

/**
 * Utility function to get the full URL for an API endpoint
 * @param endpoint The API endpoint path (e.g., '/media')
 * @returns The full URL including base URL and API prefix
 */
export const getFullUrl = (endpoint: string) => `${API_BASE_URL}${API_PREFIX}${endpoint}`;
