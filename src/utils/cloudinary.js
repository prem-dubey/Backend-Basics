import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (file_path) => {
    try {
        if(!file_path) return null;
        //upload the file on cloudinary 
        const response = await cloudinary.uploader.upload(file_path,{
           resource_type:"auto", 
        })
        //file has been uploaded sucessfully 
        console.log("file is uploaded on cloudinary",response.url)
        fs.unlinkSync(file_path)
        return response

    } catch (error) {
        fs.unlinkSync(file_path)
        //removes the locally saved temporary file as operation failed 
        console.log(`Error on uploading cloudinary file ${error}`)
    }
}

export {uploadOnCloudinary}
