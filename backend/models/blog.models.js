import mongoose, { Schema } from "mongoose";


const blogSchema = new Schema ({
    content :{
        type : String,
        minLength : 5,
    }, 
    title:{
        type : String,
        required : true,
        trim : true,
    },
    likes :  [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"

    }],
    tags : [{
        type : String,

    }],
    author :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        index : true
    },
    slug : {
        required : true,
        trim : true,
        type : String,
        lowercase : true,
        unique : true,
        unique: true,
    }
}, {
    timestamps:true
})


const Blog = mongoose.model("Blog", blogSchema);


export { Blog }