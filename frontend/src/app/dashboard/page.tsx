'use client'

import { RootState } from "@/redux/store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function Page(){

    const name = useSelector((state:RootState)=>state.user.name) 
    const isLoggedIn = useSelector((state:RootState)=>state.user.isLoggedIn)
    //const role = useSelector((state:RootState)=>state.user.role)

    const role:string = "MASTER"
    const [epic,setEpics] = useState<any[]>([])
    const router = useRouter()
    // Check loggin then get epics
    useEffect(()=>{
        // if(isLoggedIn === false){
        //     router.push("/")
        // }
        
        //Get epics
    },[])

    const epicBoxDesign = "w-3/4 h-[400px] lg:w-[300px] lg:h-[300px] bg-slate-400 shadow-md  cursor-pointer hover:scale-105 transition-transform ease-linear" 
    return(
        <div className="w-full h-full">
            <p className="font-semibold text-lg p-3 pl-5">Welcome {name}</p>
            <div className="w-full h-full flex flex-col md:flex-row gap-5 p-10 flex-wrap justify-center items-center">
            
                {role === "MASTER" && 
                    <div className={`${epicBoxDesign} flex justify-center items-center `}>
                        <p className="w-full text-center text-2xl">+ Create Epic</p>
                    </div>
                }                
                { role === "MEMBER" && epic.length === 0 &&
                    <p className="w-full text-center">Looks Empty, Come back after your Master has added you :)</p>
                }
            </div>
        </div>
    )
}