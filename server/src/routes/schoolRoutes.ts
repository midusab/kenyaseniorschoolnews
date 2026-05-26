import { Router } from 'express';
import { schoolController } from '../controllers/schoolController';
import { authMiddleware } from '../middleware/authMiddleware';
import { requireAdmin, requireSuperAdmin } from '../middleware/roleMiddleware';

const router = Router();

// Retrieve all certified senior schools
router.get('/', schoolController.getSchools);

// Retrieve all pending (unapproved) school proposals
router.get('/pending', authMiddleware, requireSuperAdmin, schoolController.getPendingSchools);

// Unique counties count
router.get('/counties', schoolController.getCounties);

// Specific school detail registry
router.get('/:id', schoolController.getSchoolById);

// Propose a brand new certified school
router.post('/', authMiddleware, requireAdmin, schoolController.createSchool);

// Approve a pending certified school profile proposal (Super Admin restricted)
router.post('/:id/approve', authMiddleware, requireSuperAdmin, schoolController.approveSchool);

// Update details inside a school profile
router.put('/:id', authMiddleware, requireAdmin, schoolController.updateSchool);

export default router;
