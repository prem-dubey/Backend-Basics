//Change the name later to db.js if required or any confusion happens 
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async()=>{
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) // see why do we have to write the two name mainly the second name 
        console.log(`Mongodb connected : DB host ${connectionInstance.connection.host}`)
    }
    catch(error){
        console.log(`Error : ${error}`)
        // throw error;
        process.exit(1); // there are different types of method for exit learn more 
    }
}

export default connectDb; // remember to write default 
