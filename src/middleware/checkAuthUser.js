import axios from "axios"


export const AuthUser = async(token) =>{
    const {data} = await axios.post('/api/login/checkuser',{
        token
    })

    if(data.success){
        return true;
    }

    return false;
}