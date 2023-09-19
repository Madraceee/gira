'use client'
import ResultDisplay from "@/components/ModalComponents/ResultDisplay";
import { openModal } from "@/redux/modal/modalSlice";
import { RootState } from "@/redux/store";
import { dateToString } from "@/utils/helper";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Dispatch, ReactNode, SetStateAction, createContext, useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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

// Response Data for a TAS
interface ResponseData {
    TaskID: string;
    TaskName: string;
    TaskReq: string;
    TaskLog: {
      String: string;
      Valid: boolean;
    };
    TaskLink: {
      String: string;
      Valid: boolean;
    };
    TaskStartDate: string;
    TaskEndDate: {
      Time: string;
      Valid: boolean;
    };
    TaskStatus: string;
    TaskSprintID: {
      Int32: number;
      Valid: boolean;
    };
  }

// PERMISSION WHICH ARE AVAILBALE
// OPTIONS WILL BE RENDERED BASED ON THIS
// SAME ORDER IS MAINTAINED IN THE DB
// ENUM NUMBER SHOULD MATCH
export enum EpicPerms{
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
    UPDATETASKFULL,
    ADDMEMBERS,
    REMOVEMEMBERS
}



// Interface exposed to each EPIC page
export type EpicInterface = {
    currentEpicDetails : EpicDetailsFull,
    taskList : TaskDetails[],
    sprintList: SprintDetails[]
    epicPerms : number[],
    isLoading : boolean,
    taskRoles : string[],
    setCurrectEpicID :  Dispatch<SetStateAction<string>>,
    setToggleReload: Dispatch<SetStateAction<boolean>>,
    submitTask : (taskName: string,taskReq: string, startDate: Date,endDate: Date)=>Promise<void>
    updateTask: (taskId : string,req : string,link : string,log : string,status : string,sprintId: string,perms:number[])=>Promise<void>,
    addMemberToTask: (taskId:string,email:string,role:string) => Promise<void>,
    deleteMemberFromTask : (taskId:string,email:string) => Promise<void>,
    addSprint: (startDate : string,endDate:string)=>Promise<void>
    deleteSprint: (sprintID : number )=>Promise<void>
}


// Type used for TaskEditor
export type TaskEditorType = TaskDetails & {
    sprint : SprintDetails[]
}
    

const epicContext = createContext<EpicInterface>({} as EpicInterface)

