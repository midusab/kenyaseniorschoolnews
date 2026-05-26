import { NewsArticle as INewsArticle, Comment } from '../../../src/types';

export interface Article extends INewsArticle {}

export const validateArticle = (article: Partial<Article>): string | null => {
  if (!article.title || article.title.trim().length === 0) {
    return 'Announcement Title/Header is required';
  }
  if (!article.content || article.content.trim().length === 0) {
    return 'Full Bulletin Text content is required';
  }
  if (!article.category) {
    return 'Article Category selector must be configured';
  }
  if (!article.authorName || article.authorName.trim().length === 0) {
    return 'Author/Signee Name represents required security compliance';
  }
  return null;
};
