import mongoose from 'mongoose';

const ConnectionRequest =  new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        index :true,
    },
    toUserId :{
        type: mongoose.Schema.Types.ObjectId,
        index :true,
    },
    status:{
        type: String,
        enum : {
            values : ['ignored', 'interested', 'accepted', 'rejected'],
            message : "{VALUE} is not valid status"
        }
    }

}, {timestamps: true})

const connectionRequest = mongoose.model("ConnectionRequest", ConnectionRequest);

export default connectionRequest;