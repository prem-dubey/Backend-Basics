class ApiError extends Error {
    //here we want to customoze our own error 
    constructor(
        statuscode ,
        message = "Something Went Wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statuscode = statuscode
        this.data = null 
        this.message = message
        this.sucess = false
        this.error = errors

        if(stack) {
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}