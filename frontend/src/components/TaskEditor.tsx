import { TaskEditorType, TaskRoles } from "@/hooks/epic";
import { useEffect, useState } from "react";

export default function TaskEditor({task}: {task : TaskEditorType}){
    const taskCopy = task;

    const [taskReq,setTaskReq] = useState<string>(task.TASKREQ);
    const [taskLink,setTaskLink] = useState<string>(task.TASKLINK);
    const [taskLog,setTaskLog] = useState<string>(task.TASKLOG);
    const [taskStatus,setTaskStatus] = useState<string>(task.TASKSTATUS);
    const [taskSpringID,setTaskSpringID] = useState<string>(task.TASKSPRINTID);

    const [hasChanged,setHasChanged] = useState<boolean>(false)

    useEffect(()=>{
        console.log(taskReq,taskLink,taskLog,taskStatus,taskSpringID)
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


    const headingStyle = "font-bold inline"
    return(
        <div className="w-full h-full flex flex-col gap-4 p-2 overflow-auto text-xl">
            <p className="w-full text-3xl font-bold">{taskCopy.TASKNAME}</p>
            <div className="flex items-center gap-1">
                <span className={headingStyle}>Requirements: </span>
                <span className="min-w-[50px] max-w-full max-h-16 overflow-y-auto inline-block border-black border-2 rounded-sm" contentEditable={task.perms.find((TaskRoles.UPDATETASKFULL.valueOf)) === undefined ? false : true} onInput={(e)=>setTaskReq(e.currentTarget.textContent === null ? "": e.currentTarget.textContent)}>{taskCopy.TASKREQ}</span>
            </div>            
            <div className="flex items-center gap-1">
                <span className={headingStyle}>Link: </span>
                <span className="min-w-[50px] max-w-full max-h-16 overflow-y-auto inline-block border-black border-2 rounded-sm" contentEditable={task.perms.find((TaskRoles.UPDATETASKFULL.valueOf)) === undefined ? false : true} onInput={(e)=>setTaskLink(e.currentTarget.textContent === null ? "": e.currentTarget.textContent)}><a href={taskCopy.TASKLINK} className="text-blue-400 underline">{taskCopy.TASKLINK}</a></span>
            </div>
            <div className="flex items-center gap-1">
                <span className={headingStyle}>Logs:</span>
                <span className="min-w-[50px] break-all max-h-28 overflow-y-auto inline-block border-black border-2 rounded-sm" contentEditable={task.perms.find((TaskRoles.UPDATETASKFULL.valueOf)) === undefined ? false : true} onInput={(e)=>setTaskLog(e.currentTarget.textContent === null ? "": e.currentTarget.textContent)}>{taskCopy.TASKLINK}</span>
            </div>
            
            <p className="w-full flex items-center gap-1"><span className={headingStyle}>Status: </span>
                <select onChange={(e)=>setTaskStatus(e.target.value)} defaultValue={taskCopy.TASKSTATUS} disabled={(task.perms.find((TaskRoles.UPDATESTATUS.valueOf)) === undefined ? true : false) && (task.perms.find((TaskRoles.UPDATETASKFULL.valueOf)) === undefined ? true : false)}>
                    <option value="NOT STARTED" >NOT STARTED</option>
                    <option value="BUILDING" >BUILDING</option>
                    <option value="TESTING" >TESTING</option>
                    <option value="REVIEW" >REVIEW</option>
                    <option value="COMPLETED" >COMPLETED</option>
                    <option value="HALTED" >HALTED</option>
                </select>
            </p>

            <p className="w-full flex items-center gap-1"><span className={headingStyle}>Sprint ID:</span>
                <select onChange={(e)=>setTaskSpringID(e.target.value)} defaultValue={taskCopy.TASKSPRINTID} disabled={task.perms.find((TaskRoles.ASSIGNSPRINT.valueOf)) === undefined ? false : false} className="min-w-[100px] text-right pr-2">
                    {task.sprint.map((sprint,index)=>{
                        return(
                            <option value={sprint.SPRINTNAME} key={index}>{sprint.SPRINTNAME}</option>
                        )
                    })}
                </select>
            </p>

            <div className="w-full flex flex-row">
                <p className="w-1/2"><span className={headingStyle}>Start Date: </span>{task.TASKSTARTDATE}</p>
                <p className="w-1/2"><span className={headingStyle}>End Date: </span>{task.TASKENDDATE}</p>
            </div>
            <div className="flex flex-row justify-between gap-2">
                <button disabled={task.perms.find((TaskRoles.ADDMEMBERS.valueOf)) === undefined ? true : false} className="bg-slate-600 text-white p-1 pl-2 pr-2 rounded-md cursor-not-allowed">Add Member</button>
                <button disabled={!hasChanged} className="bg-blue-400 text-white p-1 pl-2 pr-2 rounded-md disabled:bg-blue-100">Save</button>
            </div>
        </div>
    )
}