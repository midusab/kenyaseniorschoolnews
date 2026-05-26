import { Request, Response } from 'express';
import { db } from '../config/db';
import { validateArticle } from '../models/Article';
import { uploadImageToCloud } from '../config/cloudinary';

export const articleController = {
  getArticles: async (req: Request, res: Response) => {
    try {
      const articles = await db.find('articles');
      // Sort articles by date descending
      const sorted = [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      res.status(200).json(sorted);
    } catch (err) {
      console.error('getArticles failed:', err);
      res.status(500).json({ error: 'Failed to retrieve bulletins' });
    }
  },

  getArticleById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const article = await db.findOne('articles', (a) => a.id === id);
      if (!article) {
        return res.status(404).json({ error: 'Bulletin not found' });
      }

      // Automatically increment views on retrieval
      const updated = await db.updateOne('articles', (a) => a.id === id, {
        views: (article.views || 0) + 1
      });

      res.status(200).json(updated);
    } catch (err) {
      console.error('getArticleById failed:', err);
      res.status(500).json({ error: 'Failed to access bulletin resource' });
    }
  },

  createArticle: async (req: Request, res: Response) => {
    try {
      const articleData = req.body;
      const file = req.file;

      // Validate core string parameters
      const validationError = validateArticle(articleData);
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }

      let imageUrl = articleData.image;

      // If an actual image file was uploaded via multer, send to Cloudinary
      if (file) {
        try {
          imageUrl = await uploadImageToCloud(file.buffer);
        } catch (uploadErr) {
          console.error('Error uploading file to Cloudinary:', uploadErr);
        }
      }

      // Default category fallback images if no image or asset was linked
      const categoryDefaultImages: Record<string, string> = {
        pathway: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        academics: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        scholarships: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        clubs: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        events: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
        general: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
      };

      const finalImage = imageUrl?.trim() || categoryDefaultImages[articleData.category] || categoryDefaultImages.general;

      const cleanTags = articleData.tags
        ? (typeof articleData.tags === 'string'
            ? articleData.tags.split(',').map((t: string) => t.trim())
            : articleData.tags)
        : ['Verified', 'Board Post'];

      const newArticle = await db.create('articles', {
        title: articleData.title,
        content: articleData.content,
        summary: articleData.summary?.trim() || articleData.content.substring(0, 150) + '...',
        schoolId: articleData.schoolId || req.user?.schoolId || undefined,
        schoolName: articleData.schoolName || 'Ministry of Education Panel',
        schoolCategory: articleData.schoolCategory || (articleData.schoolId ? 'National' : 'National Panel'),
        authorName: articleData.authorName || req.user?.name || 'Authorized Dean',
        authorRole: articleData.authorRole || 'Careers Trustee',
        date: new Date().toISOString().split('T')[0],
        category: articleData.category,
        isVerified: req.user?.role !== 'student_reporter',
        image: finalImage,
        likes: 0,
        views: 1,
        reactions: {
          applause: 0,
          insightful: 0,
          congratulations: 0,
          cheers: 0
        },
        comments: [],
        tags: cleanTags.filter((t: string) => t.length > 0)
      });

      res.status(201).json({
        message: 'Security Signed Bulletin authenticated and broadcast successfully',
        article: newArticle
      });
    } catch (err) {
      console.error('createArticle controller failed:', err);
      res.status(500).json({ error: 'Failed to publish new announcement bulletin' });
    }
  },

  likeArticle: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const article = await db.findOne('articles', (a) => a.id === id);
      if (!article) {
        return res.status(404).json({ error: 'Bulletin not found' });
      }

      const updated = await db.updateOne('articles', (a) => a.id === id, {
        likes: (article.likes || 0) + 1
      });

      res.status(200).json({ likes: updated.likes, id: updated.id });
    } catch (err) {
      console.error('likeArticle failed:', err);
      res.status(500).json({ error: 'Failed to submit article like engagement structure' });
    }
  },

  reactToArticle: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { reactionType } = req.body; // e.g., 'applause' | 'insightful' | 'congratulations' | 'cheers'

      const article = await db.findOne('articles', (a) => a.id === id);
      if (!article) {
        return res.status(404).json({ error: 'Bulletin not found' });
      }

      const reactions = { ...(article.reactions || { applause: 0, insightful: 0, congratulations: 0, cheers: 0 }) };
      if (reactionType in reactions) {
        reactions[reactionType as keyof typeof reactions] += 1;
      } else {
        return res.status(400).json({ error: `Invalid reaction type: ${reactionType}` });
      }

      const updated = await db.updateOne('articles', (a) => a.id === id, { reactions });
      res.status(200).json({ reactions: updated.reactions, id: updated.id });
    } catch (err) {
      console.error('reactToArticle collapsed:', err);
      res.status(500).json({ error: 'Social reaction update failure' });
    }
  },

  addComment: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { text, authorName, authorRole } = req.body;

      if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: 'Comment content represents required input' });
      }

      const article = await db.findOne('articles', (a) => a.id === id);
      if (!article) {
        return res.status(404).json({ error: 'Bulletin announcement not found' });
      }

      const comments = [...(article.comments || [])];
      const newComment = {
        id: `comm-user-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        authorName: authorName?.trim() || 'Kenyan Citizen Reader',
        authorRole: authorRole?.trim() || (req.user ? req.user.role.toUpperCase() : 'Guest'),
        text: text.trim(),
        date: new Date().toISOString().split('T')[0]
      };

      comments.push(newComment);

      const updated = await db.updateOne('articles', (a) => a.id === id, { comments });
      res.status(200).json({ comments: updated.comments, id: updated.id });
    } catch (err) {
      console.error('addComment crashed:', err);
      res.status(500).json({ error: 'Discussion creation failed' });
    }
  },

  deleteArticle: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const article = await db.findOne('articles', (a) => a.id === id);
      if (!article) {
        return res.status(404).json({ error: 'Bulletin is non-existent' });
      }

      // Safeguard: make sure only school deans delete their school posts, or admins are supreme
      if (req.user?.role !== 'school_admin' && req.user?.role !== 'super_admin' && req.user?.role !== 'editor') {
        return res.status(403).json({ error: 'Only approved administrative credentials can delete notices' });
      }

      if (article.schoolId && article.schoolId !== req.user.schoolId) {
        return res.status(403).json({ error: 'Action unauthorized: Cannot delete a bulletin owned by a separate school board' });
      }

      await db.deleteOne('articles', (a) => a.id === id);
      res.status(200).json({ success: true, message: 'Official bulletin removed from national registry feed' });
    } catch (err) {
      console.error('deleteArticle collapsed:', err);
      res.status(500).json({ error: 'Deletion request processing failure' });
    }
  },
  
  getPendingArticles: async (req: Request, res: Response) => {
    try {
      const articles = await db.find('articles');
      const pending = articles.filter(a => !a.isVerified);
      res.status(200).json(pending);
    } catch (err) {
      console.error('getPendingArticles failed:', err);
      res.status(500).json({ error: 'Failed to retrieve pending drafts list' });
    }
  },

  approveArticle: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const article = await db.findOne('articles', (a) => a.id === id);
      if (!article) {
        return res.status(404).json({ error: 'Bulletin not found' });
      }

      const updated = await db.updateOne('articles', (a) => a.id === id, {
        isVerified: true
      });
      res.status(200).json({ success: true, message: 'Official news draft approved and published', article: updated });
    } catch (err) {
      console.error('approveArticle failed:', err);
      res.status(500).json({ error: 'Failed to approve news draft' });
    }
  },

  pinArticle: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const article = await db.findOne('articles', (a) => a.id === id);
      if (!article) {
        return res.status(404).json({ error: 'Bulletin not found' });
      }

      const tags = [...(article.tags || [])];
      let updatedTags = tags;
      if (tags.includes('Pinned')) {
        updatedTags = tags.filter((t: string) => t !== 'Pinned');
      } else {
        updatedTags.push('Pinned');
      }

      const updated = await db.updateOne('articles', (a) => a.id === id, {
        tags: updatedTags
      });

      res.status(200).json({ success: true, message: 'Article pinned curation toggled successfully', article: updated });
    } catch (err) {
      console.error('pinArticle failed:', err);
      res.status(500).json({ error: 'Failed to curate/pin article status' });
    }
  }
};
