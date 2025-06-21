import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken'

const generateAcessAndRefreshToken = async (user_id) => {
    try {
        const user = await User.findById(user_id)
        const acessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        //Adding the value to the database 
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})
        return {acessToken , refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something Went wrong while generating acess token")
    }
}

const registerUser = asyncHandler(async (req , res)=>{
    //get details from the frontend 
    //validation of the details  (check if user already exists or not using username and email)
    //Uploading the image to cloudinary and get the url , avatar = check  ,
    //create user object - create entry in db 
    //remove password and refresh token field from response 
    //check for user creation and then return the user details 
    const {username , fullName , email , password } = req.body 
    if( //validating if anything is empty 
        fullName == "" || email == "" || username == "" || password == ""
    ){
        throw new ApiError(400,"All fields are required")
    }
    //checking if the user already exists or not 
    // const existingUser = User.findOne({username})  //a method to find 
    const existingUser = await User.findOne({
        $or: [{username},{email}] //this is a special operator to check for both using the findOne
    })
    if(existingUser){
        throw new ApiError(409,"User with Email or Username already exists")
    }
    //finding the local path to storage uploaded using multer 
    const avatarLocalPath = req.files?.avatar[0]?.path 
    // const coverImageLocalPath = req.files?.coverImage[0]?.path //sometimes this might not work 
    let coverImageLocalPath 
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.size > 0){
        coverImageLocalPath = req.files.coverImage
    }

    //checking if avatar is uploaded or not
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar File is Required")
    }

    //uploading it on cloudinary and getting the link 
    const avatarLink = await uploadOnCloudinary(avatarLocalPath)
    const coverImageLink = await uploadOnCloudinary(coverImageLocalPath)

    //check again for avatar otherwise it will cause trouble 
    if(!avatarLink){
        throw new ApiError(400,"Avatar Link not found")
    }

    const user = await User.create({
        fullName,
        email,
        username : username.toLowerCase(),
        password,
        avatar : avatarLink.url,
        coverImage : coverImageLink?.url || ""
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }

    //Sending the response 
    return res.status(201).json(new ApiResponse(201,createdUser,"User Data Response",))

})

const loginUser = asyncHandler(async (req,res)=>{
    //req.body => data 
    //Check if the user exists then check for the password give captcha or otp (don't know how)
    //If user does not exist then ask him to register go on registration page 
    //Generate a fresh access token and a fresh refresh token when logged in
    //Store the acess and refresh token into the database and after the expiry of the acess token check for refresh token if they match generate new acess token 
    //Send secure cookie of token 
    const {username , email , password} = req.body
    if(!username && !email){
        throw new ApiError(400,"Enter Username Or Email")
    }
    const user = await User.findOne({
        $or : [{username},{email}]
    })
 
    if(!user){ //checking if the password is correct 
        throw new ApiError(400,"User does not exist")
    }
    
    //all of the function are with the instance of the small user 
    const correctPass = await user.isPasswordCorrect(password)
    if(!correctPass){ //checking if the password is correct 
        throw new ApiError(401,"Invalid User Credentials")
    }

    const {acessToken , refreshToken} = await generateAcessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly : true,
        secure : true
    }
    
    return res
    .status(201)
    .cookie("acessToken",acessToken,options)
    .cookie("refreshTooken",refreshToken)
    .json(
        new ApiResponse(200,
            {
                user:loggedInUser,acessToken , refreshToken
            },
            "User LoggedIn Sucessfully"
        )
    )

})

const logoutUser = asyncHandler(async (req , res)=>{
    await User.findByIdAndUpdate(req.user._id,
        {
            $set : {refreshToken:undefined}
        }
    )

     const options = {
        httpOnly : true,
        secure : true
    }

    res
    .status(200)
    .clearCookie("acessToken" , options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Logged Out Sucessfully"))
})

const refreshAccessToken = asyncHandler(async (req,res)=>{
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized request : Invalid Incoming Refresh Token Received")
    }

try {
        const incomingDecodedToken = await jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(incomingDecodedToken._id)
        if(!user){
            throw new ApiError(401,"Invalid Refresh Token")
        }
        if(incomingDecodedToken !== user.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used")
        }
    
        const options = {
            httpOnly : true,
            secure : true
        }
    
        const {accessToken , newRefreshToken} = await generateAcessAndRefreshToken(user._id)
    
        return res
        .status(200)
        .cookie("acessToken",accessToken)
        .cookie("refreshToken",newRefreshToken)
        .json(new ApiResponse(200,{acessToken,refreshToken:newRefreshToken},"Access Token Refreshed Sucessfully"))
} catch (error) {
    throw new ApiError(401,error?.message || "Invalid refresh token")
}
})

const changeCurrentPassword = asyncHandler(async (req,res)=>{ //apply auth middleware please 
    //check email or username and password if not loggedin
    //otherwise take old password and new password 
    const {oldPassword , newPassword} = req.body //taking the passwords 
    const user = await User.findById(req.user._id) 
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(400,"Old Password is incorrect")
    }
    user.password = newPassword
    await user.save({validateBeforeSave:false}) 

    return res.status(200).json(new ApiResponse(200,{},"Password changed sucessfully"))
})

const getCurrentUser = asyncHandler(async (req,res)=>{ //apply verifyjwt as middleware please
    return res.status(200).json(new ApiResponse(200,req.user,"Current user information sucess"))
})

const updateAccountDetails = asyncHandler(async (req,res)=>{
    const {fullName , email } = req.body 
    //if you want to change the photo make seperate endpoint
    if (!fullName || !email) {
        throw new ApiError(401,"All Fields are required")
    }
    const user = await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            email,
            fullName
        }
    },{new:true}).select("-password -refreshToken")

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Account Details Updated"))

})

const updateUserAvatar = asyncHandler(async (req,res)=>{ //we have to hit two middle wares remember
    const avatarLocalPath = req.file?.path 
    if(!avatarLocalPath){
        throw new ApiError(401,"Avatar Local Path not fetched for update")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if(!avatar){
        throw new ApiError(401,"Avatar Uploading Error during the update")
    }
    const user = await User.findByIdAndUpdate(req.user._id,{$set:{avatar}},{new:true}).select("-password -refreshToken")
    return res
    .status(200)
    .json(new ApiResponse(200,user,"Avatar Changed Successfully"))
})

const updateUserCoverImage = asyncHandler(async (req,res)=>{ //we have to hit two middle wares remember
    const coverImageLocalPath = req.file?.path 
    if(!coverImageLocalPath){
        throw new ApiError(401,"coverImage Local Path not fetched for update")
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!coverImage){
        throw new ApiError(401,"coverImage Uploading Error during the update")
    }
    const user = await User.findByIdAndUpdate(req.user._id,{$set:{coverImage}},{new:true}).select("-password -refreshToken")
    return res
    .status(200)
    .json(new ApiResponse(200,user,"coverImage Changed Successfully"))


})




export {registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage}