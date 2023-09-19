'use select'

import { closeModal } from "@/redux/modal/modalSlice"
import { useDispatch } from "react-redux"

export default function DisableDeleteAcc({executeAction}: {executeAction : any}){
    const dispatch = useDispatch()

    return(
        <div className="min-w-[200px] w-full flex flex-col h-[100px] p-5 justify-center items-center gap-2 text-white text-xl">
            <span>ARE YOU SURE?</span>
            <div className="w-full flex gap-2">
                <button className="bg-green-400 w-full rounded-md pt-3 pb-3 cursor-pointer hover:bg-green-500 transition-colors ease-out" onClick={()=>dispatch(closeModal())} >
                    No
                </button>   
                <button className="bg-red-400 w-full rounded-md pt-3 pb-3 cursor-pointer hover:bg-red-500 transition-colors ease-out" onClick={executeAction}>
                    Yes
                </button> 
            </div>
            
        </div>
    )
}