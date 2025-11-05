
import User from "../models/user.js";
import jwt from "jsonwebtoken";

const userAuth = async(req,res ,next)=>{
try {
    //Read token
    const cookie = req.cookies;
    const{token} = cookie
    if(!token){
        return res.status(401).json({
            message: "Unauthorized access , token missing"
        })
    }

    //verfiy token
    const decodedData = await jwt.verify(token, "DEV@TINDER#@#$");
    //extract data from token
    const {_id} = decodedData;
   
    const user = await User.findById(_id);
    if(!user){
        return res.status(401).json({
            message: "Unauthorized access , user not found"
        })}
        req.user = user;
        next();
    }catch(err){
        return res.status(500).json({
            message: "Error while logging in the user",
            error: err.message
        })
    }   

}

export default userAuth;