'use client'
import { closeModal } from "@/redux/modal/modalSlice";
import { logout } from "@/redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function UserOptions(){
    const dispatch = useDispatch();

    const logoutUser = async()=>{
        // Call logout function

        // Clear State
        dispatch(logout())
        dispatch(closeModal())
    }

    return(
        <div className="min-w-[200px] w-full flex flex-col h-[100px] p-5 justify-center items-center gap-6">
            <button className="bg-red-400 w-full rounded-md pt-3 pb-3" onClick={()=>dispatch(closeModal())}>
                Logout
            </button>          
        </div>
    )
}