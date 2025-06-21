import { Router } from "express";
import { logoutUser, registerUser , loginUser , refreshAccessToken } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([{ //this works as a middleware 
        name:"avatar",
        maxCount:1
    },{
        name:"coverImage",
        maxCount:1
    }]),
    registerUser)

router.route("/login").post(loginUser) //to login the user 

//secured routes 
router.route("/logout").post(verifyJWT , logoutUser)
router.route("/refreshToken").post(refreshAccessToken)


export default router