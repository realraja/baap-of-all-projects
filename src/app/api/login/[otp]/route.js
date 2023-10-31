import { NextResponse } from "next/server";
import connectDB from "@/database/index";

import validator from "validator";
import User from "@/models/user";
import  jwt  from "jsonwebtoken";

export const POST = async (req,{params}) => {

    const otp = params.otp;

    const { userId } = await req.json();

    // console.log(userId, password);
    if (!userId ) {
        return NextResponse.json({
          status: 404,
          success: false,
          message: "please fill all the required fields",
        });
      }

      if (isNaN(userId*1)) {
        if (!validator.isEmail(userId)) {
          return NextResponse.json({
            status: 404,
            success: false,
            message: "Please enter a vailid email addresss.",
          });
        }
        
      } else {
        if (userId.length != 12) {
          return NextResponse.json({
            status: 404,
            success: false,
            message: "Please enter a vailid phone number.",
          });
        }
      }
  // console.log(userId)
  try {
    await connectDB();
    let isExistUser;
    if(isNaN(userId*1)){
        isExistUser = await User.findOne({ email:userId });
    }else{
        isExistUser = await User.findOne({ phone:userId });
    }



    if (!isExistUser) {
      return NextResponse.json({
        status: 404,
        success: false,
        message: "You are not a user please Register",
      });
    }

           const cookie =  await jwt.sign({_id: isExistUser?._id},process.env.JWT_PASS);
           isExistUser.friends.user1 = isExistUser.friends.user2;
           isExistUser.friends.user2 = cookie;
            await isExistUser.save();
    
        return NextResponse.json({
            status: 200,
            success: true,
            message: 'user has been logged in successfully',
            otp,cookie,
            isExistUser,
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


