import mongoose from "mongoose";


const connectDB = async()=>{
    await mongoose.connect(
    "mongodb+srv://NamastePraveen:RmplCt0IKTlURkV2@namstertindercluster.sgngdng.mongodb.net/devTinder"
)
}



export default connectDB;