'use client'
import { openModal } from "@/redux/modal/modalSlice"
import { useDispatch, useSelector } from "react-redux"
import UserOptions from "./UserOptions"
import { RootState } from "@/redux/store"

export default function NavBar(){
    const dispatch = useDispatch()
    const name = useSelector((state: RootState)=> state.user.name)

    const modalPayload = {
        header : "Options",
        children : <UserOptions />
    }
    
    return(
        <div className="min-w-full bg-black flex flex-row justify-between p-3 text-white">
            <p className="font-semibold text-lg">Welcome {name} to Gira</p>
            <button className="bg-white text-black p-1 rounded-lg hover:scale-105 transition-transform ease-in-out" onClick={()=>dispatch(openModal(modalPayload))}>Options</button>
        </div>
    )
}