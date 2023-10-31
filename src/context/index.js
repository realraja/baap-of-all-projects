'use client'

import axios from "axios"
import Cookies from "js-cookie"
import { useCallback, createContext, useState,useEffect } from "react"


export const GlobalContext = createContext()

export default function GlobalState({children}){
    const [isAuthUser,setIsAuthUser] = useState()
    const [token,setToken] = useState()


    // console.log(token)
    const fetchAuthUserData = useCallback(async() =>{
        const tokken = Cookies.get('token');
        
        if(tokken !== undefined){
            setToken(tokken) 
            axios.post('/api/login/checkuser',{
                token:tokken
            })
            .then(function (response) {                
                setIsAuthUser(response.data.success);
            })
            .catch(function (error) {
                console.log(error);
                setIsAuthUser(false);
            })


        }else{
            setIsAuthUser(false);
        }
    },[setIsAuthUser])

    useEffect(()=>{        
       fetchAuthUserData();
    },[isAuthUser,Cookies])
    return(
        <GlobalContext.Provider value={{fetchAuthUserData,isAuthUser,token}}>
            {children}
        </GlobalContext.Provider>
    )
}