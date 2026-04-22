import { httpClient } from './http';

export interface ContactRequest { // cache buster
  id: string;
  empresaId: string;
  profileId: string;
  estado: 'pendiente' | 'aceptada' | 'rechazada';
  descripcion: string;
  createdAt: string;
  profile?: { nombre: string; rating: string };
  empresa?: { email: string };
}

export const requestService = {
  async createRequest(profileId: string, descripcion: string): Promise<{ request: ContactRequest }> {
    return httpClient<{ request: ContactRequest }>('/requests', {
      method: 'POST',
      body: { profileId, descripcion },
      requireAuth: true,
    });
  },

  async getMyRequests(): Promise<{ requests: ContactRequest[] }> {
    return httpClient<{ requests: ContactRequest[] }>('/requests', { requireAuth: true });
  },

  async updateStatus(id: string, estado: 'aceptada' | 'rechazada'): Promise<{ request: ContactRequest }> {
    return httpClient<{ request: ContactRequest }>(`/requests/${id}`, {
      method: 'PATCH',
      body: { estado },
      requireAuth: true,
    });
  },
};
