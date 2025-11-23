const blogSchema = new Schema({
    // ... your existing fields
    
    // View count
    views: {
        type: Number,
        default: 0
    },
    
    // Published status
    isPublished: {
        type: Boolean,
        default: false
    },
    
    // Featured image
    coverImage: {
        type: String,
        default: ""
    },
    
    // Comments array (for later)
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
}, { timestamps: true });
```

---

## **🎯 BLOG CONTROLLERS - ALGORITHMS**

Abhi main **5 controllers** ka algorithm deta hoon - tu code likhega! 💪

---

### **CONTROLLER 1: CREATE BLOG (Most Important)**
```
ALGORITHM: createBlog

INPUT: req (contains title, content, author, tags in body)
OUTPUT: Created blog document

STEPS:

1. EXTRACT DATA from req.body:
   - Get title
   - Get content  
   - Get author
   - Get tags (optional, can be empty array)

2. VALIDATE AUTHOR:
   - Check if author ID exists in User collection
   - Use User.findById(author)
   - If NOT found:
      - Return 404 error "Author not found"

3. GENERATE SLUG:
   - Convert title to lowercase
   - Replace spaces with hyphens
   - Remove special characters
   - Example: "My Blog Post!" → "my-blog-post"
   
   Formula:
   slug = title
          .toLowerCase()
          .replace(/\s+/g, '-')         // spaces to hyphens
          .replace(/[^\w\-]+/g, '')     // remove special chars
          .replace(/\-\-+/g, '-')       // multiple hyphens to one
          .replace(/^-+/, '')           // trim start
          .replace(/-+$/, '');          // trim end

4. CHECK SLUG UNIQUENESS:
   - Use Blog.findOne({ slug })
   - If slug already exists:
      - Append random number to slug
      - slug = slug + "-" + Date.now()

5. CREATE BLOG:
   - Use Blog.create({
       title,
       content,
       author,
       tags,
       slug,
       likes: [],
       views: 0
     })

6. RETURN RESPONSE:
   - Status: 201 (Created)
   - Data: created blog object
   - Message: "Blog created successfully"

ERROR HANDLING:
   - Wrap entire logic in try-catch
   - If error: return 500 "Failed to create blog"

END ALGORITHM
```

---

### **CONTROLLER 2: GET ALL BLOGS**
```
ALGORITHM: getAllBlogs

INPUT: req (optional query params: page, limit, author)
OUTPUT: Array of blog documents

STEPS:

1. EXTRACT QUERY PARAMS:
   - Get page number (default: 1)
   - Get limit (default: 10)
   - Get author filter (optional)

2. BUILD FILTER OBJECT:
   - Create empty filter: {}
   - If author param exists:
      - Add to filter: { author: authorId }
   - If you want only published:
      - Add to filter: { isPublished: true }

3. CALCULATE SKIP:
   - Formula: skip = (page - 1) * limit
   - Example: page=2, limit=10 → skip=10

4. FETCH BLOGS:
   - Use Blog.find(filter)
   - Add .populate("author", "name email")
      (This gets author details, not just ID)
   - Add .populate("likes", "name")
      (This gets user names who liked)
   - Add .select("-__v")
      (Remove __v field from response)
   - Add .sort({ createdAt: -1 })
      (Newest first)
   - Add .skip(skip)
   - Add .limit(limit)

5. COUNT TOTAL DOCUMENTS:
   - Use Blog.countDocuments(filter)
   - This gives total count for pagination

6. CALCULATE PAGINATION INFO:
   - totalPages = Math.ceil(totalCount / limit)
   - hasNextPage = page < totalPages
   - hasPrevPage = page > 1

7. RETURN RESPONSE:
   - Status: 200
   - Data: {
       blogs: [...],
       pagination: {
         currentPage: page,
         totalPages,
         totalBlogs: totalCount,
         hasNextPage,
         hasPrevPage
       }
     }

ERROR HANDLING:
   - If no blogs found: return empty array (not error!)
   - If error in query: return 500

END ALGORITHM
```

---

### **CONTROLLER 3: GET SINGLE BLOG BY SLUG**
```
ALGORITHM: getBlogBySlug

INPUT: req.params.slug
OUTPUT: Single blog document

STEPS:

1. EXTRACT SLUG:
   - Get slug from req.params.slug

2. FIND BLOG:
   - Use Blog.findOne({ slug })
   - Add .populate("author", "name email avatar")
   - Add .populate("likes", "name")

3. CHECK IF FOUND:
   - If blog is null:
      - Return 404 "Blog not found"

4. INCREMENT VIEW COUNT:
   - blog.views = blog.views + 1
   - OR: blog.views++
   - Save: await blog.save()

5. RETURN RESPONSE:
   - Status: 200
   - Data: blog object

ERROR HANDLING:
   - Invalid slug: 404
   - Database error: 500

END ALGORITHM
```

---

### **CONTROLLER 4: UPDATE BLOG**
```
ALGORITHM: updateBlog

INPUT: req.params.id, req.body (title, content, tags)
OUTPUT: Updated blog document

STEPS:

1. EXTRACT DATA:
   - Get blogId from req.params.id
   - Get title, content, tags from req.body
   - Get current user ID from req.user._id
      (This comes from verifyJWT middleware)

