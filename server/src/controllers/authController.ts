import { Request, Response } from 'express';
import { db } from '../config/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'KSSNN_SECRET_KEY_2026_JWT';

export const authController = {
  getCurrentUser: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        return res.status(200).json({ user: null });
      }

      const user = await db.findOne('users', (u) => u.id === req.user?.id);
      if (!user) {
        // Return active guest context
        return res.status(200).json({
          user: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role,
            name: req.user.name || 'KSSNN Reader'
          }
        });
      }

      res.status(200).json({ user });
    } catch (err) {
      console.error('GetCurrentUser controller failed:', err);
      res.status(500).json({ error: 'Server auth query failed' });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, role, schoolId, name } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email address represents required credential' });
      }

      // Check if user exists or provision instantly (passwordless/lazy flow for simplicity in demo)
      let user = await db.findOne('users', (u) => u.email === email.toLowerCase());

      if (!user) {
        user = await db.create('users', {
          email: email.toLowerCase(),
          name: name || 'Kenya Citizen Representative',
          role: role || 'public_reader',
          schoolId: schoolId || undefined,
          createdAt: new Date().toISOString()
        });
      } else {
        // If they specify a custom role or name update on login:
        const updates: Partial<any> = {};
        if (role) updates.role = role;
        if (schoolId) updates.schoolId = schoolId;
        if (name) updates.name = name;

        if (Object.keys(updates).length > 0) {
          user = await db.updateOne('users', (u) => u.id === user.id, updates);
        }
      }

      // Generate a signed JSON Web Token (JWT)
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          schoolId: user.schoolId,
          name: user.name
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        message: 'Successfully authenticated',
        token, // Real JWT token returned
        user
      });
    } catch (err) {
      console.error('Login action crashed:', err);
      res.status(500).json({ error: 'Authentication engine failure' });
    }
  },

  updateRole: async (req: Request, res: Response) => {
    try {
      const { role, schoolId } = req.body;
      if (!req.user) {
        return res.status(401).json({ error: 'Access unauthorized: missing authorization context' });
      }

      const updatedUser = await db.updateOne('users', (u) => u.id === req.user?.id, {
        role,
        schoolId: schoolId || undefined
      });

      // Generate updated JWT token reflecting altered perspective
      const token = jwt.sign(
        {
          id: req.user.id,
          email: req.user.email,
          role: role,
          schoolId: schoolId || undefined,
          name: req.user.name || 'Kenya Citizen Representative'
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(200).json({
        message: 'Perspective altered successfully',
        token,
        user: updatedUser || { id: req.user.id, email: req.user.email, role, schoolId }
      });
    } catch (err) {
      console.error('Role modifier failed:', err);
      res.status(500).json({ error: 'Internal system fault shifting role perspectives' });
    }
  },

  getUsers: async (req: Request, res: Response) => {
    try {
      const users = await db.find('users');
      res.status(200).json(users);
    } catch (err) {
      console.error('getUsers failed:', err);
      res.status(500).json({ error: 'Failed to retrieve registered users directory' });
    }
  },

  createUser: async (req: Request, res: Response) => {
    try {
      const { email, role, schoolId, name } = req.body;

      if (!email || !role || !name) {
        return res.status(400).json({ error: 'Email, Role, and Name are required variables' });
      }

      // Check if user already exists
      const existing = await db.findOne('users', (u) => u.email === email.toLowerCase());
      if (existing) {
        return res.status(409).json({ error: 'User with this email already registered in system' });
      }

      // If school_admin, overwrite schoolId to match their school only
      let assignedSchoolId = schoolId;
      if (req.user?.role === 'school_admin') {
        assignedSchoolId = req.user.schoolId;
      }

      const newUser = await db.create('users', {
        email: email.toLowerCase(),
        name,
        role,
        schoolId: assignedSchoolId || undefined,
        createdAt: new Date().toISOString()
      });

      res.status(201).json({
        message: 'New user profile created successfully',
        user: newUser
      });
    } catch (err) {
      console.error('createUser failed:', err);
      res.status(500).json({ error: 'Failed to create new user credential profile' });
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const userToDelete = await db.findOne('users', (u) => u.id === id);
      if (!userToDelete) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (req.user?.role !== 'super_admin') {
        return res.status(403).json({ error: 'Unauthorized: Only Super Administrators can delete credentials' });
      }

      await db.deleteOne('users', (u) => u.id === id);
      res.status(200).json({ success: true, message: 'User profile deleted successfully from portal directory' });
    } catch (err) {
      console.error('deleteUser failed:', err);
      res.status(500).json({ error: 'Failed to delete user profile from portal directory' });
    }
  }
};
