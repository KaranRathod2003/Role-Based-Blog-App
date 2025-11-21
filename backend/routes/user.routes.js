import { allUsers, loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";

import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validateRegister } from "../middlewares/validateRegister.js";

const router = Router();

router.route("/register").post(validateRegister ,registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/allUsers").get(allUsers)


export default router 