export default function EpicProvider ({ children }: { children: ReactNode }){
    
    const dispatch = useDispatch()
    const router = useRouter()
    const [currentEpicID,setCurrectEpicID] = useState<string>("");
    const [currentEpicDetails,setCurrentEpicDetails] = useState<EpicDetailsFull>({} as EpicDetailsFull)
    const [taskList,setTaskList] = useState<TaskDetails[]>([] as TaskDetails[])
    const [sprintList,setSprintList] = useState<SprintDetails[]>([] as SprintDetails[])
    const [epicPerms, setEpicPerms] = useState<number[]>([] as number[])
    const [taskRoles, setTaskRoles] = useState<string[]>([] as string[])
    
    const [isLoading,setIsLoading] = useState<boolean>(false)
    const [isError,setIsError] = useState<boolean>(false)

    const [toggleReload,setToggleReload] = useState<boolean>(false);

    const token = useSelector((state:RootState)=>state.user.token)

    const getInfo = async()=>{
        setIsLoading(true)        
        setIsError(false)
        try{
            // Get Epic Detail
            const epicResponse = await axios.get(`http://localhost:8080/epic/getEpic/${currentEpicID}`,{
                headers : {
                    Authorization: `Bearer ${token}`
                }
            })                
            setCurrentEpicDetails(epicResponse.data)

            // Get List of sprints
            const sprintsResponse = await axios.get(`http://localhost:8080/sprint/getSprints/${currentEpicID}`,{
                headers : {
                    Authorization: `Bearer ${token}`
                }
            })
            if(sprintsResponse.data !== null ) {
                setSprintList(sprintsResponse.data)
            }     

            // Get Permission of user for the EPIC
            const epicPermsResponse = await axios.get(`http://localhost:8080/epic/getEpicPerms/${currentEpicID}`,{
                headers : {
                    Authorization: `Bearer ${token}`
                }
            }) 
            if(epicPermsResponse.data!== null){
                setEpicPerms(epicPermsResponse.data)
            }    
            
            // Get the list of task accessible by User
            const tasksResponse = await axios.get(`http://localhost:8080/task/GetUserTasks/${currentEpicID}`,{
                headers : { Authorization : `Bearer ${token}`}
            })

            if(tasksResponse.data!==null){
                const transformedArray = tasksResponse.data.map((response : ResponseData) => {
                    const sprint = response.TaskSprintID.Valid ? response.TaskSprintID.Int32.toString() : ""
                    const endDate = response.TaskEndDate.Valid ? dateToString(response.TaskEndDate.Time) : ""
                    return {
                        TASKID: response.TaskID,
                        TASKNAME: response.TaskName,
                        TASKREQ: response.TaskReq,
                        TASKLINK: response.TaskLink.String,
                        TASKLOG: response.TaskLog.String,
                        TASKSTATUS: response.TaskStatus,
                        TASKSPRINTID: sprint,
                        TASKSTARTDATE: dateToString(response.TaskStartDate),
                        TASKENDDATE: endDate,
                      };
                })
                if(transformedArray !== null ){
                    setTaskList(transformedArray)
                }
            }
            

            //Get List of Task Perms
            const taskPermissions = await axios.get(`http://localhost:8080/task/getRolesForTasks/${currentEpicID}`,{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })
            if(taskPermissions.data!== null){
                setTaskRoles(taskPermissions.data)
            }

            setIsError(false)

        }catch(err : any){
            setIsError(true)
            console.log(err)
        }
        setIsLoading(false)
    }

    useEffect(()=>{
        if(currentEpicID === ""){
            return
        }
        getInfo()
    },[currentEpicID,toggleReload])

    useEffect(()=>{
        if(isError == true){
            router.push("/dashboard")
        }
    },[isError])


    const submitTask = useCallback(async(taskName: string,taskReq: string, startDate: Date,endDate: Date)=>{
        startDate.setHours(0,0,0,0);
        endDate.setHours(0,0,0,0);
        try{
            const taskResponse = await axios.post("http://localhost:8080/task/createTask",{
                "epic_id": currentEpicID,
                "name": taskName,
                "req": taskReq,
                "start_date": startDate,
                "end_date": endDate
            },{
                headers :{
                    Authorization : `Bearer ${token}`
                }
            });

            if(taskResponse.status === 200){
                dispatch(openModal({header:"",children:<ResultDisplay msg={"Success"}/>}))
                getInfo()
            }
        }catch(err:any){
            dispatch(openModal({header:"",children:<ResultDisplay msg={"Failure"}/>}))
            console.log(err)
        }      
    },[currentEpicID]);


    const updateTask = useCallback(async(taskId : string,req : string,link : string,log : string,status : string,sprintId: string,perms: number[])=>{
        
        
        try{
            if (perms.find(perm => perm === TaskRoles.UPDATETASKFULL.valueOf())){
                const updateResponse = await axios.patch("http://localhost:8080/task/updateTaskFull",{
                "epic_id": currentEpicID,
                "task_id": taskId,
                "sprint_id": (sprintId === "" ? 0 : parseInt(sprintId)),
                "link": link,
                "log": log,
                "status": status
                },{
                    headers : {Authorization: `Bearer ${token}`}
                });

                if(updateResponse.status === 200){
                    dispatch(openModal({header:"",children:<ResultDisplay msg={"Success"}/>}))
                    getInfo()
                }
            }else if(perms.find(perm => perm === TaskRoles.UPDATESTATUS.valueOf())){
                const updateResponse = await axios.patch("http://localhost:8080/task/updateStatus",{
                    "epic_id": currentEpicID,
                    "task_id": taskId,
                    "status": status
                    },{
                        headers : {Authorization: `Bearer ${token}`}
                });

                if(updateResponse.status === 200){
                    dispatch(openModal({header:"",children:<ResultDisplay msg={"Success"}/>}))
                    getInfo()
                }
            }
            
        }catch(err:any){
            dispatch(openModal({header:"",children:<ResultDisplay msg={"Failure"}/>}))
            console.log(err)
        }
    },[currentEpicID])   

    // Add Member to a task
    const addMemberToTask = useCallback(async(taskId:string,email:string,role:string) =>{
        try{
            const addMemberResponse = await axios.post(`http://localhost:8080/task/addMemberToTask`,{
                "epic_id": currentEpicID,
                "task_id": taskId,
                "member_email": email,
                "role_name": role
            },{
                headers: {Authorization: `Bearer ${token}`}
            })

            if(addMemberResponse.status === 200){
                dispatch(openModal({header:"Add Member",children: <ResultDisplay msg={"Success"}/>}))
            }
        }catch(err){
            dispatch(openModal({header:"Add Member",children: <ResultDisplay msg={"Failure"}/>}))
            console.log(err)
        }
    },[currentEpicID])

    // Delete Member from task
    const deleteMemberFromTask = useCallback(async(taskId:string,email:string) =>{
        try{
            const addMemberResponse = await axios.delete(`http://localhost:8080/task/deleteMemberFromTask`,{
                data:{
                    "epic_id": currentEpicID,
                    "task_id": taskId,
                    "member_email": email,
                },
                headers: { 
                    Authorization: `Bearer ${token}`
                }               
            },)

            if(addMemberResponse.status === 200){
                dispatch(openModal({header:"Add Member",children: <ResultDisplay msg={"Success"}/>}))
            }
        }catch(err){
            dispatch(openModal({header:"Add Member",children: <ResultDisplay msg={"Failure"}/>}))
            console.log(err)
        }
    },[currentEpicID])

    //Add Sprint
    const addSprint = useCallback(async(startDate : string,endDate:string)=>{
        try{
            const sprintRespone = await axios.post("http://localhost:8080/sprint/createSprint",{
                "epic_id": currentEpicID,
                "start_date": startDate,
                "end_date": endDate
            },{
                headers : {
                    Authorization: `Bearer ${token}`
                }
            })

            if(sprintRespone.status === 200){
                dispatch(openModal({headers: "" , children:<ResultDisplay msg={"Success"}/>})) 
                getInfo()
            }
        }catch(err){
            console.log(err)
            dispatch(openModal({headers: "" , children:<ResultDisplay msg={"Failure"}/>})) 
            return;
        }
    },[currentEpicID])

    // Delete Sprint
    const deleteSprint = useCallback(async(sprintID : number)=>{
        try{
            const sprintRespone = await axios.delete("http://localhost:8080/sprint/deleteSprint",{
                    headers : {
                        Authorization: `Bearer ${token}`
                    },
                    data: {
                            "epic_id": currentEpicID,
                            "sprint_id": sprintID
                    }
                })

                if(sprintRespone.status === 200){
                    dispatch(openModal({headers: "" , children:<ResultDisplay msg={"Success"}/>})) 
                    getInfo()
                }
        }catch(err){
            console.log(err)
            dispatch(openModal({headers: "" , children:<ResultDisplay msg={"Failure"}/>})) 
            return;
        }
    },[currentEpicID])


    return(
        <epicContext.Provider value={{currentEpicDetails,taskList,epicPerms,taskRoles,setCurrectEpicID,isLoading,sprintList,submitTask,updateTask,addMemberToTask,deleteMemberFromTask,addSprint,deleteSprint,setToggleReload}}>
            {children}
        </epicContext.Provider>
    )
}

export function useEpic(){
    return useContext(epicContext)
}