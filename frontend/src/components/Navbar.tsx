'use client'
import { ModalState, openModal } from "@/redux/modal/modalSlice"
import { useDispatch } from "react-redux"
import UserOptions from "./UserOptions"

export default function NavBar(){
    const dispatch = useDispatch()

    const modalPayload = {
        header : "Options",
        children : <UserOptions />
    }
    
    return(
        <div className="min-w-full bg-black flex flex-row justify-between p-3 text-white">
            <p className="font-semibold text-lg">Name</p>
            <button className="bg-white text-black p-1 rounded-lg hover:scale-105 transition-transform ease-in-out" onClick={()=>dispatch(openModal(modalPayload))}>Options</button>
        </div>
    )
}