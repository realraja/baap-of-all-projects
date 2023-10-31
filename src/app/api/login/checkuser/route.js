import { NextResponse } from "next/server";
import User from "@/models/user";
import connectDB from '@/database/index'
import  jwt  from "jsonwebtoken";

export const POST = async (req) => {

    const { token } = await req.json();
    if (!token ) {
        return NextResponse.json({
          status: 404,
          success: false,
          message: "please fill all the required fields",
        });
      }

      
      let tokenData = jwt.verify(token,process.env.JWT_PASS);

    //  console.log(tokenData);

  try {
    await connectDB();

    const isExistUser = await User.findById(tokenData._id)
    

    if (!isExistUser) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "You are not a user please Login",
      });
    }

    if(isExistUser?.friends.user1 === token || isExistUser.friends?.user2 === token){
        return NextResponse.json({
            status: 200,
            success: true,
            message: 'user is vailid',
            isExistUser
        });
    }


    
        return NextResponse.json({
            status: 400,
            success: false,
            message: 'user is already Logged Out',
        });
    

    

      
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 404,
      success: false,
      message: "there was an error " + error.message,
    });
  }
};


