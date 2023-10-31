import { NextResponse } from "next/server";
import User from "../../../models/user";
import connectDB from '@/database/index'
import  jwt  from "jsonwebtoken";
import { compare } from "bcryptjs";

import validator from "validator";

export const POST = async (req) => {
  const id = req.url.split("?")[1] || "phone";

  // const url = new URL(req.url);
  // const searchParams = new URLSearchParams(url.search);
  // console.log(searchParams.get("id"));

    const { userId, password } = await req.json();

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

  if (id.split("=")[1] !== "otp") {

    if (!password) {
        return NextResponse.json({
          status: 404,
          success: false,
          message: "please fill all the required fields",
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

    if (id.split("=")[1] === "otp") {
        return NextResponse.json({
            status: 200,
            success: true,
            message: 'OTP send successfully.',
            phone : '+'+ isExistUser.phone,
        });
    }else{
      const checkPassword = await compare(password,isExistUser.password);
        

        if(!checkPassword){
            return NextResponse.json({
                status: 400,
                success: false,
                message: "Please check your password and try again.",
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
            isExistUser,cookie
        });
    }

    

      
    
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: 404,
      success: false,
      message: "there was an error " + error.message,
    });
  }
};


