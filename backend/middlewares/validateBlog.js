


const validateBlog = (req, res, next) => {
    const { title, content } = req.body
    if (!title || !content) return res.status(400).json({
        success: false,
        message: "Fields are required"
    })
    if (content.trim().length < 5) return res.status(400).json({
        success: false,
        message: "Content length is too short or empty spaces not allowed"
    })
    if (title.length < 3) return res.status(400).json({
        success: false,
        message: "Title is too short"
    })
    next();
}



export { validateBlog }