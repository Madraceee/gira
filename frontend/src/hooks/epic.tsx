'use client'
import { useRouter } from "next/router";
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";

// Details of the EPIC in view
export type EpicDetailsFull = {
    EPICNAME  : string,
    EPICDESCRIPTION : string,
    EPICFEATURES : string,
    EPICLINK : string,
    EPICSTARTDATE : string,
    EPICENDDATE : string,
    EPICOWNER : string
}

// Sprint Details
export type SprintDetails = {
    SPRINTNAME : string,
    SPRINTSTARTDATE : string,
    SPRINTENDDATE : string,
}

// Details of the TASK 
export type TaskDetails = {
    TASKID: string,
    TASKNAME : string,
    TASKREQ: string,
    TASKLINK: string,
    TASKLOG: string,    
    TASKSTATUS : string,
    TASKSPRINTID : string,
    TASKSTARTDATE : string,
    TASKENDDATE : string
}

// PERMISSION WHICH ARE AVAILBALE
// OPTIONS WILL BE RENDERED BASED ON THIS
// SAME ORDER IS MAINTAINED IN THE DB
// ENUM NUMBER SHOULD MATCH
export enum EpicRoles{
    ADDMEMBER,
    REMOVEMEMBER,
    ADDTASK,
    REMOVETASK,
    ADDSPRINT,
    REMOVESPRINT,
    EDITSPRINT
}

export enum TaskRoles{
    ADDMEMBERS,
    UPDATESTATUS,
    UPDATETASKFULL, // UPDATETASKFULL includes only Log, Status, Link, SPRINTID
    VIEW,    
    ASSIGNSPRINT,
    REMOVESPRINT
}



// Interface exposed to each EPIC page
export type EpicInterface = {
    currentEpicDetails : EpicDetailsFull,
    taskList : TaskDetails[],
    sprintList: SprintDetails[]
    epicRoles : EpicRoles[],
    isLoading : boolean,
    setCurrectEpicID :  Dispatch<SetStateAction<string>>,
}


// Type used for TaskEditor
export type TaskEditorType = TaskDetails & {
    perms : number[],
    sprint : SprintDetails[]
}
    


const epicContext = createContext<EpicInterface>({} as EpicInterface)

export default function EpicProvider ({ children }: { children: ReactNode }){
    
    const [currentEpicID,setCurrectEpicID] = useState<string>("");
    const [currentEpicDetails,setCurrentEpicDetails] = useState<EpicDetailsFull>({} as EpicDetailsFull)
    const [taskList,setTaskList] = useState<TaskDetails[]>([] as TaskDetails[])
    const [sprintList,setSprintList] = useState<SprintDetails[]>([] as SprintDetails[])
    const [epicRoles, setEpicRoles] = useState<EpicRoles[]>([] as EpicRoles[])
    
    const [isLoading,setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<string>("")


    useEffect(()=>{
        if(currentEpicID === ""){
            return
        }

        setIsLoading(true)        
        setTimeout(()=>{
            setIsLoading(false)
        },3000)

        // Get Epic Details

        // Get Sprint Details
        
        // Get Task List

        // Get Epic Roles
    },[currentEpicID])

    return(
        <epicContext.Provider value={{currentEpicDetails,taskList,epicRoles,setCurrectEpicID,isLoading,sprintList}}>
            {children}
        </epicContext.Provider>
    )
}

export function useEpic(){
    return useContext(epicContext)
}