import { NextResponse } from "next/server";
import connectDB from "../../../database";
import User from '../../../models/user'

import validator from "validator";


export const POST = async(req)=>{


    const id = req.url.split('?')[1] || 'no id';

    // console.log(req.url.split('?')[1])

//   console.log('id========>', typeof id.split('=')[1] );

  

    const {name,email,phone,password} = await req.json();

    // console.log(name,email,phone,password)

    if(!name || !email || !phone || !password){
        return NextResponse.json({
            status: 404,
            success : false,
            message : 'please fill all the required fields'
        })
    }
    if(!validator.isEmail(email)){
        return NextResponse.json({
            status: 404,
            success : false,
            message : 'Please enter a vailid email addresss.'
        })
    }

    if(phone.length <= 9){
        return NextResponse.json({
            status: 404,
            success : false,
            message : 'Please enter a vailid phone number addresss.'
        }) 
    }

    if(password.length <= 5){
        return NextResponse.json({
            status: 404,
            success : false,
            message : 'Your password must be at least 6 characters.'
        })
    }

    
    try {
        await connectDB();
        const isExistEmail = await User.findOne({ email });
        const isExistPhone = await User.findOne({ phone });

        if(isExistEmail || isExistPhone) {
            return NextResponse.json({
                status: 404,
                success:false,
                message : 'You are already a user please login'
            });
        }

        if(id.split('=')[1] === 'new'){
            const NewUser = await User.create({
                name,email,password,phone
            })
    
            return NextResponse.json({
                status: 201,
                success: true,
                message : 'Your are registered successfully!',
                NewUser
            })
        }else{
            return NextResponse.json({
                status: 200,
                success:true,
                message : 'OTP send successfully.'
            });
        }

        
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            status: 404,
            success:false,
            message : 'there was an error'+ error.message
        });
    }
}