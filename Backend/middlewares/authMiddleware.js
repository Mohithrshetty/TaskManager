const jwt= require("jsonwebtoken");
const user= require("../models/User");

// Middleware to protect routes
const protect=async(req,res,next)=>{
    try{
        let token= req.headers.authorization; // Check if the authorization header is present

        if(token && token.startsWith("Bearer")){
            token=token.split(" ")[1];
            const decoded=jwt.verify(token,process.env.JWT_SECRET); // Verify the token using JWT secret
            req.user=await user.findById(decoded.userId).select("-password"); 
// Find the user by ID and exclude password from the result

            next(); // Proceed to the next middleware or route handler
        }else{
            res.status(401).json({message:"Not authorized, no token"}); // If no token, return 401 Unauthorized
        }
    }catch(err){
        res.status(401).json({message:"token Failed",error:err.message});
// If token verification fails, return 401 Unauthorized with error message
    }
      
}



// Middleware for admin only access

const adminOnly=async(req,res,next)=>{
    try{
        if(req.user && req.user.role==="admin"){
            next(); // If user is admin, proceed to the next middleware or route handler
        }else{
            res.status(403).json({message:"Access Denied, admin only"}); // If user is not admin, return 403 Forbidden
        }
    }catch(err){
        res.status(403).json({message:"Not authorized as an admin",error:error.message});
    }
}

module.exports={
    protect,
    adminOnly,
    // Exporting the protect and admin middleware functions for use in other files
}