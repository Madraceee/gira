'use client'

import EpicDetails from "@/components/EpicDetails";
import TaskInput from "@/components/TaskInput";
import TaskEditor from "@/components/TaskEditor";
import TaskPreview from "@/components/TaskPreview";
import { EpicPerms, SprintDetails, TaskDetails, TaskEditorType, useEpic } from "@/hooks/epic"
import { openModal } from "@/redux/modal/modalSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


export default function Page({params} : {params : {epicID : string}}){

    const dipatch = useDispatch()
    const {setCurrectEpicID,currentEpicDetails,taskList,sprintList,epicPerms} = useEpic();
    const [isDetailsOpen,SetIsDetailsOpen] = useState<boolean>(false);
    const [isTaskEditorOpen,setIsTaskEditorOpen] = useState<boolean>(false);
    const [taskEditorContents, setTaskEditorContents] = useState<TaskEditorType>({} as TaskEditorType);
    const [showAddTask,setShowAddTask] = useState<boolean>(false)


    const token = useSelector((state:RootState)=>state.user.token)
    const isLoggedIn = useSelector((state:RootState)=>state.user.isLoggedIn)
    const router = useRouter()

    useEffect(()=>{
        if(isLoggedIn === false){
            router.push("/")
        }
    },[isLoggedIn])

    useEffect(()=>{
        setCurrectEpicID(params.epicID)
    },[])

    const showTask = (taskID: string)=>{

        const task = taskList.find((task) => task.TASKID === taskID)
        if(task === undefined){
            return
        }
       
        // Get perms for each TASK
        // SEND That also
        setTaskEditorContents({
            TASKID : task.TASKID,
            TASKENDDATE: task.TASKENDDATE,
            TASKNAME: task.TASKNAME,
            TASKSPRINTID: task.TASKSPRINTID,
            TASKSTATUS: task.TASKSTATUS,
            TASKLINK : task.TASKLINK,
            TASKLOG : task.TASKLOG,
            TASKREQ : task.TASKREQ,
            TASKSTARTDATE : task.TASKSTARTDATE,
            perms : [],
            sprint : sprintList
        });
        setIsTaskEditorOpen(true);
    }

    
    return(
        <div className="w-full h-full flex flex-col gap-4 p-2 pt-5">
            <div className="w-full flex flex-col md:flex-row md:justify-between">
                
                <span className="text-2xl md:text-3xl lg:text-5xl font-bold text-center">{currentEpicDetails.EpicName}</span>
                <div className="flex gap-2 justify-between">
                    <button className="bg-black/80 p-2 rounded-md text-white shadow-lg w-full" onClick={()=>router.push(`/dashboard/epic/${currentEpicDetails.EpicID}/members`)}>View Members</button>
                    <button className="bg-blue-500/50 p-2 rounded-md text-white shadow-lg w-full" onClick={()=>router.push("/dashboard")}>Go To Dashboard</button>
                </div>
            </div>
            <div className="w-full"  >
                <div className={`bg-black text-white flex justify-start items-center gap-3 cursor-pointer pl-2 text-3xl p-1 pr-2 rounded-t-md ${!isDetailsOpen && "rounded-b-md"}`} onClick={()=>SetIsDetailsOpen((state)=>!state)}>
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
                <div className="w-full lg:w-1/2 h-3/4 lg:max-h-[700px] bg-white shadow-md rounded-lg p-3">
                    <p className="text-2xl font-bold text-center lg:text-left">Task list</p>                    
                    <div className="flex flex-col max-h-[500px] lg:max-h-[500px] overflow-y-auto gap-1">
                        {epicPerms.find((perm)=> perm == EpicPerms.ADDTASK.valueOf() ) && 
                            <div className="bg-[#d6dbdcd9] w-full h-fit min-h-20 flex flex-col items-center justify-center text-2xl rounded-lg cursor-pointer" >
                                <span onClick={()=>setShowAddTask(state=>!state)} className="w-full text-center">{showAddTask ? "-" : "+"}Add Task</span>
                                {showAddTask && <TaskInput />}
                            </div>
                        }
                        {taskList.map((taskPreview,index)=>(
                            <TaskPreview 
                                taskPreview={taskPreview}
                                key={index}
                                showTask={showTask}
                            />
                        ))}
                    </div>
                </div>
                <div className="w-full lg:w-1/2 h-[700px] bg-white flex items-center shadow-md rounded-lg">
                    {isTaskEditorOpen ?
                        <TaskEditor task={taskEditorContents}/> :
                        <p className="w-full text-center">Select Task to preview</p>
                    }
                    
                </div>
            </div>
            <p onClick={()=>setIsTaskEditorOpen((state)=>!state)}>Test</p>
        </div>
    )
}