import { Request, Response } from 'express';
import { db } from '../config/db';
import { validateSchool } from '../models/School';

export const schoolController = {
  getSchools: async (req: Request, res: Response) => {
    try {
      const schools = await db.find('schools');
      res.status(200).json(schools);
    } catch (err) {
      console.error('getSchools controller failed:', err);
      res.status(500).json({ error: 'Failed to query schools database' });
    }
  },

  getSchoolById: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const school = await db.findOne('schools', (s) => s.id === id);
      if (!school) {
        return res.status(404).json({ error: `School with ID ${id} not found` });
      }
      res.status(200).json(school);
    } catch (err) {
      console.error('getSchoolById controller failed:', err);
      res.status(500).json({ error: 'Failed to pull school details' });
    }
  },

  createSchool: async (req: Request, res: Response) => {
    try {
      const schoolData = req.body;
      const validationError = validateSchool(schoolData);
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }

      // Check if ID is already allocated
      const existing = await db.findOne('schools', (s) => s.id === schoolData.id);
      if (existing) {
        return res.status(409).json({ error: 'School with this ID already registered in portal database' });
      }

      const newSchool = await db.create('schools', {
        ...schoolData,
        isVerified: req.user?.role === 'super_admin',
        createdAt: new Date().toISOString()
      });

      res.status(201).json({
        message: req.user?.role === 'super_admin' ? 'School registered & accredited successfully' : 'School registry proposal submitted for Ministry validation review',
        school: newSchool
      });
    } catch (err) {
      console.error('createSchool controller crashed:', err);
      res.status(500).json({ error: 'Failed to create secondary school profile' });
    }
  },

  getPendingSchools: async (req: Request, res: Response) => {
    try {
      const schools = await db.find('schools');
      const pending = schools.filter(s => !s.isVerified);
      res.status(200).json(pending);
    } catch (err) {
      console.error('getPendingSchools failed:', err);
      res.status(500).json({ error: 'Failed to retrieve pending schools registry list' });
    }
  },

  approveSchool: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const school = await db.findOne('schools', (s) => s.id === id);
      if (!school) {
        return res.status(404).json({ error: 'School not found' });
      }

      const updated = await db.updateOne('schools', (s) => s.id === id, {
        isVerified: true
      });
      res.status(200).json({ success: true, message: 'School registry verified & certified successfully', school: updated });
    } catch (err) {
      console.error('approveSchool failed:', err);
      res.status(500).json({ error: 'Failed to approve school registry' });
    }
  },

  updateSchool: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      // Gate: only super_admin, or a school_admin belonging to that specific school can edit
      if (req.user?.role !== 'super_admin' && (req.user?.role !== 'school_admin' || req.user?.schoolId !== id)) {
        return res.status(403).json({ error: 'Unauthorized: You do not hold verified digital keys to edit this school profile' });
      }

      const school = await db.findOne('schools', (s) => s.id === id);
      if (!school) {
        return res.status(404).json({ error: 'School registry not found' });
      }

      const updated = await db.updateOne('schools', (s) => s.id === id, {
        principalName: updates.principalName || school.principalName,
        principalQuote: updates.principalQuote || school.principalQuote,
        certifiedPathways: updates.certifiedPathways || school.certifiedPathways,
        specialCombinationList: updates.specialCombinationList || school.specialCombinationList,
      });

      res.status(200).json({ success: true, message: 'School profile updated successfully', school: updated });
    } catch (err) {
      console.error('updateSchool failed:', err);
      res.status(500).json({ error: 'Failed to update school registry profile' });
    }
  },

  getCounties: async (req: Request, res: Response) => {
    try {
      const schools = await db.find('schools');
      const counties = schools.map((s) => s.county);
      const uniqueCounties = ['all', ...Array.from(new Set(counties))];
      res.status(200).json(uniqueCounties);
    } catch (err) {
      console.error('getCounties failed:', err);
      res.status(500).json({ error: 'Error calculating general regional metadata limits' });
    }
  }
};
