import express from 'express';
import connectDB from './config/database.js';
import User from './models/user.js'; 
import authRouter from './routes/authRoute.js';
import profileRouter from './routes/profileRoute.js';
import cookieParser from 'cookie-parser';
import connectionRequestRouter from './routes/connectionRequestRoute.js';


const app = express();




//middlewares
app.use(express.json()); //to parse json request body
app.use(cookieParser())
app.use('/', authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);


app.get("/user", async (req, res) => {
    const email = req.body.emailId;
    try{
        const user = await User.findOne({emailId : email})
        if(!user){
            return res.status(404).json({
                message: "User not found"
            })
        }
        return res.json({
            message: "User fetched successfully",
            data: user
        })
    }catch(err){
        return res.status(500).json({
            message: "Error while fetching the user",
            error: err.message
        })
    }
})

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







