'use client'
import { EpicDetailsFull, EpicPerms, SprintDetails, useEpic } from "@/hooks/epic";
import { closeModal, openModal } from "@/redux/modal/modalSlice";
import { RootState } from "@/redux/store";
import { dateToString } from "@/utils/helper";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import DisableDeleteAcc from "./ModalComponents/DisableDeleteAcc";

export default function EpicDetails({epicDetails,sprintDetails} : {epicDetails: EpicDetailsFull, sprintDetails : SprintDetails[]}){
    const headingStyle = "font-bold text-xl";
    const groupStyle = "whitespace-pre-wrap break-words";
    const router  = useRouter()
    const dispatch = useDispatch()

    const {id,token} = useSelector((state:RootState)=>state.user)
    const {currentEpicDetails} = useEpic()

    const deleteEpic = async()=>{
        try{
            const response = await axios.delete("http://localhost:8080/epic/deleteEpic",{
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                data:{
                    "epic_id" : `${currentEpicDetails.EpicID}`
                }
            })

            if(response.status===200){
                router.push("/dashboard")
                dispatch(closeModal())
            }
        }catch(err:any){
            console.log(err)
            if(err.response.data){
                alert(err.response.data)
            }
        }
    }
    
    return(
        <div className="w-full bg-black/80 text-white/90 text-lg p-2 rounded-b-md flex flex-col gap-3 lg:flex-row ">
            <div className="w-full lg:w-1/2 flex flex-col gap-1">
                <p className={groupStyle}><span className={headingStyle}>Epic Name: </span>{epicDetails.EpicName}</p>
                <p className={groupStyle}><span className={headingStyle}>Epic Description: </span>{epicDetails.EpicDescription}</p>
                <p className={groupStyle}><span className={headingStyle}>Epic Features: </span>{epicDetails.EpicFeatures}</p>
                {epicDetails.EpicLink.Valid && <p className={groupStyle}><span className={headingStyle}>Epic Link: </span>{epicDetails.EpicLink.String}</p>}
                <p className={groupStyle}><span className={headingStyle}>Epic Start Date: </span>{dateToString(epicDetails.EpicStartDate)}</p>
                {epicDetails.EpicEndDate.Valid && <p className={groupStyle}><span className={headingStyle}>Epic End Date: </span>{dateToString(epicDetails.EpicEndDate.Time)}</p>}
                {epicDetails.EpicOwner === id && <button className="max-w-[150px] p-1 bg-red-500 rounded-md" onClick={()=>dispatch(openModal({header:"Delete Epic",children:<DisableDeleteAcc executeAction={deleteEpic}/>}))}>Delete Epic</button>}
            </div>
            
            <div className="w-full lg:w-1/2">
                {sprintDetails.length > 0 && 
                    <>
                        <h1 className={headingStyle}>Sprint Details</h1>
                        {sprintDetails.map((sprint,index)=>{
                            return (
                                <div key={index} className="w-full flex flex-row justify-between ">
                                    <span>Sprint-{sprint.SprintID}</span>
                                    <span>{dateToString(sprint.SprintStartDate)}</span>
                                    <span>{dateToString(sprint.SprintEndDate)}</span>
                                </div>
                            )
                        })}
                    </>
                }
            </div>            
        </div>
    )   
} 