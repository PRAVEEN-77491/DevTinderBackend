import mongoose from 'mongoose';

const ConnectionRequest =  new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required :true,
        ref : "User"
    },
    toUserId :{
        type: mongoose.Schema.Types.ObjectId,
        required :true,
        ref : "User"
    },
    status:{
        type: String,
        enum : {
            values : ['ignored', 'interested', 'accepted', 'rejected'],
            message : "{VALUE} is not valid status"
        }
    }

}, {timestamps: true})

ConnectionRequest.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

const connectionRequest = mongoose.model("ConnectionRequest", ConnectionRequest);

export default connectionRequest;