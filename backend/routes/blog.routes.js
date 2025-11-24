// routes/blog.routes.js
import express from 'express';
import { createBlog, getAllBlogs } from '../controllers/blog.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validateBlog } from '../middlewares/validateBlog.js';

const router = express.Router();

// Protected route - need auth
router.route("/").post(verifyJWT, validateBlog, createBlog);
router.route("/").get(verifyJWT, getAllBlogs)

export default router;