2. FIND BLOG:
   - Use Blog.findById(blogId)
   - If NOT found:
      - Return 404 "Blog not found"

3. CHECK AUTHORIZATION:
   - Compare blog.author with req.user._id
   - Convert both to string: blog.author.toString() === req.user._id.toString()
   - If NOT equal:
      - Return 403 "You can only edit your own blogs"

4. UPDATE SLUG (if title changed):
   - If title is provided AND different from current:
      - Generate new slug (same logic as create)
      - Check uniqueness
      - Update: blog.slug = newSlug

5. UPDATE FIELDS:
   - If title provided: blog.title = title
   - If content provided: blog.content = content
   - If tags provided: blog.tags = tags

6. SAVE CHANGES:
   - await blog.save()

7. FETCH UPDATED BLOG:
   - Use Blog.findById(blogId).populate("author")
   - Return fresh data with populated fields

8. RETURN RESPONSE:
   - Status: 200
   - Data: updated blog
   - Message: "Blog updated successfully"

ERROR HANDLING:
   - Invalid ID format: 400
   - Not found: 404
   - Not authorized: 403
   - Update failed: 500

END ALGORITHM
```

---

### **CONTROLLER 5: DELETE BLOG**
```
ALGORITHM: deleteBlog

INPUT: req.params.id, req.user (from middleware)
OUTPUT: Success message

STEPS:

1. EXTRACT BLOG ID:
   - Get id from req.params.id

2. FIND BLOG:
   - Use Blog.findById(id)
   - If NOT found:
      - Return 404 "Blog not found"

3. CHECK AUTHORIZATION:
   - Compare blog.author with req.user._id
   - If NOT match:
      - Return 403 "You can only delete your own blogs"

4. DELETE BLOG:
   - Option 1: await Blog.findByIdAndDelete(id)
   - Option 2: await blog.deleteOne()

5. RETURN RESPONSE:
   - Status: 200
   - Message: "Blog deleted successfully"
   - Data: { deletedBlogId: id }

ERROR HANDLING:
   - Invalid ID: 400
   - Not found: 404
   - Not authorized: 403
   - Delete failed: 500

END ALGORITHM
```

---

## **🎯 BONUS: LIKE/UNLIKE BLOG**
```
ALGORITHM: toggleLike

INPUT: req.params.id (blogId), req.user._id
OUTPUT: Updated blog with new like status

STEPS:

1. EXTRACT DATA:
   - Get blogId from req.params.id
   - Get userId from req.user._id

2. FIND BLOG:
   - Use Blog.findById(blogId)
   - If NOT found: return 404

3. CHECK IF USER ALREADY LIKED:
   - Check if userId exists in blog.likes array
   - Use: blog.likes.includes(userId)
   
   OR more robust:
   - const hasLiked = blog.likes.some(
       likeId => likeId.toString() === userId.toString()
     )

4. TOGGLE LIKE:
   - If hasLiked is TRUE:
      - UNLIKE: Remove userId from array
      - Use: blog.likes = blog.likes.filter(
          likeId => likeId.toString() !== userId.toString()
        )
      - Action: "unliked"
   
   - If hasLiked is FALSE:
      - LIKE: Add userId to array
      - Use: blog.likes.push(userId)
      - Action: "liked"

5. SAVE CHANGES:
   - await blog.save()

6. RETURN RESPONSE:
   - Status: 200
   - Data: {
       blogId,
       likesCount: blog.likes.length,
       action: "liked" or "unliked"
     }

ERROR HANDLING:
   - Invalid ID: 400
   - Blog not found: 404
   - Save failed: 500

END ALGORITHM
```

---

## **📋 RESEARCH HINTS (For Syntax)**

### **Tu research karke ye syntax seekh:**

**1. Mongoose Query Methods:**
```
- Blog.find()
- Blog.findById()
- Blog.findOne()
- Blog.create()
- Blog.findByIdAndDelete()
- Blog.countDocuments()
```

**2. Mongoose Query Modifiers:**
```
- .populate()
- .select()
- .sort()
- .skip()
- .limit()
- .save()
```

**3. String Methods (for slug):**
```
- .toLowerCase()
- .replace()
- .trim()
```

**4. Array Methods (for likes):**
```
- .includes()
- .some()
- .filter()
- .push()
```

**5. Mongoose Schema Methods:**
```
- document.save()
- document.deleteOne()
```

---

## **🎯 YOUR PRACTICE ORDER:**

### **Day 1 (Today):**
```
1. ✅ Fix validateBlog middleware
2. ✅ Commit: "feat: blog validation middleware"
3. 📝 Create blog.controller.js file
4. 📝 Write createBlog controller
5. ✅ Commit: "feat: create blog controller"
```

### **Day 2:**
```
1. 📝 Write getAllBlogs controller
2. 📝 Write getBlogBySlug controller
3. ✅ Commit: "feat: get blogs controllers"
```

### **Day 3:**
```
1. 📝 Write updateBlog controller
2. 📝 Write deleteBlog controller
3. 📝 Write toggleLike controller
4. ✅ Commit: "feat: update, delete, like blog controllers"