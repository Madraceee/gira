'use client'

import EpicDetails from "@/components/EpicDetails";
import TaskEditor from "@/components/TaskEditor";
import TaskPreview from "@/components/TaskPreview";
import { SprintDetails, TaskDetails, TaskEditorType, useEpic } from "@/hooks/epic"
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";


export default function Page({params} : {params : {epicID : string}}){

    const {setCurrectEpicID,currentEpicDetails,taskList,sprintList} = useEpic();
    const [isDetailsOpen,SetIsDetailsOpen] = useState<boolean>(false);
    const [isTaskEditorOpen,setIsTaskEditorOpen] = useState<boolean>(false);
    const [taskEditorContents, setTaskEditorContents] = useState<TaskEditorType>({} as TaskEditorType);


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


    const mockData: TaskEditorType[] = [
        {
            TASKID: "1",
            TASKNAME: "Task 1",
            TASKREQ: "Requirement 1",
            TASKLINK: "https://example.com/task1",
            TASKLOG: "Log for Task 1",
            TASKSTATUS: "TESTING",
            TASKSPRINTID: "1",
            TASKSTARTDATE: "2023-09-01",
            TASKENDDATE: "2023-09-15",
            perms : [],
            sprint: [{
                SprintID: 1,
                SprintStartDate: "2022-05-04",
                SprintEndDate : "2022-05-04"
            },
            {
                SprintID: 2,
                SprintStartDate: "2022-05-04",
                SprintEndDate : "2022-05-04",
            }]
        },
        {
            TASKID: 2,
            TASKNAME: "Task 2",
            TASKREQ: "Requirement 2",
            TASKLINK: "https://example.com/task2",
            TASKLOG: "Log for Task 2",
            TASKSTATUS: "COMPLETED",
            TASKSPRINTID: "Sprint 2",
            TASKSTARTDATE: "2023-09-05",
            TASKENDDATE: "2023-09-20",
            perms: [],
            sprint: [{
                SprintID: 1,
                SprintStartDate: "2022-05-04",
                SprintEndDate : "2022-05-04"
            }]
        },
        // Add more objects as needed
      ];
    


    return(
        <div className="w-full h-full flex flex-col gap-4 p-2 pt-5">
            <div className="w-full flex flex-col md:flex-row md:justify-between">
                <span className="text-2xl md:text-3xl lg:text-5xl font-bold text-center">{currentEpicDetails.EpicName}</span>
                <div className="flex gap-2 justify-between">
                    <button className="bg-slate-600 p-2 rounded-md text-white shadow-lg w-full">View Members</button>
                    <button className="bg-slate-600 p-2 rounded-md text-white shadow-lg w-full">Add Member</button>
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
                        <TaskEditor task={mockData[0]}/> :
                        <p className="w-full text-center">Select Task to preview</p>
                    }
                    
                </div>
            </div>
            <p onClick={()=>setIsTaskEditorOpen((state)=>!state)}>Test</p>
        </div>
    )
}