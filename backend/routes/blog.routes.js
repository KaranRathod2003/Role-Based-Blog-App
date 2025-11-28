// routes/blog.routes.js
import express from 'express';
import { createBlog, getAllBlogs, getBlogBySlug, updateBlog, deleteBlog } from '../controllers/blog.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { validateBlog } from '../middlewares/validateBlog.js';

const router = express.Router();

// Protected route - need auth
// router.route("/").post(verifyJWT, validateBlog, createBlog);
// router.route("/").get(verifyJWT, getAllBlogs)
// router.get("/slug/:slug",verifyJWT, getBlogBySlug);
// router.route("/:id").put( verifyJWT, updateBlog);

router.use(verifyJWT); // Apply to all routes below

// GET routes
router.get("/", getAllBlogs);              // GET /api/blogs
router.get("/slug/:slug", getBlogBySlug);  // GET /api/blogs/slug/my-blog

// POST routes
router.post("/", validateBlog, createBlog); // POST /api/blogs

// PATCH routes (better than PUT for partial updates)
router.patch("/:id", updateBlog);          // PATCH /api/blogs/123

// DELETE routes
router.delete("/:id", deleteBlog);

export default router;