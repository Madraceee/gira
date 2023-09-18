'use client'

import ResultDisplay from "@/components/ModalComponents/ResultDisplay";
import { EpicPerms, useEpic } from "@/hooks/epic";
import { openModal } from "@/redux/modal/modalSlice";
import { RootState } from "@/redux/store";
import { dateToString, inputDate } from "@/utils/helper";
import axios from "axios";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


type Member = {
    UsersName : string,
    UsersEmail : string
}

export default function Page(){
    const dispatch = useDispatch()
    const router = useRouter();
    const token = useSelector((state:RootState)=>state.user.token)
    const email = useSelector((state:RootState)=>state.user.email)
    const {currentEpicDetails,epicPerms,sprintList,addSprint,deleteSprint} = useEpic();

    const [memberEmail,setMemberEmail] = useState<string>("")
    const [membersList,setMembersList] = useState<Member[]>([])

    const [startDate,setStartDate] = useState<Date>(new Date())
    const [endDate,setEndDate] = useState<Date>(new Date())


    const fetchDetails = async()=>{
        try{
            const response = await axios.get(`http://localhost:8080/user/getUsersOfEpic/${currentEpicDetails.EpicID}`,{
                headers:{
                    Authorization : `Bearer ${token}`
                }
            })
            setMembersList(response.data)
        }catch(err:any){
            if(err.response){
                console.log(err.response.data.err)
            }
            console.log(err)
        }        
    }

    const addMember = async()=>{
        const emailPattern = /^[A-Z0-9._]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if(!emailPattern.test(memberEmail)){
            dispatch(openModal({header:"",children: <ResultDisplay msg={"Enter Proper Mail"}/>}))
        }
        try{
            const response = await axios.post(`http://localhost:8080/epic/addMember`,{
                "epic_id": currentEpicDetails.EpicID,
                "user_email": memberEmail
            },{headers:{Authorization:`Bearer ${token}`}});

            if(response.status === 200){
                dispatch(openModal({header:"",children: <ResultDisplay msg={"Success"}/>}))
                fetchDetails()
            }
        }catch(err){
            dispatch(openModal({header:"",children: <ResultDisplay msg={"Failure"}/>}))
        }
        setMemberEmail("")
    }

    const deleteMember = async(email: string)=>{
        try{
            const response = await axios.delete(`http://localhost:8080/epic/deleteMember`,{
                data:{
                    "epic_id": currentEpicDetails.EpicID,
                    "user_email": email
                },
                headers : { 
                    Authorization: `Bearer ${token}`
                }
            })
            if(response.status === 202){
                dispatch(openModal({header:"",children: <ResultDisplay msg={"Success"}/>}))
                fetchDetails()
            }
        }catch(err){
            console.log(err)
            dispatch(openModal({header:"",children: <ResultDisplay msg={"Failure"}/>}))
        }
    }


    const addSprintData = async()=>{
        startDate.setHours(0,0,0,0)
        endDate.setHours(0,0,0,0)

        if(endDate < startDate){
            dispatch(openModal({headers: "" , children:<ResultDisplay msg={"End Date is Less than Start Date"}/>})) 
            return;
        }       
        
        addSprint(startDate.toISOString(),endDate.toISOString())
    }

    useEffect(()=>{

        fetchDetails()
        
    },[])

    const style = "flex flex-row  w-full items-center m-auto justify-between"
    return(
        <div className="w-full h-full flex flex-col gap-4 lg:flex-row lg:flex-wrap justify-around">
            <div className="flex flex-col gap-3 lg:w-5/12 p-2">
                    <div className={`${style} pl-2 pr-2 mt-5 w-full flex flex-row`}>
                            <span className=" text-2xl font-semibold">Members List</span>
                            <button className="bg-blue-500/50 p-2  rounded-md text-white shadow-lg " onClick={()=>router.push(`/dashboard/epic/${currentEpicDetails.EpicID}`)}>Go To Epic Page</button>
                    </div>
                    {epicPerms.find(perm=>perm===EpicPerms.ADDMEMBER.valueOf()) &&
                        <div className={`${style} gap-5  text-sm md:text-xl bg-white p-2 rounded-md`}>
                            <input type="email" name="memberEmail" id="memberEmail" placeholder="Enter Email" className="bg-[#d6dbdcd9] p-1 shadow-inner" value={memberEmail} onChange={(e)=>setMemberEmail(e.target.value)}/>
                            <button className="bg-blue-500/50 p-2  rounded-md text-white shadow-lg " onClick={addMember}>Add Member</button>
                        </div>
                    }        
                    {membersList.map((member,index)=>{
                        return (
                            <div className={`${style} gap-5  text-sm md:text-xl bg-white p-2 rounded-md`} key={index}>
                                <span>{member.UsersName}</span>
                                <span>{member.UsersEmail}</span>
                                    {epicPerms.find(perm=>perm===EpicPerms.REMOVEMEMBER.valueOf()) && member.UsersEmail !== email &&
                                        <button onClick={()=>deleteMember(member.UsersEmail)}>
                                            <svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" className="icon hover:fill-red-500 hover:scale-105 transition-transform ease-in-out">
                                                <path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path>
                                            </svg>
                                        </button>
                                    }
                            </div>
                            )
                        })
                    }
            </div>
            <div className="flex flex-col gap-3 lg:w-5/12 p-2">
                    <div className={`${style} pl-2 pr-2 mt-5 w-full flex flex-row`}>
                            {(epicPerms.find(perm=>perm===EpicPerms.ADDSPRINT.valueOf())===undefined || sprintList.length === 0) &&
                             <span className=" text-2xl font-semibold">Sprints List</span>
                            }
                    </div>
                    {epicPerms.find(perm=>perm===EpicPerms.ADDSPRINT.valueOf()) &&
                        <div className={`${style} gap-5  text-sm md:text-xl bg-white p-2 rounded-md`}>
                            <input type="date" name="startDate" id="startDate" value={inputDate(startDate)} onChange={(e)=>setStartDate(new Date(e.target.value))} className="border-2 border-black rounded-md"/>   
                            <span>-&gt;</span>                         
                            <input type="date" name="endDate" id="endDate" value={inputDate(endDate)} onChange={(e)=>setEndDate(new Date(e.target.value))} className="border-2 border-black rounded-md"/>
                            <button className="bg-blue-500/50 p-2  rounded-md text-white shadow-lg " onClick={addSprintData}>Add Sprint</button>
                        </div>
                    }        
                    {sprintList.map((sprint,index)=>{
                        return (
                            <div className={`${style} gap-5  text-sm md:text-xl bg-white p-2 rounded-md`} key={index}>
                                <span>{sprint.SprintID}</span>
                                <span>{dateToString(sprint.SprintStartDate)}</span>
                                <span>To</span>
                                <span>{dateToString(sprint.SprintEndDate)}</span>
                                    {epicPerms.find(perm=>perm===EpicPerms.REMOVEMEMBER.valueOf()) &&
                                        <button onClick={()=>deleteSprint(sprint.SprintID)}>
                                            <svg viewBox="0 0 15 17.5" height="17.5" width="15" xmlns="http://www.w3.org/2000/svg" className="icon hover:fill-red-500 hover:scale-105 transition-transform ease-in-out">
                                                <path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path>
                                            </svg>
                                        </button>
                                    }
                            </div>
                            )
                        })
                    }
            </div>
            <div>
                Hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
            </div>
        </div>
    )
}