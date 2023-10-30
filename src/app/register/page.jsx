"use client";

import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";

import "react-phone-input-2/lib/style.css";
import axios from "axios";
import {toast} from "react-hot-toast";
import { RecaptchaVerifier,signInWithPhoneNumber } from "firebase/auth";
import {auth} from '@/firebase/index'
import { useRouter } from "next/navigation";

const initialForm = {
  name: "",
  email: "",
  password: "",
  Cpassword: "",
};

const page = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [ph, setPh] = useState();
  const [formData, setFormData] = useState(initialForm);
  const [isRegistered, setIsRegistered] = useState(false);
  const [msg,setMsg] = useState('Please fill all required fields');
  const [otpData,setOtpData] = useState(null);

  const router = useRouter();
  function isFormValid() {

    if(formData &&
        formData.name &&
        formData.name.trim() !== "" &&
        ph &&
        ph.trim() !== "" &&
        formData.email &&
        formData.email.trim() !== "" &&
        formData.password &&
        formData.password.trim() !== ""&&
        formData.Cpassword &&
        formData.Cpassword.trim() !== ""){
            if(formData.Cpassword === formData.password){
            msg !== 'Everything is good register now.' && setMsg('Everything is good register now.')
            return true;
            }else{
                msg !== 'Passwords are not same.' && setMsg('Passwords are not same.')
                return false;
            }
        }else{
            msg !== 'Please fill all required fields' && setMsg('Please fill all required fields')
            return false;
        }
  }

  const handleRegister = async () => {
    setLoading(true);
    try {

      const {data} = await axios.post('/api/register',{
          ...formData,phone:ph
      })
      console.log(data);
      if(data.success) {
        const phone = '+'+ ph;
        const recaptcha = new RecaptchaVerifier(auth,'recaptcha-container',{});
        // console.log('recapcha===>',phone,recaptcha);
        const confirmation= await signInWithPhoneNumber(auth,phone,recaptcha);
        // console.log('confirmation===>',confirmation);
        setOtpData(confirmation)
        setLoading(false); 
        setIsRegistered(true);
        toast.success(data.message);
      }else{
          toast.error(data.message);
          setLoading(false)
      }       
    } catch (error) {
        console.log(error);
        toast.error(error.message);
        setLoading(false);
    }
  };

  const onOTPVerify = async () => {
    setLoading(true)
    try {
        const otpDataCheck = await otpData.confirm(otp);
        console.log(otpDataCheck);
        const {data} = await axios.post('/api/register?id=new',{
            ...formData,phone:ph
        })
        console.log(data);
        if(data.success) {
            toast.success(data.message);
            setIsRegistered(true);
            setLoading(false);
            router.push('/')
        }else{
            toast.error(data.message);
            setLoading(false)
        }
    } catch (error) {
        console.log(error);
        toast.error(error.message);
        setLoading(false);
    }
  };

  return !isRegistered ? (
    <div className="w-80 md:w-[50%] m-auto bg-gray-700 my-10 p-10 space-y-5 rounded">
        
      <div className="text-2xl text-center -mt-5 text-rose-500">
        <h1>Register Now</h1>
      </div>

      <section className="flex flex-col space-y-4" >
        <div className="flex flex-col  ">
          <label className="text-lg">Your Name</label>
          <input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="text-black rounded p-1  focus:outline-none "
            required
            type="text"
            placeholder="Raja"
          />
        </div>
        <div className="flex flex-col  ">
          <label className="text-lg">Your Email</label>
          <input
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="text-black rounded p-1 focus:outline-none"
            required
            type="email"
            placeholder="raja@gmail.com"
          />
        </div>
        <div className="flex flex-col  ">
          <label className="text-lg">Your Phone No.</label>
          {/* <input className='text-black rounded p-1 focus:outline-none' required type="number" placeholder='99999999999'  /> */}
          <PhoneInput
            className="phoneInput text-black"
            country={"in"}
            value={ph}
            onChange={setPh}
          />
        </div>
        <div className="flex flex-col  ">
          <label className="text-lg">Password</label>
          <input
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="text-black rounded p-1 focus:outline-none"
            required
            type="password"
            placeholder="*******"
          />
        </div>
        <div className="flex flex-col  ">
          <label className="text-lg">Confirm Password</label>
          <input
            value={formData.Cpassword}
            onChange={(e) =>
              setFormData({ ...formData, Cpassword: e.target.value })
            }
            className="text-black rounded p-1 focus:outline-none"
            required
            type="password"
            placeholder="*******"
          />
        </div>

        <div className={`flex flex-col text-sm font-light text-rose-500 text-center`}>
          <p className={`${msg === 'Everything is good register now.' && 'text-green-500' }`}>{msg}</p>
        </div>

        <div className="md:m-auto" id="recaptcha-container"></div>

        <div className="flex flex-col  ">
        
          <button className="disabled:opacity-50 flex bg-rose-500 self-center text-xl rounded px-5 py-2 hover:bg-rose-600" disabled={!isFormValid()} onClick={handleRegister}>
          {loading ?<> <CgSpinner size={20} className="mt-1 animate-spin" /> <span>Sending</span></>:<span>Send OTP</span>}            
          </button>

        </div>
      </section>
    </div>
  ) : (
    <div className="w-80 m-auto bg-gray-700 my-10 p-10 space-y-5 rounded flex flex-col">

     <div className="text-2xl text-center -mt-5 text-rose-500">
        <h1>Verify Now</h1>
        <p className="text-green-400 text-sm font-extralight">OTP send to your input phone number please check message!</p>
      </div>
        
      <div className="bg-white text-rose-500 w-fit mx-auto p-4 rounded-full">
        <BsFillShieldLockFill size={30} />
      </div>
      <label htmlFor="otp" className="font-bold text-xl text-white text-center">
        Enter your OTP
      </label>
      <OtpInput
        value={otp}
        onChange={setOtp}
        OTPLength={6}
        otpType="number"
        disabled={false}
        autoFocus
        className="opt-container "
      ></OtpInput>
      <button
        onClick={onOTPVerify}
        className="bg-rose-500 hover:bg-rose-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
      >
        {loading ?<> <CgSpinner size={20} className="mt-1 animate-spin" /> <span>Verifing</span></>:<span>Verify OTP</span>}
        
      </button>
    </div>
  );
};

export default page;
