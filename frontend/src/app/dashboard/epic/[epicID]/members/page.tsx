'use client'

import { useEpic } from "@/hooks/epic";
import { useRouter } from "next/navigation"


export default function Page(){
    const router = useRouter();
    const {currentEpicDetails} = useEpic()
    return(
        <div className="w-full h-full">
            <div>
                <span>Members List</span>
                <button className="bg-blue-500/50 p-2 rounded-md text-white shadow-lg w-full" onClick={()=>router.push(`/dashboard/epic/${currentEpicDetails.EpicID}`)}>Go To Epic Page</button>
            </div>

        </div>
    )
}