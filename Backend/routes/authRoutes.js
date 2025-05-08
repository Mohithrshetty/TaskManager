const express= require("express");
const {registerUser,loginUser,getUserProfile,updateUserProfile}= require("../controllers/authController"); //importing the auth controller functions
const {protect}= require("../middlewares/authMiddleware"); //importing the protect middleware for authentication
const upload= require("../middlewares/uploadMiddleware"); //importing the upload middleware for image upload

const router= express.Router();

//auth Routes

router.post("/register",registerUser); //register user

router.post("/login",loginUser); //login user

router.get("/profile",protect,getUserProfile); //get user profile

router.put("/profile",protect,updateUserProfile); //update user profile


router.post("/upload-image",upload.single("image"),(req,res)=>{   
    if(!req.file){
        return res.status(400).json({message:"No file uploaded"}); // If no file uploaded, return 400 Bad Request
    }
    const imageUrl=`${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`; // Construct the image URL using the request protocol and host
    res.status(200).json({imageUrl}); // Return the image URL in the response
})


module.exports=router; //exporting the router