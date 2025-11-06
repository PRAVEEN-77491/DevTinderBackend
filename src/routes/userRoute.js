import express from 'express';
import connectionRequest from '../models/connectionRequest.js';
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();


userRouter.get("/user/requests/received", userAuth, async (req, res) => {

    try {

        const loggedUser = req.user;
        console.log("Logged in user:", loggedUser);
        //check all the requested of the user with status "interested"
        const receivedRequests = await connectionRequest.find({
            toUserId: loggedUser._id,
            status: "interested"
        }).populate('fromUserId', ["firstName", "lastName", "age", "photoUrl", "about", "skills"]);

        res.json({
            message: "Received requests fetched successfully",
            data: receivedRequests
        })

    } catch (err) {
        return res.status(400).json({
            message: "Error while fetching the received requests",
            error: err.message
        })
    }

})

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedUser = req.user;

        //find all connection where loggeduser is fromUserId or toUserId and status is accepted
        const connections = await connectionRequest.find({
            $or: [
                {
                    fromUserId: loggedUser._id,
                    toUserId: loggedUser._id
                }
            ]
        }).populate('fromUserId toUserId', ["firstName", "lastName", "age", "photoUrl", "about", "skills"]);

        const data = connections.map(res => {
            if (res.fromUserId._id.toString() === loggedUser._id.toString()) {
                return res.toUserId;
            }
            return res.fromUserId;
        })

        res.json({
            message: "Connections fetched successfully",
            data: data
        })

    } catch (err) {
        res.status(400).json({
            message: "Error while getting connections",
            error: err.message
        })
    }
})



export default userRouter;