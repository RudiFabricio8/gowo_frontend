import { httpClient } from './http';

interface Skill {
  id: string;
  name: string;
}

interface ProfileSkill {
  profileId: string;
  skillId: string;
  skill: Skill;
}

interface Profile {
  id: string;
  userId: string;
  nombre: string;
  experienciaMeses: number;
  rating: string;
  resenasCount: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    role: string;
    email: string;
  };
  profileSkills: ProfileSkill[];
}

interface ProfilesResponse {
  profiles: Profile[];
  total: number;
  page: number;
  limit: number;
}

interface ProfileResponse {
  profile: Profile;
}

interface UpsertProfileData {
  nombre: string;
  experiencia_meses?: number;
  skills?: string[];
}

export const profileService = {
  async getProfiles(page: number = 1, limit: number = 10): Promise<ProfilesResponse> {
    return httpClient<ProfilesResponse>(`/profiles?page=${page}&limit=${limit}`);
  },

  async getProfileById(id: string): Promise<ProfileResponse> {
    return httpClient<ProfileResponse>(`/profiles/${id}`);
  },

  async upsertProfile(data: UpsertProfileData): Promise<ProfileResponse> {
    return httpClient<ProfileResponse>('/profiles', {
      method: 'POST',
      body: data,
      requireAuth: true,
    });
  },
};

export type { Profile, ProfileSkill, Skill, ProfilesResponse, ProfileResponse, UpsertProfileData };
