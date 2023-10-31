"use client";

import React, { useState,useContext } from "react";
import { CgSpinner } from "react-icons/cg";
import OtpInput from "otp-input-react";

import "react-phone-input-2/lib/style.css";
import axios from "axios";
import { toast } from "react-hot-toast";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/firebase/index";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { GlobalContext } from "@/context";

const page = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [isPassword, setIsPassword] = useState(false);
  const [isOtp, setIsOtp] = useState(false);
  const [otpData, setOtpData] = useState(null);
  const [phoneNo, setPhoneNo] = useState();

  const {fetchAuthUserData} = useContext(GlobalContext);
  const router = useRouter();

  function isIdValid() {
    if (id && id.trim() !== "") {
      return true;
    }
    return false;
  }
  function isFormValid() {
    if (id && id.trim() !== "") {
        if(password.trim() !== "" || otp.length == 6){ return true;}else{ return false}
    }
    return false;
  }

  const handleSendOtp = async()=>{    
    setLoading(true);
    try {

      const {data} = await axios.post('/api/login?id=otp',{
        userId:isNaN(id*1)?id:`91${id}`
      })
      console.log(data);
      if(data.success) {
        const recaptcha = new RecaptchaVerifier(auth,'recaptcha-container',{});
        // console.log('recapcha===>',phone,recaptcha);
        const confirmation= await signInWithPhoneNumber(auth,data.phone,recaptcha);
        // console.log('confirmation===>',confirmation);
        setOtpData(confirmation)
        
        setPhoneNo(data.phone);
        setLoading(false);
        toast.success(data.message);
        setIsOtp(true);
      }else{
          toast.error(data.message);
          setLoading(false)
      }
    } catch (error) {
        console.log(error);
        toast.error(error.message);
        setLoading(false);
    }
  }

  const handleLogin = async () => {
    setLoading(true);
    try {

      const {data} = await axios.post('/api/login?id=pass',{
        userId:isNaN(id*1)?id:`91${id}`
          ,password
      })
      console.log(data);
      if(data.success) {
        setLoading(false);
        toast.success(data.message);            
        Cookies.set("token", data.cookie,{ expires: 365 });
        fetchAuthUserData()
        router.push("/");
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
    setLoading(true);
    try {
      const otpDataCheck = await otpData.confirm(otp);
      console.log(otpDataCheck);
      const { data } = await axios.post(`/api/login/${otp}`, {
        userId:isNaN(id*1)?id:`91${id}`
      });
      console.log(data);
      if (data.success) {
        toast.success(data.message);
        setLoading(false);            
        Cookies.set("token", data.cookie,{ expires: 365 });
        fetchAuthUserData();
        router.push("/");
      } else {
        toast.error(data.message);
        setLoading(false);
      }
    } catch (error) {
    //   console.log(error);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="w-80 md:w-[50%] m-auto bg-gray-700 my-10 p-10 space-y-5 rounded">
      <div className="text-2xl text-center -mt-5 text-rose-500">
        <h1>LogIn Now</h1>
      </div>

      <section className="flex flex-col space-y-4">
        <div className="flex flex-col  ">
          <label className="text-lg">Your Email/Phone No.</label>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="text-black rounded p-1 focus:outline-none"
            required
            type="text"
          />
        </div>

        {isPassword ? (
          <>
            <div className="flex flex-col  ">
              <label className="text-lg">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-black rounded p-1 focus:outline-none"
                required
                type="password"
                placeholder="*******"
              />
            </div>

            <div className="flex flex-col  ">
              <button
                className="disabled:opacity-50 flex bg-rose-500 self-center text-xl rounded px-5 py-2 hover:bg-rose-600"
                disabled={!isFormValid()}
                onClick={handleLogin}
              >
                {loading ? (
                  <>
                    {" "}
                    <CgSpinner size={20} className="mt-1 animate-spin" />{" "}
                    <span>Verifing</span>
                  </>
                ) : (
                  <span>Verify Now</span>
                )}
              </button>
            </div>
          </>
        ) : null}

        {isOtp ? (
          <>
            <div className="flex flex-col  ">
              <label htmlFor="otp" className="font-bold text-xl text-white">
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
            </div>

            <div
              className={`flex flex-col text-sm font-light text-green-500 text-center`}
            >
              <p>OTP sented on your number {phoneNo.slice(0,8)}*****</p>
            </div>

            <div>
              <button
                onClick={onOTPVerify}
                className="disabled:opacity-50 bg-rose-500 hover:bg-rose-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                disabled={!isFormValid()}
              >
                {loading ? (
                  <>
                    {" "}
                    <CgSpinner size={20} className="mt-1 animate-spin" />{" "}
                    <span>Verifing</span>
                  </>
                ) : (
                  <span>Verify OTP</span>
                )}
              </button>
            </div>
          </>
        ) : null}

        

        {!isPassword && !isOtp ? (
          <>
          <div className="md:m-auto" id="recaptcha-container"></div>
            <div className="flex flex-col  ">
              <button
                className="disabled:opacity-50 flex bg-rose-500 self-center text-xl rounded px-5 py-2 hover:bg-rose-600"
                disabled={!isIdValid()}
                onClick={handleSendOtp}
              >
                {loading ? (
                  <>
                    {" "}
                    <CgSpinner size={20} className="mt-1 animate-spin" />{" "}
                    <span>Sending</span>
                  </>
                ) : (
                  <span>Send OTP</span>
                )}
              </button>
            </div>

            <div
              className={`flex flex-col text-sm font-light text-rose-500 text-center`}
            >
              <p>OR</p>
            </div>

            <div className="flex flex-col  ">
              <button
                className="flex bg-rose-500 self-center text-xl rounded px-5 py-2 hover:bg-rose-600"
                onClick={() => setIsPassword(true)}
              >
                <span>Enter Password</span>
              </button>
            </div>
          </>
        ) : null}
      </section>
    </div>
  );
};

export default page;
