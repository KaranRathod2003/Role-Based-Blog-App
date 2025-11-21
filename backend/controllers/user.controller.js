import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/users.models.js'
// import { use } from 'react'
// import { use } from 'react'



 const generateAccessAndRefreshToken = async (userId) =>{
        try {
            const user = await User.findById(userId);
            const accessToken = user.generateAccessToken()
            const refreshToken = user.generateRefreshToken()
            user.refreshToken = refreshToken;
            await user.save( {validateBeforeSave : false} )
            return {accessToken, refreshToken}
        } catch (error) {
            throw new ApiError(500, "Something went Wrong")
        }
    }








const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new ApiError(409, "User already exists");
    const user = await User.create({ name, email, password })
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) throw new ApiError(500, "Something Went wrong")
    return res.status(200).json(new ApiResponse(200, createdUser, "User register successfully"))
})
const allUsers = asyncHandler(async(req, res)=>{
    const users = await User.find({}).select("-password -refreshToken");
    if(users.length === 0) return res.status(400).json({
        success : false,
        message : "No users Found"
    })
    res.status(200).json({
        success : true,
        count : users.length,
        users : users
    })
   
})


const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) throw new ApiError(400, "Email, password required")
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(401, "Invalid credentials");
    if (!await user.isPasswordCorrect(password)) throw new ApiError(401, "Incorrect Password")
   const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    const options = {
        httpOnly : true,
        secure : true
    }
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200, {user : loggedInUser, accessToken, refreshToken}, "User login successfully")
    )

})


const logoutUser = asyncHandler(async (req, res) =>{
    await User.findByIdAndUpdate(
        req.user._id, {
            $set : {
                refreshToken : undefined
            }
        }, {
            new : true
        }
    )
     const options = {
        httpOnly : true,
        secure : true
    }
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "User Logged out "))
})




export { registerUser, loginUser, logoutUser, allUsers }