import express from 'express';
import { updateUserRole } from '../controllers/userController';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';
import { roles } from '../utils/roleUtils';

const router = express.Router();

router.put('/:id/role', authenticateToken, authorizeRoles(roles.ADMIN), updateUserRole);

export default router;
