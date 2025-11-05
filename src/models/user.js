import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    emailId:{
        type: String,
        unique: true,
        required: true,
        trim:true,
        lowercase:true
    },
    password:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    gender:{
        type:String,
        enum:{
            values : ["male", "female", "others"],
            message: "{VALUE} is not valid Gender!"
    }
    },
    photoUrl:{
        type: String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL for photo");
            }
        }
    },
    about:{
        type: String,
        default: "Hey there! I am using our App."
    },
    skills:{
        type:[String]
    }
}, {timestamps: true})


userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id: user._id}, "DEV@TINDER#@#$" ,{expiresIn:"24h"});
    return token;
}

const User = mongoose.model("User", userSchema);

export default User;