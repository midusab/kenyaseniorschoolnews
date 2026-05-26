import { UserRole } from '../types';

export const authService = {
  getCurrentRole(): UserRole {
    const role = localStorage.getItem('kssnn_role');
    return (role as UserRole) || 'public_reader';
  },

  getToken(): string {
    return localStorage.getItem('kssnn_jwt_token') || localStorage.getItem('kssnn_role') || 'public_reader';
  },

  async setCurrentRole(role: UserRole): Promise<void> {
    localStorage.setItem('kssnn_role', role);
    
    const activeToken = localStorage.getItem('kssnn_jwt_token') || role;
    
    // Try to sync perspective token securely with backend session context and obtain signed JWT
    try {
      const res = await fetch('/api/auth/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeToken}`
        },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('kssnn_jwt_token', data.token);
        }
      }
    } catch (err) {
      console.warn('Remote authorization sync check bypassed.');
    }
  },

  availableRoles(): { id: UserRole; name: string; desc: string }[] {
    return [
      { id: 'public_reader', name: 'Standard Public Reader', desc: 'MoE Citizen Bulletin View (Read-Only)' },
      { id: 'student_reporter', name: 'Student Reporter', desc: 'Draft articles and report co-curricular achievements' },
      { id: 'editor', name: 'Editor', desc: 'Review articles, approve bulletins, and curate regional feeds' },
      { id: 'school_admin', name: 'School Admin', desc: 'Manage school details, principal profile, and certified pathways catalog' },
      { id: 'super_admin', name: 'Super Admin', desc: 'Manage portal platform and register certified senior institutions' }
    ];
  },

  async getUsers(): Promise<any[]> {
    const token = this.getToken();
    const res = await fetch('/api/auth/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Unauthorised: only Super Administrators can view system users');
    return await res.json();
  },

  async createUser(userData: { email: string; name: string; role: string; schoolId?: string }): Promise<any> {
    const token = this.getToken();
    const res = await fetch('/api/auth/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Fail' }));
      throw new Error(err.error || 'Failed to complete user registry profile creation');
    }
    return await res.json();
  },

  async deleteUser(id: string): Promise<any> {
    const token = this.getToken();
    const res = await fetch(`/api/auth/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to delete user structure');
    return await res.json();
  }
};
