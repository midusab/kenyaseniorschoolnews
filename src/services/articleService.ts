import { NewsArticle, Comment } from '../types';
import { authService } from './authService';

export const articleService = {
  async getArticles(): Promise<NewsArticle[]> {
    try {
      const res = await fetch('/api/articles');
      if (!res.ok) throw new Error('Failed to retrieve announcements feed from server');
      return await res.json();
    } catch (err) {
      console.error('getArticles service failure, falling back to static feed:', err);
      const { MOCK_ARTICLES } = await import('../data/mockData');
      return MOCK_ARTICLES;
    }
  },

  async likeArticle(id: string): Promise<number> {
    const res = await fetch(`/api/articles/${id}/like`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to submit recommendation like');
    const data = await res.json();
    return data.likes;
  },

  async reactToArticle(
    id: string,
    type: 'applause' | 'insightful' | 'congratulations' | 'cheers'
  ): Promise<any> {
    const res = await fetch(`/api/articles/${id}/react`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reactionType: type })
    });
    if (!res.ok) throw new Error('Failed to submit reaction meter update');
    const data = await res.json();
    return data.reactions;
  },

  async addComment(
    articleId: string,
    text: string,
    authorName: string,
    authorRole: string
  ): Promise<Comment[]> {
    const token = authService.getToken();
    const res = await fetch(`/api/articles/${articleId}/comment`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text, authorName, authorRole })
    });
    if (!res.ok) throw new Error('Failed to post discussion opinion');
    const data = await res.json();
    return data.comments;
  },

  async publishArticle(newArt: Partial<NewsArticle> | FormData): Promise<NewsArticle> {
    const token = authService.getToken();
    
    const isFormData = newArt instanceof FormData;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`
    };
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch('/api/articles', {
      method: 'POST',
      headers,
      body: isFormData ? (newArt as FormData) : JSON.stringify(newArt)
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || 'Failed to authorize and publish bulletin to network');
    }
    const data = await res.json();
    return data.article;
  },

  async getPendingArticles(): Promise<NewsArticle[]> {
    const token = authService.getToken();
    const res = await fetch('/api/articles/pending', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to retrieve list of pending story drafts');
    return await res.json();
  },

  async approveArticle(id: string): Promise<any> {
    const token = authService.getToken();
    const res = await fetch(`/api/articles/${id}/approve`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to approve news draft');
    return await res.json();
  },

  async pinArticle(id: string): Promise<any> {
    const token = authService.getToken();
    const res = await fetch(`/api/articles/${id}/pin`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Failed to toggle content regional pin status');
    return await res.json();
  }
};
