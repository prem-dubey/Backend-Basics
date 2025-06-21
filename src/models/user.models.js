import mongoose , {Schema} from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'



const userSchema = new Schema({
    username : {
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        index:true
    },
    email: {
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
    },
    fullName: {
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String, //cloudinary url
        required:true
    },
    coverImage:{
        type:String, //cloudinary url
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,"Password is required "]
    },
    //Password and Token things are a bit left to do 
    refreshToken:{
        type:String,

    }
    
},{timestamps:true})

//Encrypting the password just before going into the database
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next(); //checks if password is changed or not if not changed then no need to encrypt 

    this.password = await bcrypt.hash(this.password , 10)
    next() // passing the flag don't forget 
})

//Checking is the password is correct or not 
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password,this.password)
}

//generating the acess token and refresh token to allow access to data
userSchema.methods.generateAccessToken = function (){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        fullname:this.fullname,
        username : this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

userSchema.methods.generateRefreshToken = function(){ //remember it's methods not method 
    return jwt.sign({
        _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User = mongoose.model("User",userSchema)