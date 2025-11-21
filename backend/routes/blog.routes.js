// routes/blog.routes.js
import express from 'express';
import { createBlog } from '../controllers/blog.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { validateBlog } from '../middleware/validator.js';

const router = express.Router();

// Protected route - need auth
router.route('/').post(verifyJWT, validateBlog, createBlog);

export default router;