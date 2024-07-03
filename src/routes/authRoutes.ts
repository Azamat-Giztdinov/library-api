import express from 'express';
import { register, login, me, updateUserConfirm } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';
import { handleValidationErrors, validateRegisterInput } from '../middleware/inputMiddleware';

const router = express.Router();

router.post('/register', validateRegisterInput, handleValidationErrors, register);
router.post('/login', login);
router.get('/me', authenticateToken, me);
router.get('/confirm/:token', updateUserConfirm)


export default router;
