import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },

    password:{
        type:String,
        required:true
    },

    role:{
        type:String,
        enum:["Admin","Operator","Auditor"],
        default:"Operator"
    },

    department:String,

    active:{
        type:Boolean,
        default:true
    },

    emailVerified:{
        type:Boolean,
        default:false
    },

    failedLoginAttempts:{
        type:Number,
        default:0
    },

    lockUntil:{
        type:Date
    },

    refreshToken:{
        type:String
    },

    lastLogin:Date
},
{
    timestamps:true
}
);

export default mongoose.model("User",userSchema);