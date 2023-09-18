'use client'
import { closeModal } from "@/redux/modal/modalSlice";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/user/userSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

export default function UserOptions(){
    const dispatch = useDispatch();
    const router = useRouter();
    const token = useSelector((state:RootState)=>state.user.token)
    
    const logoutUser = async()=>{
        
        axios.post("http://localhost:8080/user/logout",{
            headers : {
                Authorization : `Bearer ${token}`
            }
        })
        .then(()=>console.log("Logged out"))
        .catch(err => console.log(err))
        
        dispatch(logout())
        dispatch(closeModal())
        router.push("/")        
    }

    return(
        <div className="min-w-[200px] w-full flex flex-col h-[100px] p-5 justify-center items-center gap-6">
            <button className="bg-red-400 w-full rounded-md pt-3 pb-3" onClick={logoutUser}>
                Logout
            </button>          
        </div>
    )
}