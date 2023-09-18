'use client'

import { useEpic } from "@/hooks/epic"
import { RootState } from "@/redux/store"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"


export default function TaskInput(){
    const InputClass = "w-11/12 border-[1px]  rounded-sm border-slate-300 p-1 focus:outline-none focus-visible:border-slate-500 text-lg"

    const {submitTask} = useEpic()
    const isOpen= useSelector((state:RootState)=>state.modal.isOpen)
    const [taskName,setTaskName] = useState<string>("")
    const [taskReq,setTaskReq] = useState<string>("")
    const [startDate,setStartDate] = useState<Date>(new Date())
    const [endDate,setEndDate] = useState<Date>(new Date())
    const [error,setError] = useState<string>("")

    const submit = ()=>{
        
        if(taskName.length === 0){
            setError("Enter Task name");
            return
        }
        if(taskReq.length === 0){
            setError("Enter Requirements");
            return
        }
        if(startDate === new Date()){
            setError("Enter Start Date");
            return
        }

        if(startDate > endDate ){
            setError("Enter valid date range")
            return
        }

        setError("");
        console.log(taskName,taskReq,startDate.toISOString(),endDate.toISOString());
        submitTask(taskName,taskReq,startDate,endDate)
    }

    const inputDate = (date: Date) : string=>{
        return (date.getFullYear().toString()+"-"+(date.getMonth()+1).toString().padStart(2,"0")+"-"+date.getDate().toString().padStart(2,"0"))
    }

    useEffect(()=>{
        setTaskName("")
        setTaskReq("")
        setStartDate(new Date())
        setEndDate(new Date())
    },[isOpen])


    return(
        <div className="flex flex-col gap-3 items-center p-2 bg-black/60 rounded-lg w-11/12">
            <input type="text" name="name" id="name" placeholder="Enter Task Name" className={InputClass} value={taskName} onChange={(e)=>setTaskName(e.target.value)}/>
            <textarea  name="req" id="req" placeholder="Enter Requirements" className={`${InputClass} h-12`} value={taskReq} onChange={(e)=>setTaskReq(e.target.value)}/>
            <div className="flex justify-between w-11/12">
                <span className="text-black">Start Date:</span>
                <input type="date" name="startDate" id="startDate" value={inputDate(startDate)} onChange={(e)=>setStartDate(new Date(e.target.value))}/>
            </div>
            <div className="flex justify-between w-11/12">
                <span className="text-black">End Date:</span>
                <input type="date" name="endDate" id="endDate" value={inputDate(endDate)} onChange={(e)=>setEndDate(new Date(e.target.value))}/>
            </div>
            <div className="text-red-500 w-11/12 text-start text-xs">{error.length>0 && error}</div>
            <button className="w-11/12 bg-green-300 hover:bg-green-500 transition-colors ease-in-out duration-300 text-white pt-1 pb-1 border-[1px] rounded-md" onClick={submit}>
                Submit
            </button>
        </div>
    )
}