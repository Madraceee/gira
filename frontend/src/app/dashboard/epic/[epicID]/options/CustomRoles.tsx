'use client'
import ResultDisplay from "@/components/ModalComponents/ResultDisplay";
import { useEpic } from "@/hooks/epic";
import { openModal } from "@/redux/modal/modalSlice";
import { RootState } from "@/redux/store";
import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CustomRoles(){

    const token = useSelector((state:RootState)=>state.user.token)
    const {currentEpicDetails,setToggleReload} = useEpic()
    const dispatch = useDispatch()

    const [taskValues, setTaskValues] = useState<number[]>([]);
    const [taskRole, setTaskRole] = useState<string>("");

    const [epicValues, setEpicValues] = useState<number[]>([]);
    const [epicRole, setEpicRole] = useState<string>("");   

    
    // For assigning Member to EPIC role
    // Fetch the existing role
    const [epicRoles,setEpicRoles] = useState<string[]>([])
    const [memberEmail, setMemberEmail] = useState<string>("");
    const [memberRole,setMemberRole] = useState<string>("Select")

    const handleTaskPermissions = (e: ChangeEvent<HTMLInputElement>): void => {
        const selectedValue = parseInt(e.target.value);
        if (taskValues.includes(selectedValue)) {
            setTaskValues(taskValues.filter((value:number) => value !== selectedValue));
        } else {
            setTaskValues([...taskValues, selectedValue]);
        }
    }

    const handleEpicPermissions = (e: ChangeEvent<HTMLInputElement>): void => {
        const selectedValue = parseInt(e.target.value);
        if (epicValues.includes(selectedValue)) {
            setEpicValues(epicValues.filter((value:number) => value !== selectedValue));
        } else {
            setEpicValues([...epicValues, selectedValue]);
        }
    }

    const taskOptions = [
        {value: 1 , label: "View"},
        {value: 2 , label: "Update Status"},
        {value: 3 , label: "Update Task Full"},
        {value: 4 , label: "Add Member"},
        {value: 5 , label: "Remove Member"}
    ]

    const epicOptions = [
        {value: 100 , label: "Add Member to Epic"},
        {value: 101 , label: "Remove Member from Epic"},
        {value: 102 , label: "Add Task"},
        {value: 104 , label: "Add Sprint"},
        {value: 105 , label: "Remove Sprint"},
    ]


    const addTaskRole = async()=>{
        if(taskRole === ""){
            return
        }
        try{
            const response = await axios.post("http://localhost:8080/task/addTaskRole",{
                "epic_id": currentEpicDetails.EpicID,
                "role_name": taskRole,
                "perms": taskValues
            },{
                headers: {
                    Authorization : `Bearer ${token}`
                }
            })

            if(response.status === 200){
                dispatch(openModal({header:"",children:<ResultDisplay msg={"Success"}/>}))
                setToggleReload(state=>!state)
            }
        }catch(err:any){
            console.log(err)
            if(err.response.data){
                dispatch(openModal({header:"",children:<ResultDisplay msg={err.response.data.error}/>}))
                return
            }
        }
    }

    const addEpicRole = async()=>{
        if(epicRole === ""){
            return
        }
        try{
            const response = await axios.post("http://localhost:8080/epic/addEpicRole",{
                "epic_id": currentEpicDetails.EpicID,
                "role_name": epicRole,
                "perms": epicValues
            },{
                headers: {
                    Authorization : `Bearer ${token}`
                }
            })

            if(response.status === 200){
                dispatch(openModal({header:"",children:<ResultDisplay msg={"Success"}/>}))
                setToggleReload(state=>!state)
                fetchEpicRoles()
            }
        }catch(err:any){
            console.log(err)
            if(err.response.data){
                dispatch(openModal({header:"",children:<ResultDisplay msg={err.response.data.error}/>}))
                return
            }
        }
    }

    const fetchEpicRoles = async()=>{
        try{
            const response = await axios.get(`http://localhost:8080/epic/GetAllRolesForEpic/${currentEpicDetails.EpicID}`,{
                headers: {
                    Authorization:`Bearer ${token}`
                }
            })

            if(response.status === 200){
                setEpicRoles(response.data)
            }
        }catch(err){
            console.log(err)
        }
    }

    const assignMemberEpicRole = async()=>{
        const emailPattern = /^[A-Z0-9._]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if(!emailPattern.test(memberEmail)){
            dispatch(openModal({header:"",children:<ResultDisplay msg={"Enter Valid Email"}/>}))
            setMemberEmail("")
            return
        }

        if(memberRole === "Select"){
            dispatch(openModal({header:"",children:<ResultDisplay msg={"Choose Option"}/>}))
            return
        }

        try{
            const response = await axios.post("http://localhost:8080/epic/addAssignEpicRoleToUser",{
                "epic_id": currentEpicDetails.EpicID,
                "role_name": memberRole,
                "member_email":memberEmail
            },{
                headers:{
                    Authorization: `Bearer ${token}`
                }
            })

            if(response.status === 200){
                dispatch(openModal({header:"",children:<ResultDisplay msg={"Success"}/>}))
            }

        }catch(err:any){
            if(err.response.data){
                dispatch(openModal({header:"",children:<ResultDisplay msg={err.response.data.error}/>}))                
            }else{
                dispatch(openModal({header:"",children:<ResultDisplay msg={"Error"}/>}))
            }
            setMemberEmail("")
            setMemberRole("Select")
            console.log(err)
        }
    }

    useEffect(()=>{
        fetchEpicRoles()
    },[])

    return(
        <div className="flex gap-4 flex-col items-center w-full">
            <div className="w-full md:w-1/2 flex flex-col text-xl bg-white p-2 rounded-lg">
                <span className="text-2xl">Add Task Permissions</span>
                <input type="text" placeholder="Enter Task Role name" className="p-2 bg-[#d6dbdcd9] rounded-md" value={taskRole} onChange={(e)=>setTaskRole(e.target.value)}/>
                {taskOptions.map((option) => (
                    <label key={option.value} className="flex gap-1">
                    <input
                        type="checkbox"
                        value={option.value}
                        onChange={(e)=>handleTaskPermissions(e)}
                        checked={taskValues.includes(option.value)}
                    />
                    {option.label}
                    </label>
                ))}
                <button className="w-full text-center bg-blue-300 rounded-md hover:bg-blue-400 transition-colors ease-in-out disabled:cursor-not-allowed" disabled={taskValues.length === 0 || taskRole.length === 0} onClick={addTaskRole}>
                    Add Task Role
                </button>
                
            </div>
            <div className="w-full md:w-1/2 flex flex-col text-xl bg-white p-2 rounded-lg">
                <span className="text-2xl">Add Epic Permissions</span>
                <input type="text" placeholder="Enter Epic Role name" className="p-2 bg-[#d6dbdcd9] rounded-md" value={epicRole} onChange={(e)=>setEpicRole(e.target.value)}/>
                {epicOptions.map((option) => (
                    <label key={option.value} className="flex gap-1">
                    <input
                        type="checkbox"
                        value={option.value}
                        onChange={(e)=>handleEpicPermissions(e)}
                        checked={epicValues.includes(option.value)}
                    />
                    {option.label}
                    </label>
                ))}
                <button className="w-full text-center bg-blue-300 rounded-md hover:bg-blue-400 transition-colors ease-in-out disabled:cursor-not-allowed" disabled={epicValues.length === 0 || epicRole.length === 0} onClick={addEpicRole}>
                    Add Epic Role
                </button>
            </div>
            <div className="w-full md:w-1/2 flex flex-col text-xl bg-white p-2 rounded-lg gap-2 shadow-2xl">
                <span className="text-xl">Assign Member their role</span>
                <input type="email" placeholder="Enter Email" value={memberEmail} onChange={(e)=>setMemberEmail(e.target.value)} className="p-2 bg-[#d6dbdcd9] rounded-md"/>
                <div className="flex gap-1 justify-between">
                    <select onChange={(e)=>setMemberRole(e.target.value)} defaultValue={memberRole} className="w-5/12 text-right pl-2 pr-2 bg-[#d6dbdc] text-black p-1 rounded-md shadow-sm border-black border-2">
                        <option value={0}>Select</option>
                        {epicRoles && epicRoles.map((role,index)=>{
                            return(
                                <option value={role} key={index}>{role}</option>
                            )
                        })}
                    </select>
                    <button className="w-5/12 text-center bg-blue-300 rounded-md hover:bg-blue-400 transition-colors ease-in-out disabled:cursor-not-allowed" onClick={assignMemberEpicRole}>Submit</button>
                </div>
            </div>
            
        </div>
    )
}