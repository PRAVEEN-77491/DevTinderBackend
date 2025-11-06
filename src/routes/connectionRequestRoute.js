import express from 'express';
const connectionRequestRouter= express.Router();
import userAuth from '../middleware/userAuth.js';
import User from '../models/user.js';
import connectionRequest from '../models/connectionRequest.js';
import mongoose from 'mongoose';



connectionRequestRouter.post('/connection-request/:status/:toUserId', userAuth, async (req, res) => {
    try{

        const fromUserId = req.user._id;
        const toUserId  = req.params.toUserId;
        const status = req.params.status; 

        //allowed status
        const allowedStatus = ["ignored", "interested"];

        const isAllowed = allowedStatus.includes(status);
        if(!isAllowed){
            return res.status(400).json({
                message: "Invalid status value"
            })
        }


        // Validate toUserId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(toUserId)) {
            return res.status(400).json({
                message: "Invalid user id format"
            });
        }

        //check if toUserId exists
        const istoUserExists = await User.findById(toUserId);
        if(!istoUserExists){
            return res.status(404).json({
                message: "User not found with id " + toUserId
            })
        }


        //check if connection request already sent

        // this $or check if there is already a request between the two users in either direction
        const existingRequest = await connectionRequest.findOne({
            $or:[
                { fromUserId: fromUserId, toUserId: toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if(existingRequest){
            return res.status(400).json({
                message: "Connection request already exists between these users"
            })
        }

        const newConnectionRequest= new connectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const saveReuest = await newConnectionRequest.save();

        res.json({
            message: "Connection request sent successfully",
            data: saveReuest
        })



    }catch(err){
        res.status(400).json({
            message: "Error while sending connection request",
            error: err.message
        })
    }
})

connectionRequestRouter.post('/review-request/:status/:requestedId', userAuth, async (req, res)=>{
    try{
        const loggedInUser = req.user;
        const {status,requestedId} = req.params;

        //check if the status is valid
        const allowedStatus = ["accepted" ,"rejected"];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message: "Invalid status!!"
            })
        }

        //check if requestedId is valid
        if(!mongoose.Types.ObjectId.isValid(requestedId)){
            return res.status(400).json({
                message: "Invalid user id format"
            });
        }

        //check if connection request is there
        const ConnectionRequest = await connectionRequest.findOne({
            _id : requestedId,
            toUserId: loggedInUser._id,
            status: "interested"
        })
        if(!ConnectionRequest){
            return res.status(404).json({
                message: "No connection request found to review"
            })
        }

        ConnectionRequest.status = status;
        const reviewData = await ConnectionRequest.save();

        res.json({
            message: "Connection request reviewed successfully",
            data: reviewData
        })


    }catch(err){
        res.status(400).json({
            message: "Erroe while reviewing connection request",
            error: err.message
        })
    }
})

export default connectionRequestRouter;