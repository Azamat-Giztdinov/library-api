import express from 'express';
import {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook
} from '../controllers/bookController';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware';
import { roles } from '../utils/roleUtils';
import { handleValidationErrors, validateBookData } from '../middleware/inputMiddleware';

const router = express.Router();

router.route('/')
    .post(authenticateToken, authorizeRoles(roles.ADMIN), validateBookData, handleValidationErrors,addBook)
    .get(getBooks);

router.route('/:id').get(getBookById)
    .put(authenticateToken, authorizeRoles(roles.ADMIN), updateBook)
    .delete(authenticateToken, authorizeRoles(roles.ADMIN), deleteBook);

export default router;
