import { httpClient } from './http';

export interface Skill { id: string; name: string; }
export interface ProfileSkill { profileId: string; skillId: string; skill: Skill; }
export interface Profile {
  id: string;
  userId: string;
  nombre: string;
  experienciaMeses: number;
  rating: string;
  resenasCount: number;
  githubUsername?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: { role: string; email: string };
  profileSkills: ProfileSkill[];
}

export interface UpsertProfileData {
  nombre: string;
  experiencia_meses?: number;
  skills?: string[];
  github_username?: string;
}

export const profileService = {
  async getProfiles(page = 1, limit = 10): Promise<{ profiles: Profile[]; total: number; page: number; limit: number }> {
    return httpClient(`/profiles?page=${page}&limit=${limit}`);
  },
  async getProfileById(id: string): Promise<{ profile: Profile }> {
    return httpClient(`/profiles/${id}`);
  },
  async upsertProfile(data: UpsertProfileData): Promise<{ profile: Profile }> {
    return httpClient('/profiles', { method: 'POST', body: data, requireAuth: true });
  },
};
