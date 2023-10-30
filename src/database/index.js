import mongoose from "mongoose";


const connectDB = async() =>{
    const mongoUrl = 'mongodb+srv://realllraja0:PJfrderdIKFIBevQ@cluster0.qxoyqkr.mongodb.net/'

    try{
        const connection = await mongoose.connect(mongoUrl);
        // console.log("MongoDB Connected",connection)
    }catch(err){
        console.log('error=>',err)
    }
}

export default connectDB;