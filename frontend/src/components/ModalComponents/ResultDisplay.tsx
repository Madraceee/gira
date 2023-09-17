'use client'
import { closeModal } from "@/redux/modal/modalSlice"
import { useDispatch } from "react-redux"

export default function ResultDisplay({msg} : {msg : string}){
    const dispatch = useDispatch()
    return(
        <div className="max-w-md flex flex-col h-[200px] w-[300px] p-5 justify-center items-center gap-6">
            <h1 className={`text-center text-3xl ${msg==="Success" ? "text-green-400" : "text-red-500"}`}>{msg}</h1>
            <button className="bg-white w-full rounded-md text-lg" onClick={()=>dispatch(closeModal())}>
                Close
            </button>           
        </div>
    )
}