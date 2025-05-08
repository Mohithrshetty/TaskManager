const mongoose= require("mongoose");

const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    ProfileImageUrl:{
        type:String,
        default:null,
       
    },
    role:{
        type:String,
        enum:["admin","member"],
        default:"member",// role based access
    },

},

   { timestamps:true}

);

module.exports=mongoose.model("User",userSchema);