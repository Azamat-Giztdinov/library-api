// index.ts

import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateRegisterInput = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format')
];

export const validateBookData = [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('publicationDate').isISO8601().toDate().withMessage('Invalid publicationDate format'),
  body('genres').isArray().withMessage('Genres must be an array')
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};


