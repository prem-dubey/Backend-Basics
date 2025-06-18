import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) { //we use multer to gain access to this file option here other then the json data coming from req  
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) //used to give file a unique name not needed now 
    cb(null,file.originalname) //not a good method but for temporary storage it's fine 
  }
})

export const upload = multer({ storage: storage }) //see the storage is the name of storage variable 