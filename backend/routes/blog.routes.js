// routes/blog.routes.js
import express from 'express';
import { createBlog } from '../controllers/blog.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validateBlog } from '../middlewares/validateBlog.js';

const router = express.Router();

// Protected route - need auth
router.route("/").post(verifyJWT, validateBlog, createBlog);

export default router;