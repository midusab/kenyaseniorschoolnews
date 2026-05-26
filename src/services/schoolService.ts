import { School, CBCPathway, Scholarship } from '../types';
import { MOCK_PATHWAYS } from '../data/mockData';
import { authService } from './authService';

export const schoolService = {
  async getSchools(): Promise<School[]> {
    try {
      const res = await fetch('/api/schools');
      if (!res.ok) throw new Error('Failed to pull authenticated institutions list');
      return await res.json();
    } catch (err) {
      console.error('getSchools service failure, falling back to static mock data:', err);
      // Failover for pristine resilience if server experiences momentary issues
      const { MOCK_SCHOOLS } = await import('../data/mockData');
      return MOCK_SCHOOLS;
    }
  },

  async getPendingSchools(): Promise<School[]> {
    const token = authService.getToken();
    const res = await fetch('/api/schools/pending', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to retrieve pending proposals');
    return await res.json();
  },

  async approveSchool(id: string): Promise<any> {
    const token = authService.getToken();
    const res = await fetch(`/api/schools/${id}/approve`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to certify senior school center registry');
    return await res.json();
  },

  async updateSchool(id: string, updateData: Partial<School>): Promise<any> {
    const token = authService.getToken();
    const res = await fetch(`/api/schools/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });
    if (!res.ok) throw new Error('Failed to save senior high profile modifications');
    return await res.json();
  },

  async createSchool(schoolData: Partial<School>): Promise<any> {
    const token = authService.getToken();
    const res = await fetch('/api/schools', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(schoolData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failure' }));
      throw new Error(err.error || 'Failed to submit high school profile proposal');
    }
    return await res.json();
  },

  getPathways(): CBCPathway[] {
    // Syllabus definitions remain consistent with official Ministry policies
    return MOCK_PATHWAYS;
  },

  async getScholarships(): Promise<Scholarship[]> {
    try {
      const res = await fetch('/api/scholarships');
      if (!res.ok) throw new Error('Failed to load scholarship boards');
      return await res.json();
    } catch (err) {
      console.error('getScholarships service failure, falling back to static mock data:', err);
      const { MOCK_SCHOLARSHIPS } = await import('../data/mockData');
      return MOCK_SCHOLARSHIPS;
    }
  },

  async getCounties(): Promise<string[]> {
    try {
      const res = await fetch('/api/schools/counties');
      if (!res.ok) throw new Error('Failed to retrieve hosted counties');
      return await res.json();
    } catch (err) {
      console.error('getCounties failure, compiling static counties lists:', err);
      const schools = await this.getSchools();
      const counties = schools.map((s) => s.county);
      return ['all', ...Array.from(new Set(counties)) as string[]];
    }
  }
};
