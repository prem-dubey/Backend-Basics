import express from "express";
import cors from 'cors';
import cookieParser from 'cookie-parser'; // see documentation for more 


const app = express()
// app.use(cors()) // usually this much is enough 
app.use(cors({ // see documentation for more in cors 
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"})) //making express ready to receive the json file 
app.use(express.urlencoded({extended:true , limit:"16kb"})) // for taking url and decoding it 
app.use(express.static("public")) // to save static files 
app.use(cookieParser()) //used for excessing cookies from user and also set cookies means we gave cookies acess to request 

//routes import 
import userRouter from './routes/user.routes.js'


//routes declaration 
app.use("/api/v1/users",userRouter) //this passes the control to user.routes.js file and /user is a prefix 






export {app}; // this is also a method to export 