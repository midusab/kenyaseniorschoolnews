import { Request, Response, NextFunction } from 'express';

export const requireRole = (allowedRoles: ('student_reporter' | 'editor' | 'school_admin' | 'super_admin' | 'public_reader')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Access Denied: Authentication credentials missing' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Authorized action denied. Required roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}` 
      });
    }

    return next();
  };
};

export const requireAdmin = requireRole(['school_admin', 'super_admin', 'editor']);
export const requireAuthor = requireRole(['school_admin', 'super_admin', 'editor', 'student_reporter']);
export const requireSuperAdmin = requireRole(['super_admin']);
export const requireSchoolOrSuperAdmin = requireRole(['school_admin', 'super_admin']);
