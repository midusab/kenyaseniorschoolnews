import { Router } from 'express';
import { articleController } from '../controllers/articleController';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireAdmin, requireAuthor } from '../middleware/roleMiddleware';
import { uploadMiddleware } from '../middleware/uploadMiddleware';

const router = Router();

// GET all news
router.get('/', articleController.getArticles);

// GET all pending draft news (restricted to editors and administrators)
router.get('/pending', authMiddleware, requireAdmin, articleController.getPendingArticles);

// GET specific news story, increments visual views count automatically
router.get('/:id', articleController.getArticleById);

// POST new verified bulletin or draft story
router.post(
  '/',
  authMiddleware,
  requireAuthor,
  uploadMiddleware.single('image'),
  articleController.createArticle
);

// POST approve a draft story (restricted to editors and administrators)
router.post('/:id/approve', authMiddleware, requireAdmin, articleController.approveArticle);

// POST toggle pin content curation status (restricted to editors and administrators)
router.post('/:id/pin', authMiddleware, requireAdmin, articleController.pinArticle);

// POST submit a quick recommendation like
router.post('/:id/like', articleController.likeArticle);

// POST interact with specific reaction tags (applause, insight, congratulations, cheers)
router.post('/:id/react', articleController.reactToArticle);

// POST append comment opinions inside discussion boards
router.post('/:id/comment', authMiddleware, articleController.addComment);

// DELETE destroy bulletin (Author must represent matching School ID to proceed)
router.delete('/:id', authMiddleware, requireAdmin, articleController.deleteArticle);

export default router;
