import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
            trim:true
        },
        phone:{
            type:String,
            trim:true,
            default:"",
        },
        address:{
            type:String,
            trim:true,
            default:"",
        },
        role:{
            type:String,
            enum: ['customer', 'agent', 'admin'],
            default: 'customer',
        },
    },
    {
        timestamps:true,
    },
);

const User = mongoose.model("User", userSchema);
export default User;