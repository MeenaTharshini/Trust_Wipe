import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    email:{
        type:String,
        unique:true,
        required:true
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

    lastLogin:Date,

    active:{
        type:Boolean,
        default:true
    }

},{
    timestamps:true
})

export default mongoose.model("User", userSchema);