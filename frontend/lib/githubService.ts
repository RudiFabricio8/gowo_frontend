import { httpClient } from './http';

export interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  forks: number;
  updatedAt: string;
}

export const githubService = {
  async getRepos(username: string): Promise<{ repos: GithubRepo[] }> {
    return httpClient<{ repos: GithubRepo[] }>(`/github/${username}/repos`);
  },
};
