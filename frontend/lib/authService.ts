import { httpClient, setTokens, clearTokens, getAccessToken } from './http';

interface User {
  id: string;
  role: 'egresado' | 'empresa';
  email?: string;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

interface RegisterResponse {
  user: User;
  token: string;
}

export const authService = {
  async register(email: string, password: string, role: 'egresado' | 'empresa'): Promise<RegisterResponse> {
    const data = await httpClient<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: { email, password, role },
    });

    setTokens(data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const data = await httpClient<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    });

    setTokens(data.token, data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  logout(): void {
    clearTokens();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  },

  getUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    try {
      return JSON.parse(userData) as User;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!getAccessToken();
  },
};

export type { User, LoginResponse, RegisterResponse };
