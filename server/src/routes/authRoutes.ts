import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireAdmin, requireSuperAdmin } from '../middleware/roleMiddleware';

const router = Router();

// Retrieve self-identity
router.get('/current', authMiddleware, authController.getCurrentUser);

// Passwordless role-assertion login
router.post('/login', authController.login);

// Switch user perspective programmatically
router.post('/role', authMiddleware, authController.updateRole);

// Retrieve complete registered users directory
router.get('/users', authMiddleware, requireSuperAdmin, authController.getUsers);

// Register a brand new credential profile under a school or platform wide
router.post('/users', authMiddleware, requireAdmin, authController.createUser);

// Delete an existing credential structure from active directory
router.delete('/users/:id', authMiddleware, requireSuperAdmin, authController.deleteUser);

export default router;
