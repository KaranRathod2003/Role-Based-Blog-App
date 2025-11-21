import { asyncHandler } from "../utils/asyncHandler"
import { User } from "../models/users.models"
import { Blog } from "../models/blog.models";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

const createBlog = asyncHandler(async (req, res)=>{
    const {title, content, author, tags} = req.body;
    const user = await User.findById(author);
    if(!user) throw new ApiError(400, "Author not found");
    let slug = title
          .toLowerCase()
          .replace(/\s+/g, '-')         // spaces to hyphens
          .replace(/[^\w\-]+/g, '')     // remove special chars
          .replace(/\-\-+/g, '-')       // multiple hyphens to one
          .replace(/^-+/, '')           // trim start
          .replace(/-+$/, ''); 
    const findSlug = await Blog.findOne({slug});
    if(findSlug){
        slug = slug + "-" + Date.now();
    }
    const blog = await Blog.create({title, content, author, tags, slug, likes :[]})
    // I cant think the logic to find that blog is created or not my thinking is so brute force tell i m wrong or rgiht just check blogs from created user if blog is created then pass that blog in data and success if not apierror error occuired if not we will use apiresponse  
    // but user modle me aisa kuch nahi jisse mai check kar saku ki blog bana hai ya nahi kya ye sahi approach hai 
    if(!blog) throw new ApiError(500, "Something went wrong createing blog")
    return res.status(200).json(new ApiResponse(200, blog, "Blog created successfully"))
})


export { createBlog }