import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface User {
  id: number;
  username: string;
  created_at: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const AuthService = {
  async login(username: string, password: string): Promise<User> {
    const response = await axios.post<AuthResponse>(`${API_URL}/api/auth/login`, {
      username,
      password,
    });

    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data.user;
  },

  async register(username: string, password: string): Promise<void> {
    await axios.post(`${API_URL}/api/auth/register`, {
      username,
      password,
    });
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload(); // Simple way to reset state
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    // Check token expiry
    const token = localStorage.getItem('token');
    if (!token || this.isTokenExpired(token)) {
      this.logout();
      return null;
    }

    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  isTokenExpired(token: string): boolean {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const { exp } = JSON.parse(jsonPayload);
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }
};
