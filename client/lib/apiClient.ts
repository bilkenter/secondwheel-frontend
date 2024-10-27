const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/';

export const api = async (endpoint: string, options: RequestInit = {}) => {
  const url = new URL(endpoint, BASE_URL).toString();
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // This will include cookies if needed
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
