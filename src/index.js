
// require("dotenv").config({path:'./env'}) (hinders consistency of the code)

import dotenv from 'dotenv' //remember we have to change our script to use it with this method 
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDb from "./db/index.js";
import { app } from './app.js';

dotenv.config({ //always remember to config dotenv using this method 
    path:'./env'
})

connectDb() // connecting the db and it returns a promise
.then(()=>{
    //to make check whether the conncetion between database and express was sucessful we do this 
    app.on("error",(error)=>{ // sometimes there are someissues between express and database talking to check that we need this line
            console.log(`ERROR : ${error}`);
            throw error;
    })

    // app is listening 
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running on ${process.env.PORT || 8000}`)
    })
})
.catch((err)=>{
    console.log(`Error connection failed : ${err}`);
})



/*
//Below we have written the datanase connection in single index.js next we will make a seperate folder for it 

import express from "express"
const app = express();

// Making an IIFE function 
;(async ()=>{
    try{
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) //see why do we have to write DB_NAME
        app.on("error",(error)=>{ // sometimes there are someissues between express and database talking to check that we need this line
            console.log(`ERROR : ${error}`);
            throw error;
        })
        app.listen(process.env.PORT,()=>{
            console.log(`Port Listening on ${process.env.PORT}`);
        })
    }
    catch(error){
        console.log(error);
        throw error; //check if err or error or anything 
    }
})();

*/