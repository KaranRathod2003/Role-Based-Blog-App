import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/users.models.js"
import { Blog } from "../models/blog.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const createBlog = asyncHandler(async (req, res) => {
    const { title, content } = req.body;
    const authorId = req.user?._id;
    if (!authorId) {
        throw new ApiError(401, "Unauthorized - Please login first");
    }

    // 4. VALIDATE AUTHOR ID FORMAT (This was missing!)
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
        throw new ApiError(400, "Invalid author ID format");
    }
    const user = await User.findById(authorId);
    if (!user) throw new ApiError(400, "Author not found");

    let slug = title
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')         // spaces to hyphens
        .replace(/[^\w\-]+/g, '')     // remove special chars
        .replace(/\-\-+/g, '-')       // multiple hyphens to one
        .replace(/^-+/, '')           // trim start
        .replace(/-+$/, '');
    const existingSlug = await Blog.findOne({ slug });
    if (existingSlug) {
        slug = `${slug}-${Date.now()}`
    }
    const blog = await Blog.create({ title : title.trim(), content : content.trim(), author: authorId, slug, likes: [] })
    // I cant think the logic to find that blog is created or not my thinking is so brute force tell i m wrong or rgiht just check blogs from created user if blog is created then pass that blog in data and success if not apierror error occuired if not we will use apiresponse  
    // but user modle me aisa kuch nahi jisse mai check kar saku ki blog bana hai ya nahi kya ye sahi approach hai 
    if (!blog) throw new ApiError(500, "Something went wrong createing blog")
    const createdBlog = await Blog.findById(blog._id).populate("author", "name email").lean();

    
    return res.status(201).json(new ApiResponse(201, createdBlog, "Blog created successfully"))
})

// const getAllBlogs = asyncHandler(async (req, res) =>{
//     let page = Number(req.query.page) || 1;
//     let limit = Number(req.query.limit) || 5;
//     let skip = (page - 1) * limit;
//     const {author} = req.query.author;
//     const filter = {}
//     if(author){
//         filter.author = author.authorId;
//     }



// })

export { createBlog }