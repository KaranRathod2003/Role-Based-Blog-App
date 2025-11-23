import express from "express"
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app = express();
import { ApiError } from "./utils/ApiError.js";

app.use(express.json({}));
app.use(express.urlencoded({extended :true}))
app.use(express.static("public"))
app.use(cookieParser());
app.use(cors({
    credentials : true
}))






// import routes
import userRouter from './routes/user.routes.js'
import blogRouter from './routes/blog.routes.js'

app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter)


app.use((err, req, res, next) => {
  console.error("Error Middleware:", err);
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});




export { app }