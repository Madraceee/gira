'use client'
import ResultDisplay from "@/components/ModalComponents/ResultDisplay";
import { openModal } from "@/redux/modal/modalSlice";
import { RootState } from "@/redux/store";
import { dateToString } from "@/utils/helper";
import axios from "axios";
import { useRouter } from "next/router";
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
    setCurrectEpicID :  Dispatch<SetStateAction<string>>,
    submitTask : (taskName: string,taskReq: string, startDate: Date,endDate: Date)=>Promise<void>
}


// Type used for TaskEditor
export type TaskEditorType = TaskDetails & {
    perms : number[],
    sprint : SprintDetails[]
}
    


const epicContext = createContext<EpicInterface>({} as EpicInterface)

export default function EpicProvider ({ children }: { children: ReactNode }){
    
    const dispatch = useDispatch()
    const [currentEpicID,setCurrectEpicID] = useState<string>("");
    const [currentEpicDetails,setCurrentEpicDetails] = useState<EpicDetailsFull>({} as EpicDetailsFull)
    const [taskList,setTaskList] = useState<TaskDetails[]>([] as TaskDetails[])
    const [sprintList,setSprintList] = useState<SprintDetails[]>([] as SprintDetails[])
    const [epicPerms, setEpicPerms] = useState<number[]>([] as number[])
    
    const [isLoading,setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)

    const token = useSelector((state:RootState)=>state.user.token)

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
            if(sprintsResponse.data !== null ) {
                setSprintList(sprintsResponse.data)
            }     

            const epicPermsResponse = await axios.get(`http://localhost:8080/epic/getEpicPerms/${currentEpicID}`,{
                headers : {
                    Authorization: `Bearer ${token}`
                }
            }) 
            if(epicPermsResponse.data!== null){
                setEpicPerms(epicPermsResponse.data)
            }    
            
            const tasksResponse = await axios.get(`http://localhost:8080/task/GetUserTasks/${currentEpicID}`,{
                headers : { Authorization : `Bearer ${token}`}
            })

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
        
    },[currentEpicID])


    const submitTask = useCallback(async(taskName: string,taskReq: string, startDate: Date,endDate: Date)=>{
        startDate.setHours(0,0,0,0);
        endDate.setHours(0,0,0,0);

        try{
            const taskResponse = await axios.post("http://localhost:8080/task/createTask",{
                "epic_id": currentEpicDetails.EpicID,
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
    },[]);

    return(
        <epicContext.Provider value={{currentEpicDetails,taskList,epicPerms,setCurrectEpicID,isLoading,sprintList,submitTask}}>
            {children}
        </epicContext.Provider>
    )
}

export function useEpic(){
    return useContext(epicContext)
}