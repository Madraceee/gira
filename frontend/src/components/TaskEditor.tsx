import { TaskEditorType, TaskRoles, useEpic } from "@/hooks/epic";
import { RootState } from "@/redux/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ContentEditable from "react-contenteditable";

export default function TaskEditor({task}: {task : TaskEditorType}){
    const taskCopy = task;

    const token = useSelector((state:RootState)=>state.user.token)

    const [taskReq,setTaskReq] = useState<string>(task.TASKREQ);
    const [taskLink,setTaskLink] = useState<string>(task.TASKLINK);
    const [taskLog,setTaskLog] = useState<string>(task.TASKLOG);
    const [taskStatus,setTaskStatus] = useState<string>(task.TASKSTATUS);
    const [taskSpringID,setTaskSpringID] = useState<string>(task.TASKSPRINTID);
    const [hasChanged,setHasChanged] = useState<boolean>(false);
    const [perms,setPerms] = useState<number[]>([]);

    const {updateTask} = useEpic()

    useEffect(()=>{
        if(task.TASKREQ !== taskReq){
            setHasChanged(true)
            return
        }
        if(task.TASKLINK !== taskLink){
            setHasChanged(true)
            return
        }
        if(task.TASKLOG !== taskLog){
            setHasChanged(true)
            return
        }
        if(task.TASKSTATUS !== taskStatus){
            setHasChanged(true)
            return
        }
        if(task.TASKSPRINTID !== taskSpringID){
            setHasChanged(true)
            return
        }
        setHasChanged(false)
    },[taskReq,taskLink,taskLog,taskStatus,taskSpringID])

    useEffect(()=>{

        const getPerms = async(taskID:string)=>{
            try{
    
                const response = await axios.get(`http://localhost:8080/task/getTaskPerms/${taskID}`,{
                    headers : {
                        Authorization : `Bearer ${token}`
                    }
                })

                setPerms(response.data)
            }catch(err){
                console.log(err)
                setPerms([])
            }
        }    
        getPerms(task.TASKID)

        setTaskLink(task.TASKLINK)
        setTaskLog(task.TASKLOG)
        setTaskReq(task.TASKREQ)
        setTaskStatus(task.TASKSTATUS)
        setTaskSpringID(task.TASKSPRINTID)
    },[task.TASKID])

    const taskFullUpdate = perms.find((perm)=>perm === TaskRoles.UPDATETASKFULL.valueOf()) === undefined ? false : true
    const taskStatusUpdate = perms.find((perm)=>perm === TaskRoles.UPDATESTATUS.valueOf()) === undefined ? false : true
    const headingStyle = "font-bold inline"
    return(
        <div className="w-full h-full flex flex-col gap-4 p-2 overflow-auto text-xl">
            <p className="w-full text-3xl font-bold">{taskCopy.TASKNAME}</p>
            <div className="flex items-center gap-1">
                <span className={headingStyle}>Requirements: </span>
                <ContentEditable
                    html={taskReq}
                    className={`min-w-[50px] max-w-full max-h-16 min-h-[20px] overflow-y-auto inline-block ${taskFullUpdate ? "border-black border-2 rounded-sm" : ""} `}
                    onChange={(e)=>setTaskReq(e.target.value)}
                    disabled={!taskFullUpdate}
                />
            </div>            
            <div className="flex items-center gap-1">
                <span className={headingStyle}>Link: </span>
                <ContentEditable
                    html={taskLink}
                    className={`min-w-[50px] max-w-full max-h-16 min-h-[20px] overflow-y-auto inline-block ${taskFullUpdate ? "border-black border-2 rounded-sm" : ""} `}
                    onChange={(e)=>setTaskLink(e.target.value)}
                    disabled={!taskFullUpdate}

                />
            </div>
            <div className="flex items-center gap-1">
                <span className={headingStyle}>Logs:</span>
                <ContentEditable
                    html={taskLog}
                    className={`min-w-[50px] max-w-full max-h-16 min-h-[20px] overflow-y-auto inline-block ${taskFullUpdate ? "border-black border-2 rounded-sm" : ""} `}
                    onChange={(e)=>setTaskLog(e.target.value)}
                    disabled={!taskFullUpdate}
                />  
            </div>
            
            <p className="w-full flex items-center gap-1"><span className={headingStyle}>Status: </span>
                <select onChange={(e)=>setTaskStatus(e.target.value)} value={taskStatus} disabled={!taskFullUpdate || !taskStatusUpdate} className="bg-[#d6dbdc] text-black p-1 rounded-md shadow-sm">
                    <option value="NOT STARTED" >NOT STARTED</option>
                    <option value="BUILDING" >BUILDING</option>
                    <option value="TESTING" >TESTING</option>
                    <option value="REVIEW" >REVIEW</option>
                    <option value="COMPLETED" >COMPLETED</option>
                    <option value="HALTED" >HALTED</option>
                </select>
            </p>

            <p className="w-full flex items-center gap-1"><span className={headingStyle}>Sprint ID:</span>
                <select onChange={(e)=>setTaskSpringID(e.target.value)} defaultValue={taskSpringID} disabled={!taskFullUpdate} className="min-w-[100px] text-right pr-2 bg-[#d6dbdc] text-black p-1 rounded-md shadow-sm">
                    {task.sprint.map((sprint,index)=>{
                        return(
                            <option value={sprint.SprintID} key={index}>{sprint.SprintID}</option>
                        )
                    })}
                </select>
            </p>

            <div className="w-full flex flex-row">
                <p className="w-1/2"><span className={headingStyle}>Start Date: </span>{task.TASKSTARTDATE}</p>
                <p className="w-1/2"><span className={headingStyle}>End Date: </span>{task.TASKENDDATE}</p>
            </div>
            <div className="flex flex-row justify-between gap-2">
                <button disabled={perms.find((perm=> perm === TaskRoles.ADDMEMBERS.valueOf())) === undefined ? true : false} className={`bg-slate-600 text-white p-1 pl-2 pr-2 rounded-md disabled:cursor-not-allowed`}>Add Member</button>
                <button disabled={!hasChanged} className="bg-blue-400 text-white p-1 pl-2 pr-2 rounded-md disabled:bg-blue-100" onClick={()=>updateTask(task.TASKID,taskReq,taskLink,taskLog,taskStatus,taskSpringID)}>Save</button>
            </div>
        </div>
    )
}