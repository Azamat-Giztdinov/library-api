import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: number;
  role: number;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user as JwtPayload;
    next();
  });
};

export const authorizeRoles = (...roles: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.sendStatus(403);
    }
    next();
  };
};

