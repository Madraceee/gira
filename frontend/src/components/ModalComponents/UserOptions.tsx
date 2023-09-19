'use client'
import { closeModal, openModal } from "@/redux/modal/modalSlice";
import { RootState } from "@/redux/store";
import { logout } from "@/redux/user/userSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import DisableDeleteAcc from "./DisableDeleteAcc";

export default function UserOptions(){
    const dispatch = useDispatch();
    const router = useRouter();
    const token = useSelector((state:RootState)=>state.user.token)
    
    const logoutUser = async()=>{
        
        axios.post("http://localhost:8080/user/logout",{},{
            headers : {
                "Authorization" : `Bearer ${token}`
            }
        })
        .then(()=>console.log("Logged out"))
        .catch(err => console.log(err))
        
        dispatch(logout())
        dispatch(closeModal())
        router.push("/")        
    }

    const showDeleteAcc = ()=>{
        dispatch(openModal({header:"Delete Account",children:<DisableDeleteAcc executeAction={deleteAcc} />}))
    }

    const showDisableAcc = ()=>{
        dispatch(openModal({header:"Disable Account",children:<DisableDeleteAcc executeAction={disableAcc} />}))
    }

    const deleteAcc = async()=>{
        try{
            const response = await axios.delete("http://localhost:8080/user/deleteAcc",{
                headers : {
                    "Authorization": `Bearer ${token}`
                }
            })
            if(response.status === 200){
                dispatch(logout())
                dispatch(closeModal())
                router.push("/")
            }
        }catch(err){
            console.log(err)
            alert("Cannot delete acc")
        }
    }

    const disableAcc = async()=>{
        try{
            const response = await axios.patch("http://localhost:8080/user/deactivateAcc",{},{
                headers : {
                    "Authorization": `Bearer ${token}`
                }
            })
            if(response.status === 200){
                dispatch(logout())
                dispatch(closeModal())
                router.push("/")
            }
        }catch(err){
            console.log(err)
            alert("Cannot delete acc")
        }
    }

    return(
        <div className="min-w-[200px] w-full flex flex-col h-[150px] p-5 justify-center items-center gap-2">
            <button className="bg-white w-full rounded-md pt-3 pb-3" onClick={logoutUser}>
                Logout
            </button> 
            <div className="w-full flex flex-row gap-2">
                <button className="bg-red-400 w-full rounded-md pt-3 pb-3" onClick={showDisableAcc}>
                    Disable Account
                </button> 
                <button className="bg-red-600 w-full rounded-md pt-3 pb-3" onClick={showDeleteAcc}>
                    Delete Account
                </button>                
            </div>  
            
        </div>
    )
}