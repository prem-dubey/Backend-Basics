import { Router } from "express";
import { 
    logoutUser, 
    registerUser , 
    loginUser , 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateAccountDetails, 
    updateUserAvatar, 
    updateUserCoverImage, 
    getUserChannelProfile, 
    getWatchHistory 
} from "../controllers/user.controllers.js";
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
router.route("/change-password").post(verifyJWT , changeCurrentPassword)
router.route("/current-user").get(verifyJWT , getCurrentUser)
router.route("/update-account").patch(verifyJWT , updateAccountDetails)
router.route("/avatar").patch(verifyJWT , upload.single("avatar"),updateUserAvatar)
router.route("/coverImage").patch(verifyJWT , upload.single("coverImage") , updateUserCoverImage)
router.route("/c/:username").get(getUserChannelProfile)
router.route("/history").get(verifyJWT,getWatchHistory)


export default router