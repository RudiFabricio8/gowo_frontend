import { httpClient } from './http';

interface Request {
  id: string;
  empresaId: string;
  profileId: string;
  estado: 'pendiente' | 'aceptada' | 'rechazada';
  descripcion: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateRequestData {
  profile_id: string;
  descripcion: string;
}

export const requestService = {
  async createRequest(data: CreateRequestData): Promise<{ request: Request }> {
    return httpClient<{ request: Request }>('/requests', {
      method: 'POST',
      body: data,
      requireAuth: true,
    });
  },

  async getMyRequests(): Promise<{ requests: Request[] }> {
    return httpClient<{ requests: Request[] }>('/requests/me', {
      requireAuth: true,
    });
  },

  async updateRequestStatus(id: string, estado: 'aceptada' | 'rechazada'): Promise<{ request: Request }> {
    return httpClient<{ request: Request }>(`/requests/${id}`, {
      method: 'PATCH',
      body: { estado },
      requireAuth: true,
    });
  },
};

export type { Request, CreateRequestData };
