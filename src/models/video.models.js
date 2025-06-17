import mongoose,{Schema} from "mongoose";
import mongooseAggregatePaginate from 'mongooseAggregatePaginate'

const videoSchema = new Schema({
    videoFile:{
        type:String, //cloudinary file 
        required : true,
    },
    thumnail:{
        type:String, //cloufdinary url
        required:true
    },
    title:{
        type:String, 
        required:true
    },
    description:{
        type:String, 
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    views : {
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:trusted,
    },
    owner : {
        type:Schema.Types.ObjectId,
        ref:"User"
    },

},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema);