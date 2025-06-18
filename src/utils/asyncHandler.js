//Using this we don't have to put everything in the try catch or promised 
//this is a method of Promise both are used in production grade code 
const asyncHandler = (requestHandler)=>{
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).catch((error)=>next(error))
    }
}




// const asyncHandler = (func)=>{};
// const asyncHandler = (func) => {()=>{}}; // a function inside a fucntion 

//this is a method of try and catch
// const asyncHandler = (fn) => async (req , res , next)=> { // fn stands for function
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             sucess : false,
//             message : error.message
//         })
//     }
// } 



export {asyncHandler}