'use client'

import EpicDetails from "@/components/EpicDetails";
import TaskPreview from "@/components/TaskPreview";
import { SprintDetails, TaskDetailsShort, useEpic } from "@/hooks/epic"
import { useEffect, useState } from "react";


export default function Page({params} : {params : {epicID : string}}){

    const {setCurrectEpicID,currentEpicDetails,taskList,sprintList} = useEpic();
    const [isDetailsOpen,SetIsDetailsOpen] = useState<boolean>(false);

    useEffect(()=>{
        setCurrectEpicID(params.epicID)
    },[])

    const showTask = async (taskID: string)=>{
        // Fetch Task

        // Populate TaskEditor
    }


    return(
        <div className="w-full h-full flex flex-col gap-4 p-2 pt-5">
            <div className="w-full flex flex-col md:flex-row md:justify-between">
                <span className="text-2xl md:text-3xl lg:text-5xl font-bold text-center">{currentEpicDetails.EPICNAME}</span>
                <div className="flex gap-2 justify-between">
                    <button className="bg-slate-600 p-2 rounded-md text-white shadow-lg w-full">View Members</button>
                    <button className="bg-slate-600 p-2 rounded-md text-white shadow-lg w-full">Add Member</button>
                </div>
            </div>
            <div className="w-full" onClick={()=>SetIsDetailsOpen((state)=>!state)}>
                <div className="bg-gray-600/50 flex justify-start items-center gap-3 cursor-pointer pl-2 text-3xl p-1 pr-2 rounded-sm">
                    <span>{isDetailsOpen ? "▼" : "▶"}</span>
                    <span className="" >Details</span>   
                </div>
                {isDetailsOpen && 
                    <EpicDetails
                        epicDetails={currentEpicDetails}
                        sprintDetails={sprintList}
                    />
                }                             
            </div>            
            <div className="w-full flex flex-col lg:flex-row gap-4 items-center h-fit">
                <div className="w-full lg:w-1/2 h-3/4 lg:max-h-[700px] shadow-inner  bg-black/10 rounded-sm p-3">
                    <p className="text-2xl font-bold text-center lg:text-left">Task list</p>
                    <div className="flex flex-col max-h-[500px] lg:max-h-[500px] overflow-y-auto gap-1">
                        {taskList.map((taskPreview,index)=>(
                            <TaskPreview 
                                taskPreview={taskPreview}
                                key={index}
                                showTask={showTask}
                            />
                        ))}
                    </div>
                </div>
                <div className="w-full lg:w-1/2 h-[700px] lg:h-full bg-black/10">
                    
                </div>
            </div>
        </div>
    )
}