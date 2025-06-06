import axios from 'axios';

const API_BASE_URL = 'http://192.168.3.3:8000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  maxRedirects: 0, // リダイレクトを許可しない
});

// レスポンスのインターセプターを追加
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 307) {
      // リダイレクトURLを直接使用
      const redirectUrl = error.response.headers.location;
      return axios({
        method: error.config.method,
        url: redirectUrl,
        data: error.config.data,
        headers: error.config.headers,
      }).then(response => response.data);
    }
    console.error(`${error.config?.method?.toUpperCase()} request failed: ${error.config?.url}`, error);
    throw error;
  }
);
