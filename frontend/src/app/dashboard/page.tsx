'use client'

import { RootState } from "@/redux/store"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

type EpicPreviewType = {
    EpicID : string,
    EpicName : string
}

export default function Page(){

    const name = useSelector((state:RootState)=>state.user.name)
    const token = useSelector((state:RootState)=>state.user.token)  
    const isLoggedIn = useSelector((state:RootState)=>state.user.isLoggedIn)
    const role = useSelector((state:RootState)=>state.user.role)

    const [epics,setEpics] = useState<EpicPreviewType[]>([] as EpicPreviewType[])
    const router = useRouter()
    // Check loggin then get epics
    useEffect(()=>{
        if(isLoggedIn === false){
            router.push("/")
        }       
        const getEpics = async()=>{
            try{
                const response = await axios.get("http://localhost:8080/epic/getUserEpics",{
                    headers:{
                        "Authorization" : `Bearer ${token}`
                    }
                })

                console.log(response)
                response.data.map((epic : EpicPreviewType)=>{
                    setEpics([...epics,epic])
                })
            }catch(err:any){
                if(err.response){
                    console.log(err.response.status)
                }
                else{
                    alert("Server Error pls try again later")
                }
            }
        }
        getEpics() 
    },[isLoggedIn])

    const epicBoxDesign = "w-3/4 h-[400px] lg:w-[300px] lg:h-[300px] bg-slate-400 shadow-md  cursor-pointer hover:scale-105 transition-transform ease-linear" 
    return(
        <div className="w-full h-full">
            <p className="font-semibold text-lg p-3 pl-5">Welcome {name}</p>
            <div className="w-full h-full flex flex-col md:flex-row gap-5 p-10 flex-wrap justify-center items-center">
                {epics.map((epic,index)=>{
                    return(
                        <div className={`${epicBoxDesign} flex justify-center items-center p-5`} onClick={()=>router.push(`/dashboard/epic/${epic.EpicID}`)}>
                            <p className="w-full text-start text-3xl font-bold">{epic.EpicName}</p>
                        </div>
                    )
                })}
            
                {role === "MASTER" && 
                    <div className={`${epicBoxDesign} flex justify-center items-center `}>
                        <p className="w-full text-center text-2xl">+ Create Epic</p>
                    </div>
                }                
                { role === "MEMBER" && epics.length === 0 &&
                    <p className="w-full text-center">Looks Empty, Come back after your Master has added you :)</p>
                }
            </div>
        </div>
    )
}