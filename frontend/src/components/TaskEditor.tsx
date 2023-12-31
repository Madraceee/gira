'use client'
import { TaskEditorType, TaskRoles, useEpic } from "@/hooks/epic";
import { RootState } from "@/redux/store";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContentEditable from "react-contenteditable";
import ResultDisplay from "./ModalComponents/ResultDisplay";
import { openModal } from "@/redux/modal/modalSlice";

export default function TaskEditor({task}: {task : TaskEditorType}){
    const taskCopy = task;

    const dispatch = useDispatch()
    const token = useSelector((state:RootState)=>state.user.token)

    const [taskReq,setTaskReq] = useState<string>(task.TASKREQ);
    const [taskLink,setTaskLink] = useState<string>(task.TASKLINK);
    const [taskLog,setTaskLog] = useState<string>(task.TASKLOG);
    const [taskStatus,setTaskStatus] = useState<string>(task.TASKSTATUS);
    const [taskSprintID,setTaskSprintID] = useState<string>(task.TASKSPRINTID);
    const [hasChanged,setHasChanged] = useState<boolean>(false);
    const [perms,setPerms] = useState<number[]>([]);

    // Add member
    const [taskUpdateEmail,setTaskUpdateEmail] = useState<string>("")
    const [taskUpdateSelectedRole,setTaskUpdateSelectedRole] = useState<string>("")

    // Delete Member
    const [taskDeleteEmail,setTaskDeleteEmail] = useState<string>("")

    const [showOptions,setShowOptions] = useState<string>("")

    // Members of Task
    const [membersOfTask,setMembersOfTask] = useState<{UsersName:string,RoleName: string}[]>([])

    const {updateTask,addMemberToTask,deleteMemberFromTask,taskRoles,toggleReload} = useEpic()

    useEffect(()=>{
        getTaskMembers(task.TASKID)
    },[toggleReload])

     // Get Members of Task
    const getTaskMembers = async(taskID : string)=>{
        try{
            const response = await axios.get(`http://localhost:8080/task/getMembersOfTask/${taskID}`,{
                headers: {
                    Authorization: `Bearer ${token}`
                },
            })

            if(response.status === 200){
                setMembersOfTask(response.data)
            }
        }catch(err:any){     
            dispatch(openModal({header:"",children:<ResultDisplay msg={err.response.data ? err.response.data.error : "Failure"}/>}))  
            console.log("Error Fetching members:",err)
        }
    }

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
        if(task.TASKSPRINTID !== taskSprintID){
            setHasChanged(true)
            return
        }
        setHasChanged(false)
    },[taskReq,taskLink,taskLog,taskStatus,taskSprintID])

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
        setTaskSprintID(task.TASKSPRINTID)

        setTaskUpdateEmail("")
        setTaskUpdateSelectedRole(taskRoles[0])
        setShowOptions("close")

        setTaskDeleteEmail("")        
        setShowOptions("close")
    },[task.TASKID])

    const taskFullUpdate = perms.find((perm)=>perm === TaskRoles.UPDATETASKFULL.valueOf()) === undefined ? false : true
    const taskStatusUpdate = perms.find((perm)=>perm === TaskRoles.UPDATESTATUS.valueOf()) === undefined ? false : true
    const headingStyle = "font-bold inline"
    return(
        <div className="w-full h-full flex flex-col gap-4 p-2 overflow-auto text-xl">
            <p className="w-full text-3xl font-bold">{taskCopy.TASKNAME}</p>
            <div className="flex items-center gap-1">
                <span className={headingStyle}>Requirements: </span>
                <span className={`min-w-[50px] max-w-full max-h-16 min-h-[20px] overflow-y-auto inline-block `}>{taskReq}</span>
            </div>            
            <div className="flex items-center gap-1">
                <span className={headingStyle}>Link: </span>
                <ContentEditable
                    html={taskLink}
                    className={`min-w-[50px] max-w-full max-h-16 min-h-[20px] overflow-x-auto inline-block ${taskFullUpdate ? "border-black border-2 rounded-sm" : ""} `}
                    onChange={(e)=>setTaskLink(e.target.value)}
                    disabled={!taskFullUpdate}

                />
            </div>
            <div className="flex items-center gap-1">
                <span className={headingStyle}>Logs:</span>
                <ContentEditable
                    html={taskLog}
                    className={`min-w-[100px] max-w-full max-h-80 min-h-[20px] overflow-y-auto inline-block ${taskFullUpdate ? "border-black border-2 rounded-sm" : ""} `}
                    onChange={(e)=>setTaskLog(e.target.value)}
                    disabled={!taskFullUpdate}
                />  
            </div>
            
            <p className="w-full flex items-center gap-1"><span className={headingStyle}>Status: </span>
                <select onChange={(e)=>setTaskStatus(e.target.value)} value={taskStatus} disabled={!taskFullUpdate && !taskStatusUpdate} className="bg-[#d6dbdc] text-black p-1 rounded-md shadow-sm">
                    <option value="NOT STARTED" >NOT STARTED</option>
                    <option value="BUILDING" >BUILDING</option>
                    <option value="TESTING" >TESTING</option>
                    <option value="REVIEW" >REVIEW</option>
                    <option value="COMPLETED" >COMPLETED</option>
                    <option value="HALTED" >HALTED</option>
                </select>
            </p>

            <p className="w-full flex items-center gap-1"><span className={headingStyle}>Sprint ID:</span>
                <select onChange={(e)=>setTaskSprintID(e.target.value)} value={task.TASKSPRINTID} disabled={!taskFullUpdate} className="min-w-[100px] text-right pr-2 bg-[#d6dbdc] text-black p-1 rounded-md shadow-sm">
                    <option value={0} >Select</option>
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
                <button className={`bg-slate-600 text-white p-1 pl-2 pr-2 rounded-md disabled:cursor-not-allowed ${showOptions!=="close" ? "" : "hidden"}`} onClick={()=>{setShowOptions("close")}}>Close</button>
                <button disabled={perms.find((perm=> perm === TaskRoles.ADDMEMBERS.valueOf())) === undefined ? true : false} className={`bg-slate-600 text-white p-1 pl-2 pr-2 rounded-md disabled:cursor-not-allowed ${showOptions!=="add" ? "" : "hidden"}`} onClick={()=>{setShowOptions("add")}}>{showOptions!=="add" && "Add Member"}</button>
                <button disabled={perms.find((perm=> perm === TaskRoles.REMOVEMEMBERS.valueOf())) === undefined ? true : false} className={`bg-slate-600 text-white p-1 pl-2 pr-2 rounded-md disabled:cursor-not-allowed ${showOptions!=="delete" ? "" : "hidden"}`} onClick={()=>{setShowOptions("delete")}}>{showOptions!=="delete" && "Delete Member"}</button>
                <button disabled={!hasChanged} className="bg-blue-400 text-white p-1 pl-2 pr-2 rounded-md disabled:bg-blue-100" onClick={()=>updateTask(task.TASKID,taskReq,taskLink,taskLog,taskStatus,taskSprintID,perms)}>Save</button>
            </div>
            { showOptions==="add" &&
                <div className="flex flex-row justify-between gap-2 bg-[#d6dbdc]  p-2 rounded-lg">
                    <input type="email" className=" text-black p-1 rounded-md shadow-sm  w-1/2" placeholder="Enter Email to Add" value={taskUpdateEmail} onChange={(e)=>setTaskUpdateEmail(e.target.value)}/>
                    <select onChange={(e)=>setTaskUpdateSelectedRole(e.target.value)} defaultValue={taskUpdateSelectedRole} className="min-w-[100px] text-right pl-2 pr-2 bg-[#d6dbdc] text-black p-1 rounded-md shadow-sm border-black border-2">
                        {taskRoles.map((role,index)=>{
                            return(
                                <option value={role} key={index}>{role}</option>
                            )
                        })}
                    </select>
                    <button className="bg-green-400 text-white p-1 pl-2 pr-2 rounded-md cursor-pointer" onClick={()=>addMemberToTask(task.TASKID,taskUpdateEmail,taskUpdateSelectedRole)}>Add</button>
                </div>
            }
            { showOptions==="delete" &&
                <div className="flex flex-row justify-between gap-2 bg-[#d6dbdc]  p-2 rounded-lg">
                    <input type="email" className=" text-black p-1 rounded-md shadow-sm  w-1/2" placeholder="Enter Email to Remove" value={taskDeleteEmail} onChange={(e)=>setTaskDeleteEmail(e.target.value)}/>
                    <button className="bg-red-400 text-white p-1 pl-2 pr-2 rounded-md cursor-pointer" onClick={()=>deleteMemberFromTask(task.TASKID,taskDeleteEmail)}>Remove</button>
                </div>
            }
            {
                membersOfTask && 
                <div className="flex flex-col justify-between gap-2 bg-[#d6dbdc]  p-2 rounded-lg">
                    <div className="w-full flex flex-row justify-between text-xl font-bold border-b-2 border-black">
                        <span>Name</span>
                        <span>Role</span>
                    </div>
                    {
                    membersOfTask.map((member,index)=>{return(
                        <div className="flex flex-row justify-between gap-2 bg-[#d6dbdc]  p-2 rounded-lg" key={index}>
                            <span>{member.UsersName}</span>
                            <span>{member.RoleName}</span>
                        </div>
                    )})
                    }
                    
                </div>
            }
            
        </div>
    )
}