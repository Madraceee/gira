'use client'
import { closeModal } from "@/redux/modal/modalSlice"
import { useDispatch } from "react-redux"

export default function ResultDisplay({msg} : {msg : string}){
    const dispatch = useDispatch()
    return(
        <div className="max-w-full lg:max-w-md flex flex-col min-h-[200px] w-full p-5 justify-center items-center gap-6">
            <h1 className={`text-center text-3xl ${msg==="Success" ? "text-green-400" : "text-red-500"}`}>{msg}</h1>
            <button className="bg-white w-3/4 pt-2 pb-2 rounded-md text-lg" onClick={()=>dispatch(closeModal())}>
                Close
            </button>           
        </div>
    )
}