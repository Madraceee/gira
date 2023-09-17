'use client'
import { RootState } from "@/redux/store";
import axios from "axios";
import { useRouter } from "next/router";
import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

// Details of the EPIC in view
export type EpicDetailsFull = {
    EpicID : string,
    EpicName  : string,
    EpicDescription : string,
    EpicFeatures : string,
    EpicLink : {String : string,Valid : boolean},
    EpicStartDate : string,
    EpicEndDate : {Time : string,Valid : boolean},
    EpicOwner : string
}

// Sprint Details
export type SprintDetails = {
    SprintID : number,
    SprintStartDate : string,
    SprintEndDate : string,
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
    ADDMEMBER=100,
    REMOVEMEMBER,
    ADDTASK,
    REMOVETASK,
    ADDSPRINT,
    REMOVESPRINT,
    EDITSPRINT
}

export enum TaskRoles{
    VIEW=1,
    UPDATESTATUS,
    UPDATETASKFULL, // UPDATETASKFULL includes only Log, Status, Link, SPRINTID
    ADDMEMBERS,
    REMOVEMEMBERS
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
    const [isError, setIsError] = useState<boolean>(false)

    const token = useSelector((state:RootState)=>state.user.token)

    useEffect(()=>{
        if(currentEpicID === ""){
            return
        }

        const getInfo = async()=>{
            setIsLoading(true)        

            try{
                const epicResponse = await axios.get(`http://localhost:8080/epic/getEpic/${currentEpicID}`,{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                })                
                setCurrentEpicDetails(epicResponse.data)

                const sprintsResponse = await axios.get(`http://localhost:8080/sprint/getSprints/${currentEpicID}`,{
                    headers : {
                        Authorization: `Bearer ${token}`
                    }
                })                
                setSprintList(sprintsResponse.data)

                console.log(currentEpicDetails,sprintList)
            }catch(err : any){
                setIsError(true)
                console.log(err)
            }
            setIsLoading(false)

            
            // Get Task List

            // Get Epic Roles
        }
        getInfo()
        
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