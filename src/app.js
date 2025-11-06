import express from 'express';
import connectDB from './config/database.js';
import User from './models/user.js'; 
import authRouter from './routes/authRoute.js';
import profileRouter from './routes/profileRoute.js';
import cookieParser from 'cookie-parser';
import connectionRequestRouter from './routes/connectionRequestRoute.js';
import userRouter from './routes/userRoute.js';


const app = express();




//middlewares
app.use(express.json()); //to parse json request body
app.use(cookieParser())
app.use('/', authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);
app.use("/", userRouter);




app.get("/feed", async(req,res)=>{

    try{
        const users = await User.find({});  
        return res.json({
            message: "Feed fetched successfully",
            data: users
        })
    }catch(err){
        return res.status(500).json({ 
            message: "Error while fetching the feed",
            error: err.message
         })
    }

})







connectDB().then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
        console.log('Server is running on port 7777');
    })
})







