'use client'
import { GlobalContext } from '@/context'
import Link from 'next/link'
import React, { useContext, useState } from 'react'
import Cookies from "js-cookie"
import axios from "axios"
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import ConfirmButton from './ConfirmButton'

const Navbar = () => {

  const [confirmState,setConfirmState] = useState(false);


  const {isAuthUser,token,fetchAuthUserData} = useContext(GlobalContext);
  const router = useRouter();

  const LogOut = async() =>{
      Cookies.remove("token");

      const {data} = await axios.post('/api/logout',{
          token
      })

      if(data.success){
        toast.success(data.message);
      }
      fetchAuthUserData();
    
    
}

  return (<>
    <nav className='flex justify-between px-5 py-3 text-2xl bg-gray-600'>
      <div><h1 className='text-rose-500'>Test.App</h1></div>

      <div className='space-x-2 font-sans'>
        <Link className='hover:bg-gray-900 p-[10px]' href="/">Home</Link>
        {!isAuthUser?<>
          <Link className='hover:bg-gray-900 p-[10px]' href="/register">Sign In</Link>
        <Link className='hover:bg-gray-900 p-[10px]' href="/login">Log In</Link>
        </>:<Link className='hover:bg-gray-900 p-[10px]' href={'#'} onClick={()=> setConfirmState(true)}>LogOut</Link>
        }
        
      </div>
    </nav>
    <ConfirmButton buttonText={'LogOut Now'} comfirmState={confirmState} setComfirmState={setConfirmState} runFunction={LogOut} />
    </>
  )
}

export default Navbar
