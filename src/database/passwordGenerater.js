import mongoose from "mongoose";


const connectDB = async() =>{

    try{
        const {connection} = await mongoose.connect(process.env.MONGO_DB_URL,{
            dbName: 'passwordGenerator',
        });
        console.log("MongoDB Connected",connection.host)
    }catch(err){
        console.log('error=>',err)
    }
}

export default connectDB;