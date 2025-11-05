import express from 'express';
import userAuth from '../middleware/userAuth.js';
const profileRouter= express.Router();


profileRouter.get('/profile' , userAuth , async (req, res)=>{
    try{
        const user = req.user;
        res.json({
            message: "Profile data fetched successfully",
            data: user
        })
    
    }catch(err){
        res.status(400).json({
            message:" Not able to fetch profile data",
            error: err.message
        })
    }
})


export default profileRouter;